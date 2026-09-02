import type { Json } from "@/types/generated";

export type JarvondisState = { continuity: "jarvondis"; sessionId: string; userId: string; memory: Json; adaptation: Json; boundaries: { safetyFirst: true; noManipulation: true; noAutonomyEscalation: true } };

export function createJarvondisState(userId: string, sessionId: string, prior?: Partial<JarvondisState>): JarvondisState {
  return { continuity: "jarvondis", sessionId, userId, memory: prior?.memory ?? {}, adaptation: prior?.adaptation ?? { mode: "user-serving", communication: "clear", pacing: "adaptive" }, boundaries: { safetyFirst: true, noManipulation: true, noAutonomyEscalation: true } };
}

export function proposeAction(state: JarvondisState, action: string) {
  return { agent: "Jarvondis", sessionId: state.sessionId, action, requiresSafetyDecision: true, stateVersion: 1 };
}
