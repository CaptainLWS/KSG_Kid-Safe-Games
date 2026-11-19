# Diamond Firewall — Implementation Plan

**Architecture baseline:** `docs/diamond-firewall/architecture.md`  
**Audit baseline:** `docs/diamond-firewall/phase1-audit.md`  
**Priority:** local-first; protect Jarvondis and all Space LEAF workloads.

## Release gates

No phase is considered complete because code merely exists. Each gate requires automated tests, documented threat assumptions, and evidence from the target operating system.

## Phase 0 — Stabilize Phase 1 and establish a trustworthy build

1. Choose the canonical workspace root and package manager. The inspected app workspace is `space-leaf`, using pnpm 10.15.0.
2. Fix root scripts, GitHub Actions working directory/cache, lockfile handling, and Vercel root/build/output paths. Do not mix npm and pnpm lockfiles.
3. Add deterministic install, lint, typecheck, unit test, SQL migration test, and production build jobs.
4. Make CI run on pull requests and main pushes; pin third-party actions to reviewed immutable commit SHAs and grant minimum workflow token permissions.
5. Regenerate Supabase TypeScript types from the canonical schema and fail CI on drift.
6. Enable leaked-password protection and close or explicitly accept pre-existing Supabase Security Advisor findings.
7. Produce a signed build artifact and software bill of materials (SBOM).

**Exit criteria:** clean reproducible install; all checks pass on a fresh runner; deployment root matches the real app; no undocumented skipped security job.

## Phase 1 — Correct integrity and authorization foundations

1. Replace the bootstrap hash with versioned canonical JSON and published test vectors for nested objects, arrays, Unicode, nulls, numeric edge cases, and key ordering.
2. Treat old bootstrap hashes as legacy/unverified until recomputed from the original canonical state; never silently certify them.
3. Add per-subject transactional sequence allocation and locking for event/snapshot chain writes.
4. Define event envelope, idempotency key, actor/workload identity, correlation ID, policy version, and monotonic sequence.
5. Sign periodic checkpoints with a key outside application/database credentials; add independent anchor/verification tooling.
6. Expand SQL tests to exercise actual cross-user reads/writes, role escalation, function execution, RLS bypass attempts, and migration idempotency.
7. Introduce formal resource/action policy schemas and fail-closed authorization tests.

**Exit criteria:** deterministic cross-language hash tests; concurrent writers produce one valid ordered chain; signature and anchor verification detects tampering; negative authorization tests pass.

## Phase 2 — Local supervisor and workload identity

1. Select the first supported host OS and threat model.
2. Implement a separate local supervisor service under a dedicated OS account.
3. Expose authenticated local IPC and verify peer credentials.
4. Establish device and workload identities; issue short-lived audience-bound capabilities.
5. Store policy signing keys and local secrets using OS-protected facilities.
6. Implement policy bundle signature, version, expiry, rollback protection, and offline validation.
7. Implement local audit spool and safe synchronization without requiring cloud connectivity.

**Exit criteria:** Jarvondis cannot modify supervisor policy, impersonate another workload, read supervisor secrets, or issue its own capabilities; core decisions and audit continue with network disconnected.

## Phase 3 — Enforcement and containment

1. Implement a sandbox lifecycle manager for Jarvondis and tools.
2. Enforce filesystem allowlists, process/resource limits, restricted privileges, and disposable scratch storage.
3. Deny network egress by default; route approved traffic through the local egress broker.
4. Add secret broker and redact sensitive values from prompts, logs, and telemetry.
5. Add process identity and runtime/tool manifest verification.
6. Implement quarantine, capability revocation, process termination, and emergency isolation.

**Exit criteria:** adversarial tests prove that a sandbox cannot escape its filesystem, access host credentials, bypass egress policy, or reach the supervisor's privileged IPC surface under the supported OS threat model.

## Phase 4 — Space LEAF ecosystem integration

1. Add a firewall client/PEP to the Next.js server boundary and all privileged backend services.
2. Map human, device, service, and AI-agent identities separately.
3. Require policy decisions for sensitive API actions, administrative changes, data exports, and agent tool calls.
4. Treat Supabase as online identity/data synchronization, not local authorization root.
5. Add signed policy distribution, revocation synchronization, tenant boundaries, and central audit views.
6. Add per-application service identities and scoped credentials.

**Exit criteria:** all privileged service paths are inventoried and mediated; a compromised app credential cannot obtain host or unrelated tenant privileges.

## Phase 5 — Detection, recovery, and operational readiness

1. Add local behavioral rules for policy violations, unusual process/network activity, integrity failures, and repeated authorization denials.
2. Define incident severity, evidence preservation, operator approval, and response runbooks.
3. Verify backup encryption, key recovery, restore integrity, and disaster-recovery objectives.
4. Test rollback, offline operation, policy expiry, clock rollback, disk-full, supervisor crash, and corrupted audit state.
5. Run independent security review and scoped penetration tests.
6. Publish a security operations guide, threat model, residual-risk register, and release attestation.

**Exit criteria:** documented recovery objectives are met in witnessed restore drills; critical security tests pass; no unresolved critical/high findings; operational owner accepts residual risks.

## Initial threat-model priorities

- Prompt injection and malicious tool output attempting to induce unauthorized actions.
- Compromised Jarvondis process or malicious extension.
- Stolen application/service credentials.
- Malicious or rolled-back policy/model/tool update.
- Local privilege escalation and administrator compromise.
- DNS rebinding, SSRF, metadata endpoint access, and data exfiltration.
- Snapshot/event tampering, replay, concurrent-write races, and rollback.
- Loss of cloud connectivity, clock skew/rollback, disk exhaustion, and partial restore.

## Implementation sequencing rule

Do not build advanced detection before deterministic enforcement. Do not add broad privileges to make integrations easier. Do not declare offline support until the network is physically disconnected during an end-to-end test. Do not declare recovery complete until a restore has been performed from independently verified backup material.
