# ADR-005: Our own agent, not Codex

| Field | Value |
|---|---|
| Document ID | ADR-005 |
| Product or service | Tempercraft: the design agent (`packages/agent`) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Agent design](../architecture/agent.md), [ADR-006](ADR-006-headless-agent-package.md), [ADR-007](ADR-007-promptfoo-hardening-code-guarantees.md) |

## Decision identity

- ADR number and title: ADR-005, Our own agent, not Codex
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

Tempercraft needs a design agent that edits files in one project folder, respects the element the user picked, and later looks at screenshots of the preview. It should follow designer-style instructions of our own.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Our own agent loop | A small, specific toolset: read and edit files in one folder, the picked element, later screenshots. Our own instructions. Small and testable with promptfoo | We write and maintain the loop | [Agent design](../architecture/agent.md) | Selected |
| Embed Codex (`codex app-server`) | A mature agent | A general coding agent with shell access, which is far more than a design tool needs | OpenAI allows local, open-source apps to embed it with a Sign in with ChatGPT token | Rejected for now; kept open |

## Decision

Ship our own agent loop, with its own instructions and tools, in `packages/agent` ([ADR-006](ADR-006-headless-agent-package.md)).

## Consequences and mitigations

- Positive consequences: a minimal toolset keeps the agent small, testable and hard to misuse.
- Costs and constraints introduced: we maintain the loop, tools and instructions.
- Failure or reversal risks: writing our own loop could cost more than expected.
- Mitigations and owners: embedding `codex app-server` with a Sign in with ChatGPT token stays available as a fallback (project owner).
- Revisit conditions: writing our own loop costs more than expected.

## Implementation and evidence

- Design: [agent design](../architecture/agent.md).
- Code: contract types in `packages/agent/src/index.ts` and a first draft of `packages/agent/prompts/system.md`. The loop and tools aren't built yet.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
