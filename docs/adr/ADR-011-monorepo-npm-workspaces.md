# ADR-011: One repo, npm workspaces, folders by what ships

| Field | Value |
|---|---|
| Document ID | ADR-011 |
| Product or service | Tempercraft: repository layout and tooling |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Architecture: repository layout](../architecture/overview.md#repository-layout), [developer guide](../engineering/developer-guide.md) |

## Decision identity

- ADR number and title: ADR-011, One repo, npm workspaces, folders by what ships
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

There's one developer. The app, the agent library and the Firebase rules often change together.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| One repository with npm workspaces (`apps/*`, `packages/*`) | A change that touches rules, app and agent lands in one commit | — | — | Selected |
| Turborepo or Nx on top | Build caching and task graphs | Not needed until builds get slow | — | Rejected for now |
| Separate repositories | Independent releases | A cross-cutting change splits across repositories and commits | — | Rejected |

## Decision

- Keep one repository with npm workspaces and one lockfile at the root.
- Use one top-level folder per thing that ships or deploys: the app, the Firebase config, the agent library.
- Keep `firebase.json` at the root. The Firebase CLI looks for it in the current folder and every folder above, so `firebase` commands work from anywhere in the repo.

## Consequences and mitigations

- Positive consequences: atomic changes across the app, agent and rules.
- Costs and constraints introduced: one install for every workspace.
- Failure or reversal risks: builds may get slow as the repo grows.
- Mitigations and owners: add Turborepo or Nx when that happens (project owner).
- Revisit conditions: builds get slow.

## Implementation and evidence

- Layout: [architecture overview](../architecture/overview.md#repository-layout).
- Commands: [developer guide](../engineering/developer-guide.md#verification-commands).

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
