import type { Json } from "@/types/generated";

export type SafetyDecision = "allow" | "review" | "deny";
export type SafetyInput = { action: string; text?: string; ageGroup?: string | null; safeMode?: boolean; policy?: Json };

const DENY_TERMS = ["sexual", "explicit", "self-harm", "suicide", "weapon purchase", "doxx", "password"];
const REVIEW_TERMS = ["violence", "contact stranger", "location", "personal information", "medical", "money"];

export function evaluateSafety(input: SafetyInput): { decision: SafetyDecision; reason: string; policy: string; signals: string[] } {
  const text = `${input.action} ${input.text ?? ""}`.toLowerCase();
  const signals = DENY_TERMS.filter((t) => text.includes(t));
  if (signals.length) return { decision: "deny", reason: "The requested action matches a protected safety category.", policy: "sunshine-shield-core", signals };
  const review = REVIEW_TERMS.filter((t) => text.includes(t));
  if (input.safeMode || review.length) return { decision: "review", reason: "The action needs an additional safety check before execution.", policy: "sunshine-shield-core", signals: review };
  return { decision: "allow", reason: "The action is within the default kid-safe boundary.", policy: "sunshine-shield-core", signals: [] };
}
