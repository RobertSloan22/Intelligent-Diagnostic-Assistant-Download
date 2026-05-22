import type { DiagnosticGroundTruth, GroundTruthDelta } from "../context/types";
import type { AgentContextBuilder } from "../context/AgentContextBuilder";
import type { DiagnosticStateManager } from "../context/DiagnosticStateManager";

/**
 * RealtimeContextGrounding wires DiagnosticStateManager into an active
 * OpenAI Realtime API WebSocket session so the agent's instructions always
 * reflect current verified state.
 *
 * How it works:
 *   1. On session start, it renders a full grounded system prompt and sends
 *      a session.update event to establish it.
 *   2. It listens for stateChanged events from DiagnosticStateManager.
 *   3. On every meaningful state transition it immediately sends a new
 *      session.update with refreshed instructions — the agent's next response
 *      will be grounded in the new state.
 *
 * The WebSocket send function is injected so this class stays testable and
 * decoupled from specific WebSocket implementations (ws, socket.io, etc.).
 */
export class RealtimeContextGrounding {
  private lastPushedVersion = -1;

  constructor(
    private readonly stateManager: DiagnosticStateManager,
    private readonly contextBuilder: AgentContextBuilder,
    /** Send a raw message object to the Realtime API WebSocket. */
    private readonly sendToRealtime: (message: object) => void,
    /** Base persona + task instructions (does not include state — state is prepended). */
    private readonly baseInstructions: string
  ) {}

  /**
   * Call once when the Realtime WebSocket session opens.
   * Establishes the initial grounded system prompt.
   */
  attach(): void {
    this.pushCurrentState();

    this.stateManager.on(
      "stateChanged",
      (delta: GroundTruthDelta, snapshot: DiagnosticGroundTruth) => {
        this.handleStateChanged(delta, snapshot);
      }
    );
  }

  /**
   * Call when the Realtime WebSocket session closes.
   * Removes the stateChanged listener to prevent memory leaks.
   */
  detach(): void {
    this.stateManager.removeAllListeners("stateChanged");
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  private handleStateChanged(
    delta: GroundTruthDelta,
    snapshot: DiagnosticGroundTruth
  ): void {
    // Skip if we've already pushed this version (shouldn't happen, but guard anyway)
    if (snapshot.version <= this.lastPushedVersion) return;
    this.pushSnapshot(snapshot);
  }

  private pushCurrentState(): void {
    const snapshot = this.stateManager.snapshot();
    this.pushSnapshot(snapshot);
  }

  private pushSnapshot(snapshot: DiagnosticGroundTruth): void {
    const instructions = this.contextBuilder.buildSystemPrompt(
      snapshot,
      this.baseInstructions
    );

    // session.update replaces the active instructions without resetting the
    // conversation, so the agent immediately operates on the new state.
    this.sendToRealtime({
      type: "session.update",
      session: {
        instructions,
      },
    });

    this.lastPushedVersion = snapshot.version;
  }
}
