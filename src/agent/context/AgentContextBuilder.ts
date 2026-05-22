import type { DiagnosticGroundTruth, Mode06Monitor } from "./types";

/**
 * AgentContextBuilder renders a DiagnosticGroundTruth snapshot into the
 * structured text block that is prepended to every agent system prompt.
 *
 * The block uses a strict, machine-parseable format so the agent can cite
 * exact values rather than recalling them from conversation history.
 *
 * IMPORTANT: This block is ALWAYS prepended before the persona/instructions.
 * The agent is instructed to treat it as the authoritative ground truth and
 * to disregard any contradictory information from earlier in the conversation.
 */
export class AgentContextBuilder {
  /**
   * Renders the full system prompt: ground truth block + persona instructions.
   *
   * @param snapshot - Current verified state from DiagnosticStateManager
   * @param baseInstructions - The agent's persona / task instructions
   */
  buildSystemPrompt(
    snapshot: DiagnosticGroundTruth,
    baseInstructions: string
  ): string {
    return `${this.renderGroundTruthBlock(snapshot)}\n\n${baseInstructions}`;
  }

  /**
   * Renders only the ground truth block. Use this for Realtime API
   * session.update calls where you need to refresh state without
   * replacing the full instructions.
   */
  renderGroundTruthBlock(snapshot: DiagnosticGroundTruth): string {
    const ts = snapshot.capturedAt.toISOString();
    return [
      "## VERIFIED SYSTEM STATE",
      `<!-- State version ${snapshot.version} captured at ${ts} -->`,
      "<!-- This block reflects the actual system state at the time of this turn. -->",
      "<!-- It supersedes any conflicting information from earlier in this conversation. -->",
      "",
      this.renderAdapterSection(snapshot),
      "",
      this.renderBootstrapSection(snapshot),
      "",
      this.renderMode06Section(snapshot),
      "",
      "## END VERIFIED SYSTEM STATE",
    ].join("\n");
  }

  // ─── Section renderers ────────────────────────────────────────────────────

  private renderAdapterSection(snapshot: DiagnosticGroundTruth): string {
    const { adapter } = snapshot;
    const lines = ["### OBD Adapter Connection"];
    lines.push(`Status: ${adapter.status.toUpperCase()}`);

    if (adapter.adapterType) lines.push(`Adapter type: ${adapter.adapterType}`);
    if (adapter.deviceIdentifier)
      lines.push(`Device: ${adapter.deviceIdentifier}`);
    if (adapter.protocol) lines.push(`Protocol: ${adapter.protocol}`);
    if (adapter.lastConnectedAt)
      lines.push(`Last connected: ${adapter.lastConnectedAt.toISOString()}`);
    if (adapter.lastDisconnectedAt)
      lines.push(
        `Last disconnected: ${adapter.lastDisconnectedAt.toISOString()}`
      );
    if (adapter.errorMessage)
      lines.push(`Connection error: ${adapter.errorMessage}`);

    return lines.join("\n");
  }

  private renderBootstrapSection(snapshot: DiagnosticGroundTruth): string {
    const { bootstrap } = snapshot;
    const lines = ["### Bootstrap Sequence"];

    if (!bootstrap.hasRun) {
      lines.push("Status: NOT RUN — bootstrap has not been executed this session.");
      return lines.join("\n");
    }

    lines.push(
      `Status: ${bootstrap.succeeded ? "SUCCEEDED" : "FAILED"} at ${bootstrap.completedAt?.toISOString()}`
    );
    if (bootstrap.resolvedProtocol)
      lines.push(`Resolved protocol: ${bootstrap.resolvedProtocol}`);
    if (bootstrap.resolvedVin)
      lines.push(`Resolved VIN: ${bootstrap.resolvedVin}`);

    lines.push("Steps:");
    for (const step of bootstrap.steps) {
      const icon =
        step.status === "success"
          ? "OK"
          : step.status === "skipped"
          ? "SKIP"
          : "FAIL";
      const detail = step.errorMessage
        ? ` (${step.errorMessage})`
        : step.rawResponse
        ? ` → ${step.rawResponse}`
        : "";
      lines.push(`  [${icon}] ${step.step}${detail}`);
    }

    return lines.join("\n");
  }

  private renderMode06Section(snapshot: DiagnosticGroundTruth): string {
    const { mode06 } = snapshot;
    const lines = ["### Mode 06 On-Board Test Results"];

    if (!mode06.hasRun) {
      lines.push("Status: NOT RUN — Mode 06 has not been run this session.");
      return lines.join("\n");
    }

    lines.push(
      `Status: COMPLETED at ${mode06.completedAt?.toISOString()}`
    );
    lines.push(
      `Summary: ${mode06.totalMonitors} monitors | ${mode06.passCount} passed | ${mode06.failCount} failed | ${mode06.notRunCount} not run`
    );

    if (mode06.failCount > 0) {
      lines.push("FAILING MONITORS:");
      for (const m of mode06.monitors.filter((m) => m.result === "fail")) {
        lines.push(this.renderMonitor(m));
      }
    }

    const passing = mode06.monitors.filter((m) => m.result === "pass");
    if (passing.length > 0) {
      lines.push("PASSING MONITORS:");
      for (const m of passing) {
        lines.push(this.renderMonitor(m));
      }
    }

    const notRun = mode06.monitors.filter((m) => m.result === "not_run");
    if (notRun.length > 0) {
      lines.push(`NOT RUN: ${notRun.map((m) => m.name).join(", ")}`);
    }

    return lines.join("\n");
  }

  private renderMonitor(m: Mode06Monitor): string {
    let line = `  ${m.result.toUpperCase()} | ${m.name} (ID: ${m.testId})`;
    if (m.measuredValue !== null && m.units) {
      line += ` | measured: ${m.measuredValue} ${m.units}`;
    }
    if (m.minLimit !== null && m.maxLimit !== null) {
      line += ` | limits: [${m.minLimit}, ${m.maxLimit}]`;
    }
    return line;
  }
}
