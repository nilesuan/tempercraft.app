# ADR-007: Hardening with promptfoo, guarantees in code

| Field | Value |
|---|---|
| Document ID | ADR-007 |
| Product or service | Tempercraft: the design agent and its limits |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Agent design](../architecture/agent.md#quality-and-operations), [architecture security rules](../architecture/overview.md#security-rules), [ADR-006](ADR-006-headless-agent-package.md) |

## Decision identity

- ADR number and title: ADR-007, Hardening with promptfoo, guarantees in code
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

The agent reads untrusted content (generated pages, files, selections) and can edit files, so it's exposed to prompt injection and excessive agency. Instructions can make the model usually behave; only code can guarantee limits.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| promptfoo for evals and red team, with limits enforced in code | MIT-licensed, runs custom TypeScript providers, and has red-team plugins for indirect prompt injection, excessive agency and hijacking | Evals cost API tokens on the developer's key. By default promptfoo generates attacks with its hosted service | [promptfoo docs](https://www.promptfoo.dev/docs/red-team/configuration/), [OpenAI to acquire Promptfoo](https://openai.com/index/openai-to-acquire-promptfoo/) | Selected |
| Rely on the instructions alone | Nothing to build | The model only usually complies, and nothing measures it | — | Rejected |

## Decision

The Rust core enforces what the agent can do: the project folder only, no shell, no network tools. promptfoo measures how the model behaves within those limits.

## Consequences and mitigations

- Positive consequences: the guarantees hold even when the model misbehaves, and regressions in behavior show up in the evals.
- Costs and constraints introduced: evals are billed per token on the developer's own OpenAI API key, not on a ChatGPT plan.
- Failure or reversal risks: on 2026-03-09 OpenAI announced it is acquiring promptfoo and said the open-source project will continue. If that changes, we may need another tool.
- Mitigations and owners: pin the promptfoo version when running it with `npx`; generate attacks locally with `PROMPTFOO_DISABLE_REDTEAM_REMOTE_GENERATION=true`; run the full red team only before releases (project owner).
- Revisit conditions: promptfoo's open-source project stops being maintained or changes its license.

## Implementation and evidence

- Design: [agent design](../architecture/agent.md#delivery-and-verification) holds the eval and red-team plan.
- Code: `packages/agent/evals/` is planned and doesn't exist yet. Verification: NOT RUN.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
