# Diamond Firewall — Target Engineering Architecture

**Status:** Architecture baseline; implementation not yet started  
**Scope:** Jarvondis/local host + all Space LEAF services and agents  
**Deployment priority:** Local-first, cloud-optional  
**Parent baseline:** Phase 1 merged on 2026-10-01

## 1. Mission and security invariants

Diamond Firewall is an independent security control plane. It mediates access to protected resources and execution capabilities; it is not an AI feature and must not rely on Jarvondis to enforce its own boundaries.

Required invariants:

1. **Default deny:** no protected operation proceeds without an explicit, current authorization decision.
2. **Independent enforcement:** Jarvondis, application code, plugins, and cloud services cannot modify or bypass enforcement policy.
3. **Local authority:** core authorization, process containment, audit recording, and emergency isolation continue without internet or Supabase.
4. **Least privilege:** identities receive narrowly scoped, short-lived capabilities for specific resources and actions.
5. **Fail closed:** missing policy, invalid identity, corrupt state, clock/nonce failure, or unavailable required enforcement blocks the protected operation.
6. **Tamper evidence, not magical immutability:** hashes detect alteration only when anchored in a separately protected trust domain. Signed checkpoints and external anchors are required for stronger assurance.
7. **Recovery is explicit:** restored state is validated, quarantined, and reviewed before being allowed to execute.
8. **No self-approval:** a workload cannot approve its own privilege escalation or policy change.

## 2. Logical architecture

### A. Local security supervisor

A dedicated local service owns policy loading, identity verification, capability issuance, audit sequencing, health state, and emergency controls. It runs under a dedicated OS account with minimal privileges. The service exposes a local authenticated IPC endpoint (Unix domain socket on Unix-like systems; named pipe on Windows). Peer credentials are checked in addition to application-level authentication.

The supervisor must not share a process, runtime, credentials, or writable policy directory with Jarvondis.

### B. Policy decision point (PDP) and enforcement points (PEPs)

- PDP: evaluates a typed request against a versioned, signed policy bundle.
- PEPs: enforce decisions at process launch, filesystem access, network egress, secret access, tool invocation, and service/API boundaries.
- Decision vocabulary: `allow`, `deny`, `review`, `quarantine`.
- Every decision includes policy version, subject identity, resource, action, context, reason code, expiry, and correlation ID.
- A `review` result is not permission to execute. It remains blocked until a separate authorized approval is recorded.
- Policy evaluation is deterministic and side-effect free. LLM output may supply context but never becomes an authorization decision.

### C. Workload identity and capability broker

Each service and agent receives a distinct workload identity. The broker issues short-lived, audience-bound capabilities limited by resource, action, and expiry. Secrets are never embedded in prompts, model context, logs, or source code. Human identity, device identity, and workload identity remain distinct.

Offline operation uses locally verifiable credentials and cached signed policy bundles with bounded validity. Expired credentials or policy bundles cannot silently fall back to allow. Cloud revocation updates synchronize when connectivity returns; local emergency revocation remains available.

### D. Execution containment

Jarvondis tools and untrusted workloads execute outside the supervisor's security boundary. Each task receives a disposable or resettable sandbox with:

- explicit read/write path allowlists;
- no host credential or supervisor socket access by default;
- resource quotas and execution deadlines;
- restricted system calls/process capabilities where supported;
- network egress denied by default and selectively brokered;
- separate writable scratch space;
- immutable, version-pinned runtime and tool manifests.

Platform adapters must implement OS-native controls. Linux: namespaces, seccomp, cgroups, and an LSM such as AppArmor/SELinux. Windows: restricted tokens, Job Objects, and AppContainer where applicable. macOS: supported sandbox/container mechanisms and a documented residual-risk profile. Do not claim equivalent isolation across platforms without platform-specific tests.

### E. Network security gateway

Outbound traffic is mediated by a local egress broker. Policies bind workload identity to destination, protocol, port, DNS result, and time window. DNS rebinding, private-address access, loopback access, metadata endpoints, and unexpected redirects are explicitly tested. Inbound listeners are disabled unless declared and approved. Service-to-service communication uses authenticated identities and mutually authenticated transport where applicable.

### F. Data protection and secret storage

Sensitive data is classified and encrypted at rest using authenticated encryption. Encryption keys are separated from ciphertext and stored using the OS credential store or hardware-backed key facility when available. Key rotation, backup, recovery, and revocation are designed before production data is placed under protection. Logs redact secrets and sensitive prompt contents by default.

### G. Integrity ledger and continuity

The ledger records security decisions, policy changes, identity lifecycle, sandbox launches, network grants/denials, incidents, and recovery operations.

- Canonical serialization must be versioned and have cross-language test vectors.
- Every record includes sequence number, previous-record hash, event hash, schema version, and timestamp/monotonic ordering metadata.
- Checkpoints are digitally signed by a key unavailable to ordinary application workloads.
- Signed checkpoints are periodically anchored to a separately administered destination when available.
- Concurrent writers use transactional sequencing/locking.
- Restore verifies signatures, chain continuity, schema compatibility, and policy version before activation.

SHA-256 chaining alone is tamper-evident only relative to a trusted checkpoint; it is not tamper-proof against an attacker who can rewrite the whole chain and its anchor.

### H. Detection, response, and recovery

A local detector consumes structured security events and identifies policy violations, unexpected process/network behavior, repeated denials, integrity failures, and privilege changes. Response actions are bounded and deterministic: deny, revoke capability, terminate sandbox, quarantine workload, disable egress, preserve evidence, and request human review.

A physical/local emergency control must be able to isolate workloads without cloud access. Recovery uses known-good signed artifacts and validated snapshots; never auto-execute restored agent state.

## 3. Trust boundaries

1. Host OS / hardware root of trust.
2. Diamond Firewall supervisor and protected policy/key storage.
3. Sandboxed Jarvondis runtime and tool processes.
4. Space LEAF application and service workloads.
5. Supabase and other remote services.
6. External model providers and downloaded model/tool artifacts.

A compromise at one boundary must not imply trust at another. In particular, application database credentials do not grant host-level permissions, and a model response does not grant tool permissions.

## 4. Local-first operating modes

- **Offline mode:** local identity verification, policy evaluation, PEP enforcement, audit, quarantine, and recovery remain operational. Cloud sync and remote identity refresh are unavailable; expired trust material blocks protected actions.
- **Connected mode:** same local enforcement remains authoritative; signed policy and revocation updates, audit replication, and administrative workflows may synchronize.
- **Degraded mode:** if the supervisor is unhealthy, protected workloads stop or remain sandboxed with no new capabilities. A watchdog reports failure; workloads cannot disable the watchdog.

Supabase is a synchronization and application-data service, not the root of local authorization. Existing Supabase Auth can remain the online identity provider, but offline authorization must be independently verifiable and explicitly bounded.

## 5. Component boundaries and proposed repository layout

```text
space-leaf/
  apps/
    web/                         # Existing Space LEAF UI
  packages/
    firewall-contracts/          # Typed identities, requests, decisions, events
    firewall-policy/             # Deterministic PDP and policy schema
    firewall-client/             # Authenticated IPC client / PEP SDK
    firewall-audit/              # Canonical records and verification
  services/
    diamond-supervisor/          # Local security authority
    execution-broker/            # Sandbox lifecycle and capability mediation
    egress-broker/               # Outbound network enforcement
  platform/
    linux/                       # Linux enforcement adapter
    windows/                     # Windows enforcement adapter
    macos/                       # macOS enforcement adapter
  policies/
    baseline/                    # Signed, versioned default-deny policies
  docs/
    diamond-firewall/
```

The first implementation should select one host OS and implement/test that adapter end-to-end before claiming cross-platform support.

## 6. Security administration

Policy changes, trust-root changes, key rotation, emergency overrides, and recovery activation require a separate administrative identity and an auditable approval path. Emergency overrides are time-limited, scoped, reason-coded, and generate high-priority audit records. No agent can grant itself new tools, network access, filesystem access, or policy privileges.

## 7. Explicit non-goals for the first release

- Replacing the host operating system's security model.
- Claiming protection after full kernel, firmware, or physical compromise.
- Treating AI anomaly detection as a substitute for deterministic enforcement.
- Making cloud services mandatory for local security.
- Automatically restoring and executing untrusted snapshots.
- Claiming "tamper-proof" logs based only on hash chains.
