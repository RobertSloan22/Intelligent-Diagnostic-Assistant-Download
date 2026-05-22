# Agent Context Grounding — Integration Guide

## Problem Being Solved

The realtime agent was losing track of three pieces of state:

1. **OBD adapter connection status** — it inferred connection state from what was said
   in conversation rather than reading authoritative system state.
2. **Mode 06 test results** — it recalled test outcomes from memory, leading to
   misattributed pass/fail counts after long sessions.
3. **Bootstrap results** — initialization step results were stated once and then
   depended on throughout the session without being re-verified.

The root cause in all three cases: **the agent's context was conversation-driven,
not state-driven**. When reality changed, the conversation did not catch up.

## Architecture Overview

```
OBD Service / Route Handlers
        │
        ▼
DiagnosticStateManager          ← single source of truth
        │ emits "stateChanged"
        ▼
RealtimeContextGrounding        ← listens, pushes session.update
        │ calls sendToRealtime()
        ▼
OpenAI Realtime API session     ← agent now has verified state
```

The `AgentContextBuilder` renders a `## VERIFIED SYSTEM STATE` block that is
always prepended to the agent's system prompt. This block supersedes any
contradictory information in conversation history.

## Integration Steps

### 1. Create a singleton state manager per session

```typescript
import { DiagnosticStateManager, AgentContextBuilder } from "./agent/context";
import { RealtimeContextGrounding } from "./agent/realtime";

// Typically one per user session, stored in session state / req.session
const stateManager = new DiagnosticStateManager();
const contextBuilder = new AgentContextBuilder();
```

### 2. Wire the grounding into the Realtime WebSocket handler

```typescript
// In your /api/realtime/* WebSocket upgrade handler:
const grounding = new RealtimeContextGrounding(
  stateManager,
  contextBuilder,
  (message) => realtimeWs.send(JSON.stringify(message)),  // your ws client
  TARS_BASE_INSTRUCTIONS  // your existing persona prompt
);

realtimeWs.on("open", () => grounding.attach());
realtimeWs.on("close", () => grounding.detach());
```

### 3. Update state from your OBD service callbacks

**On adapter connection events:**
```typescript
// When ELM327/OBDLink begins connecting:
stateManager.setAdapterConnecting(deviceIdentifier, adapterType);

// When connection + protocol negotiation succeeds:
stateManager.setAdapterConnected(negotiatedProtocol);

// When the adapter disconnects (intentional or dropped):
stateManager.setAdapterDisconnected();

// When connection fails:
stateManager.setAdapterError(errorMessage);
```

**After bootstrap completes:**
```typescript
import type { BootstrapStepResult } from "./agent/context";

// Build from your existing bootstrap response data:
const steps: BootstrapStepResult[] = [
  { step: "adapter_reset",     status: "success", rawResponse: "ELM327 v1.5", errorMessage: null, completedAt: new Date() },
  { step: "echo_off",          status: "success", rawResponse: "OK",          errorMessage: null, completedAt: new Date() },
  { step: "linefeeds_off",     status: "success", rawResponse: "OK",          errorMessage: null, completedAt: new Date() },
  { step: "spaces_off",        status: "success", rawResponse: "OK",          errorMessage: null, completedAt: new Date() },
  { step: "protocol_auto",     status: "success", rawResponse: "OK",          errorMessage: null, completedAt: new Date() },
  { step: "vin_read",          status: "success", rawResponse: "1HGCM82633A004352", errorMessage: null, completedAt: new Date() },
  { step: "protocol_confirmed",status: "success", rawResponse: "ISO 15765-4 CAN (11 bit ID, 500 kbaud)", errorMessage: null, completedAt: new Date() },
];

stateManager.setBootstrapSteps(steps);
// → triggers session.update immediately, agent's next turn sees bootstrap result
```

**After Mode 06 scan completes:**
```typescript
import type { Mode06Monitor } from "./agent/context";

// Map your OBD service Mode 06 response to Mode06Monitor[]:
const monitors: Mode06Monitor[] = obdMode06Response.map((raw) => ({
  name:           raw.description,
  testId:         raw.tid,
  result:         raw.passed ? "pass" : raw.failed ? "fail" : "not_run",
  measuredValue:  raw.value ?? null,
  minLimit:       raw.minLimit ?? null,
  maxLimit:       raw.maxLimit ?? null,
  units:          raw.units ?? null,
}));

stateManager.setMode06Results(monitors);
// → triggers session.update immediately
```

### 4. Ground the text-based agent (non-realtime)

For SDK-based (text) agent turns, prepend the state block to the system message:

```typescript
const systemPrompt = contextBuilder.buildSystemPrompt(
  stateManager.snapshot(),
  TARS_BASE_INSTRUCTIONS
);

// Pass systemPrompt as the system message to your agent.run() / chat.create() call
```

## What the Agent Sees

Every turn the agent receives instructions that begin with:

```
## VERIFIED SYSTEM STATE
<!-- State version 7 captured at 2026-05-22T03:15:42.000Z -->
<!-- This block reflects the actual system state at the time of this turn. -->
<!-- It supersedes any conflicting information from earlier in this conversation. -->

### OBD Adapter Connection
Status: CONNECTED
Adapter type: OBDLink MX+
Device: OBDLink MX+ (Bluetooth)
Protocol: ISO 15765-4 CAN (11 bit ID, 500 kbaud)
Last connected: 2026-05-22T03:10:00.000Z

### Bootstrap Sequence
Status: SUCCEEDED at 2026-05-22T03:10:05.000Z
Resolved protocol: ISO 15765-4 CAN (11 bit ID, 500 kbaud)
Resolved VIN: 1HGCM82633A004352
Steps:
  [OK] adapter_reset → ELM327 v1.5
  [OK] echo_off → OK
  [OK] linefeeds_off → OK
  [OK] spaces_off → OK
  [OK] protocol_auto → OK
  [OK] vin_read → 1HGCM82633A004352
  [OK] protocol_confirmed → ISO 15765-4 CAN (11 bit ID, 500 kbaud)

### Mode 06 On-Board Test Results
Status: COMPLETED at 2026-05-22T03:14:30.000Z
Summary: 8 monitors | 7 passed | 1 failed | 0 not run
FAILING MONITORS:
  FAIL | Catalyst Monitor Bank 1 (ID: 0x21) | measured: 0.43  | limits: [0.50, 1.00]
PASSING MONITORS:
  PASS | O2 Sensor Monitor Bank 1 Sensor 1 (ID: 0x01)
  ...

## END VERIFIED SYSTEM STATE
```

The agent treats this as authoritative — not something it recalls from earlier
conversation. Connection status changes, Mode 06 re-runs, and failed bootstrap
steps all flow through `DiagnosticStateManager` and appear in this block
immediately on the next turn.
