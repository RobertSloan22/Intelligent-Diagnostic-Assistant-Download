import { EventEmitter } from "events";
import type {
  AdapterState,
  BootstrapState,
  BootstrapStepResult,
  DiagnosticGroundTruth,
  GroundTruthDelta,
  Mode06Monitor,
  Mode06State,
} from "./types";

/**
 * DiagnosticStateManager owns the single authoritative copy of ground truth
 * diagnostic state. It is the only source the agent context builder reads from.
 *
 * It intentionally does NOT read from conversation history — it reads from:
 *   - OBD service callbacks (adapter/bootstrap events)
 *   - Redis pub/sub (live status updates)
 *   - Direct method calls from route handlers after OBD operations complete
 *
 * Emit "stateChanged" with a GroundTruthDelta whenever meaningful state
 * transitions occur so subscribers (e.g. the Realtime session refresher)
 * know to push a context update.
 */
export class DiagnosticStateManager extends EventEmitter {
  private version = 0;

  private adapter: AdapterState = {
    status: "disconnected",
    adapterType: null,
    deviceIdentifier: null,
    protocol: null,
    lastConnectedAt: null,
    lastDisconnectedAt: null,
    errorMessage: null,
  };

  private bootstrap: BootstrapState = {
    hasRun: false,
    completedAt: null,
    succeeded: false,
    steps: [],
    resolvedProtocol: null,
    resolvedVin: null,
  };

  private mode06: Mode06State = {
    hasRun: false,
    completedAt: null,
    monitors: [],
    totalMonitors: 0,
    passCount: 0,
    failCount: 0,
    notRunCount: 0,
  };

  // ─── Adapter updates ───────────────────────────────────────────────────────

  setAdapterConnecting(deviceIdentifier: string, adapterType: string): void {
    this.adapter = {
      ...this.adapter,
      status: "connecting",
      deviceIdentifier,
      adapterType,
      errorMessage: null,
    };
    this.bump({ adapterStatusChanged: true });
  }

  setAdapterConnected(protocol: string): void {
    this.adapter = {
      ...this.adapter,
      status: "connected",
      protocol,
      lastConnectedAt: new Date(),
      errorMessage: null,
    };
    this.bump({ adapterStatusChanged: true });
  }

  setAdapterDisconnected(): void {
    this.adapter = {
      ...this.adapter,
      status: "disconnected",
      protocol: null,
      lastDisconnectedAt: new Date(),
    };
    this.bump({ adapterStatusChanged: true });
  }

  setAdapterError(errorMessage: string): void {
    this.adapter = {
      ...this.adapter,
      status: "error",
      lastDisconnectedAt: new Date(),
      errorMessage,
    };
    this.bump({ adapterStatusChanged: true });
  }

  // ─── Bootstrap updates ─────────────────────────────────────────────────────

  setBootstrapSteps(steps: BootstrapStepResult[]): void {
    const succeeded = steps.every(
      (s) => s.status === "success" || s.status === "skipped"
    );
    const resolvedProtocol =
      steps.find((s) => s.step === "protocol_confirmed")?.rawResponse ?? null;
    const resolvedVin =
      steps.find((s) => s.step === "vin_read")?.rawResponse ?? null;

    this.bootstrap = {
      hasRun: true,
      completedAt: new Date(),
      succeeded,
      steps,
      resolvedProtocol,
      resolvedVin,
    };
    this.bump({ bootstrapCompleted: true });
  }

  // ─── Mode 06 updates ───────────────────────────────────────────────────────

  setMode06Results(monitors: Mode06Monitor[]): void {
    const passCount = monitors.filter((m) => m.result === "pass").length;
    const failCount = monitors.filter((m) => m.result === "fail").length;
    const notRunCount = monitors.filter((m) => m.result === "not_run").length;

    this.mode06 = {
      hasRun: true,
      completedAt: new Date(),
      monitors,
      totalMonitors: monitors.length,
      passCount,
      failCount,
      notRunCount,
    };
    this.bump({ mode06Completed: true });
  }

  // ─── Snapshot ──────────────────────────────────────────────────────────────

  /** Returns an immutable snapshot of current ground truth. */
  snapshot(): DiagnosticGroundTruth {
    return {
      version: this.version,
      capturedAt: new Date(),
      adapter: { ...this.adapter },
      bootstrap: {
        ...this.bootstrap,
        steps: this.bootstrap.steps.map((s) => ({ ...s })),
      },
      mode06: {
        ...this.mode06,
        monitors: this.mode06.monitors.map((m) => ({ ...m })),
      },
    };
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  private bump(delta: GroundTruthDelta): void {
    this.version += 1;
    this.emit("stateChanged", delta, this.snapshot());
  }
}
