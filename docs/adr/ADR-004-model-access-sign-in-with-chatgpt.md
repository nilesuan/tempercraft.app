# ADR-004: Model access is Sign in with ChatGPT, called straight from the Mac

| Field | Value |
|---|---|
| Document ID | ADR-004 |
| Product or service | Tempercraft desktop app: model access |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Authentication and session design](../architecture/authentication.md), [agent design](../architecture/agent.md), [ADR-003](ADR-003-free-and-open-source.md) |

## Decision identity

- ADR number and title: ADR-004, Model access is Sign in with ChatGPT, called straight from the Mac
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

Users should run the agent on their own ChatGPT plan. Tempercraft is free and open source ([ADR-003](ADR-003-free-and-open-source.md)), and the owner wants no Tempercraft server between the app and OpenAI.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Sign in with ChatGPT with "ChatGPT plan usage", called from the Mac | OpenAI's docs cover "open-source and locally hosted apps". The app registers itself during the user's first sign-in (`client_id=dynamic_agent_client`), with no client secret and no partner key. No hosting cost and no user tokens on our servers, and the app stays "locally hosted" | Responses API only, with `store: false`, `stream: true` and no hosted tools. The feature is labelled a preview | [Authentication design sources](../architecture/authentication.md#sources) | Selected |
| Codex app-server's built-in login | Ready-made | OpenAI says it "has never been permitted for commercial or hosted services" and recommends Sign in with ChatGPT instead | [Codex App Server](https://learn.chatgpt.com/docs/app-server) | Rejected |
| Reusing Codex's OAuth client, or calling ChatGPT's `backend-api` | — | Unofficial; the docs say not to point requests at `backend-api` | [ChatGPT plan usage overview](https://developers.openai.com/siwc/token-sharing-open-source) | Rejected |
| Proxying calls through our own backend | Central control | Would make us "remotely hosted" and put tokens on a server | Same source | Rejected |

## Decision

The app uses Sign in with ChatGPT with ChatGPT plan usage and calls `https://api.openai.com/v1` straight from the Mac, through the Rust core, with the user's own token. Model calls never pass through Tempercraft servers. That includes the Cloud Functions that [ADR-012](ADR-012-firebase-blaze-plan.md) allows for other work.

## Consequences and mitigations

- Positive consequences: no hosting cost, and no user tokens on our servers.
- Costs and constraints introduced: the Responses API rules (`store: false`, `stream: true`, no hosted tools, several unsupported request fields) shape the agent; see [calling the model](../architecture/authentication.md#calling-the-model). Each user is bound by their plan's limits; ChatGPT Plus has a five-hour usage limit shared by every app that uses the plan.
- Failure or reversal risks: OpenAI changes its terms. The feature is labelled a preview.
- Mitigations and owners: follow OpenAI's UI/UX guidelines and handle usage-limit errors as specified in the [authentication design](../architecture/authentication.md#abuse-and-usability) (project owner).
- Revisit conditions: OpenAI changes its terms, or we add paid tiers ([ADR-003](ADR-003-free-and-open-source.md)).

## Implementation and evidence

- Design: [authentication and session design](../architecture/authentication.md) and [agent design](../architecture/agent.md).
- Code: not built yet. The `ModelClient` contract is in `packages/agent/src/index.ts`.
- Verification: NOT RUN.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
