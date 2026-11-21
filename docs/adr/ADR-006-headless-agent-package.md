# ADR-006: The agent is a headless TypeScript package

| Field | Value |
|---|---|
| Document ID | ADR-006 |
| Product or service | Tempercraft: the design agent (`packages/agent`) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Agent design](../architecture/agent.md), [ADR-005](ADR-005-own-agent-not-codex.md), [ADR-007](ADR-007-promptfoo-hardening-code-guarantees.md) |

## Decision identity

- ADR number and title: ADR-006, The agent is a headless TypeScript package
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

The desktop app runs the agent in its webview. promptfoo has to run the same agent outside the app, in Node ([ADR-007](ADR-007-promptfoo-hardening-code-guarantees.md)).

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| A headless package with its I/O passed in | The same code runs in the webview and in Node | Every host has to provide instructions, a model client and a workspace | `AgentHost` in `packages/agent/src/index.ts` | Selected |
| Agent code inside the desktop UI | Simpler wiring | promptfoo couldn't run it outside the app | — | Rejected |

## Decision

`packages/agent` imports nothing from Tauri, Solid or Node. The host passes in `instructions`, a `ModelClient` and a `Workspace`.

## Consequences and mitigations

- Positive consequences: the evals exercise the real agent code.
- Costs and constraints introduced: model and file access always go through host adapters.
- Failure or reversal risks: the contract is a first draft and will change once the loop is written.
- Mitigations and owners: keep the contract in one file, `src/index.ts`, and update the [agent design](../architecture/agent.md) with it (project owner).
- Revisit conditions: the agent needs a host-specific API that can't be passed in.

## Implementation and evidence

- Code: `packages/agent/src/index.ts` (`ModelClient`, `Workspace`, `Selection`, `AgentHost`).
- Design: [agent design](../architecture/agent.md#high-level-design).

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
