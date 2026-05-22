/**
 * Ground truth state types for the TARS diagnostic agent.
 *
 * These represent verified system state sourced from the OBD service and Redis —
 * never inferred from conversation history.
 */

export type AdapterConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error";

export interface AdapterState {
  status: AdapterConnectionStatus;
  /** ELM327, OBDLink MX+, etc. */
  adapterType: string | null;
  /** Bluetooth device name or COM port path */
  deviceIdentifier: string | null;
  /** ISO 9141-2, CAN 11-bit, etc. */
  protocol: string | null;
  lastConnectedAt: Date | null;
  lastDisconnectedAt: Date | null;
  errorMessage: string | null;
}

export type Mode06TestResult = "pass" | "fail" | "not_run" | "not_supported";

export interface Mode06Monitor {
  /** e.g. "Catalyst Monitor Bank 1" */
  name: string;
  testId: string;
  result: Mode06TestResult;
  /** Measured value, if the monitor provides one */
  measuredValue: number | null;
  /** Minimum acceptable value */
  minLimit: number | null;
  /** Maximum acceptable value */
  maxLimit: number | null;
  units: string | null;
}

export interface Mode06State {
  /** Whether Mode 06 has ever been run this session */
  hasRun: boolean;
  completedAt: Date | null;
  monitors: Mode06Monitor[];
  /** Count helpers — derived but stored so agent never re-derives from text */
  totalMonitors: number;
  passCount: number;
  failCount: number;
  notRunCount: number;
}

export type BootstrapStep =
  | "adapter_reset"
  | "echo_off"
  | "linefeeds_off"
  | "spaces_off"
  | "protocol_auto"
  | "vin_read"
  | "protocol_confirmed";

export type BootstrapStepStatus = "success" | "failed" | "skipped" | "pending";

export interface BootstrapStepResult {
  step: BootstrapStep;
  status: BootstrapStepStatus;
  rawResponse: string | null;
  errorMessage: string | null;
  completedAt: Date | null;
}

export interface BootstrapState {
  /** Whether the full bootstrap sequence has run */
  hasRun: boolean;
  completedAt: Date | null;
  /** true only if every required step succeeded */
  succeeded: boolean;
  steps: BootstrapStepResult[];
  /** Protocol string the adapter settled on, if resolved */
  resolvedProtocol: string | null;
  /** VIN obtained during bootstrap, if available */
  resolvedVin: string | null;
}

/** The single authoritative state block injected into every agent turn. */
export interface DiagnosticGroundTruth {
  /** Monotonically increasing version — lets callers skip stale snapshots */
  version: number;
  capturedAt: Date;
  adapter: AdapterState;
  bootstrap: BootstrapState;
  mode06: Mode06State;
}

/** Diff from one snapshot to the next — only truthy fields changed. */
export interface GroundTruthDelta {
  adapterStatusChanged?: boolean;
  bootstrapCompleted?: boolean;
  mode06Completed?: boolean;
}
