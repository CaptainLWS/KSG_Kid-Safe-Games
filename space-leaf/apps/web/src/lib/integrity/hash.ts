import { createHash } from "node:crypto";

export function canonicalJson(value: unknown): string { return JSON.stringify(value, (_key, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v as object).sort().reduce<Record<string, unknown>>((o, k) => { o[k] = (v as Record<string, unknown>)[k]; return o; }, {}) : v); }
export function sha256(value: unknown): string { return createHash("sha256").update(canonicalJson(value)).digest("hex"); }
