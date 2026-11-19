# Diamond Firewall — Phase 1 Repository Audit

**Audit date:** 2026-11-18  
**Repository:** `CaptainLWS/KSG_Kid-Safe-Games`  
**Default branch:** `main`  
**Baseline commit:** `7066055029d99f1ee970a38c6ca5c329dc487d59`  
**Scope:** GitHub metadata, merged PR history, source files, SQL migrations, CI workflows, and deployment configuration. This is a repository audit, not a fresh penetration test or a live host/database assessment.

## 1. Verified repository history

The following pull requests are recorded as merged:

- PR #1 — Phase 1 Space LEAF ecosystem core.
- PR #2 — Phase 1 ecosystem core formalization.
- PR #3 — Initial production hardening.
- PR #4 — Security regression and deployment controls.

PR #4 merged on 2026-10-01. Its description records an idempotent ACL migration, removal of permissive duplicate RLS policies, closure of the ecosystem integrity RPC surface, SQL security regression tests, deployment documentation/configuration, and a successful live Supabase regression execution after policy cleanup.

## 2. Existing implementation confirmed in source

- Next.js application under `space-leaf/apps/web`.
- Supabase SSR and browser clients using publishable key.
- Proxy session refresh and protected `/ship` routes.
- Typed database bindings under `space-leaf/apps/web/src/types`.
- Sunshine Shield keyword-based evaluator.
- Jarvondis state initialization and action proposal foundation.
- SHA-256 serialization helper.
- Bootstrap route recording event, safety decision, user state, snapshot, and Captain's Log.
- SQL migrations for initial security hardening and event/snapshot hash chaining.
- PR #4 ACL migration and SQL privilege regression test.
- GitHub Actions CI and dependency-audit workflows.

## 3. Findings and severity

### Critical — CI and dependency audit did not execute

The recorded CI run associated with PR #4 failed at `actions/setup-node@v4` because no npm lockfile was found at the repository root. Subsequent install, test, typecheck, and build steps were skipped.

The recorded Security workflow failed at the same setup step; its install and audit steps were skipped. These are verified workflow failures, not inferred failures.

### High — workspace and deployment paths are inconsistent

- Root `package.json` declares workspaces `apps/*` and `packages/*`, but the app workspace is nested under `space-leaf/apps/web`.
- Root scripts target npm workspace `@space-leaf/ecosystem`; the inspected nested package is named `space-leaf-ecosystem`.
- The nested `space-leaf` workspace uses pnpm 10.15.0 and its app is `@space-leaf/web`.
- Root `vercel.json` points output to `apps/ecosystem/.next`, while the inspected Next.js app lives at `space-leaf/apps/web`.
- `docs/phase1-deployment.md` describes an app path and CI checks that do not match the inspected workflow/configuration.

The correct deployment root and package manager must be made consistent before claiming a reproducible production build.

### High — bootstrap snapshot hash serialization is unsafe

`space-leaf/apps/web/src/app/api/ship/bootstrap/route.ts` computes the hash with `JSON.stringify(state, Object.keys(state).sort())`. The replacer array is applied recursively and contains only the top-level keys, so nested object properties can be omitted from the serialized representation. Replace with a tested canonical JSON implementation and migrate/mark legacy hashes; do not silently treat existing values as verified.

### High — current hash chain lacks strong concurrency and external anchoring guarantees

The event and snapshot triggers select the latest row and derive the next hash/sequence without an explicit per-user serialization lock. Concurrent inserts can race. A privileged attacker able to rewrite all rows can also recompute a plain hash chain. Add transactional sequence allocation/locking, signed checkpoints, protected signing keys, and independent anchors.

### High — current supervisor / containment does not exist

The inspected Jarvondis runtime creates state and action proposals. It does not enforce OS-level process isolation, filesystem mediation, network egress restrictions, secret isolation, or a separately privileged local supervisor. These are new Phase 2 capabilities.

### Medium — Sunshine Shield is a prototype, not a general authorization engine

The current implementation performs substring matching over a small fixed list of terms and returns allow/review/deny. It does not provide typed resource/action authorization, policy versioning/signatures, capability issuance, or enforcement at operating-system and network boundaries.

### Medium — regression test coverage is narrower than the full security claim

The SQL regression test checks selected policy existence, table privileges, and execute privileges. It does not prove full RLS behavior across users/roles, concurrency correctness, application authorization, local sandbox isolation, network egress, backup recovery, or adversarial tool execution.

### Medium — generated database types may be stale

The inspected generated types do not include the integrity-chain fields `previous_hash_sha256` and `sequence_no`. Regenerate types from the canonical schema and make type drift a CI failure.

### Medium — deployment security prerequisites remain

The deployment guide itself calls out Supabase leaked-password protection and review of remaining pre-existing Security Advisor findings. These must be checked in the live project before production acceptance.

## 4. Positive controls to preserve

- User-scoped RLS boundaries and role assignments not writable by ordinary clients.
- Append-only intent for events and snapshots.
- Server-side Supabase Auth user verification in the bootstrap route.
- Revocation of direct execution privileges on integrity trigger functions.
- SQL regression assertions against direct update/delete of events and snapshots and client insertion of safety decisions.
- Separation of Supabase publishable keys from server-only secret keys in deployment documentation.

## 5. Audit conclusion

Phase 1 is a useful application and database security foundation. It is not yet a local-first endpoint security platform. The highest-priority work is to restore reproducible CI/build validation, correct deployment/workspace configuration, fix canonical hashing, make integrity sequencing concurrency-safe, and define the independent local supervisor and enforcement interfaces.

No claim is made here that the live production Supabase project, Jarvondis host, deployed Vercel app, or all backup/recovery paths were independently inspected during this repository audit.
