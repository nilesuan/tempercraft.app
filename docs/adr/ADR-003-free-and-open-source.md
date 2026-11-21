# ADR-003: Tempercraft is free and open source

| Field | Value |
|---|---|
| Document ID | ADR-003 |
| Product or service | Tempercraft: distribution and licensing model |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md), [authentication design](../architecture/authentication.md), [register gaps](../README.md#gaps-and-actions) |

## Decision identity

- ADR number and title: ADR-003, Tempercraft is free and open source
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

The owner first planned to sell Tempercraft as a subscription. On 2026-11-21 they decided it will be free and open source. This is a product decision, but it's recorded as an ADR because the architecture depends on it: OpenAI documents ChatGPT plan usage for "open-source and locally hosted apps", while paid or remotely hosted apps have to apply through OpenAI's interest form ([ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md)).

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Free and open source | Users bring their own ChatGPT plan without OpenAI partner approval; no billing to build | No revenue. The code is public, so the app can't hold secrets | [ChatGPT plan usage overview](https://developers.openai.com/siwc/token-sharing-open-source) | Selected: the owner's call |
| Paid subscription (the original plan) | Revenue | Using people's ChatGPT plans in a paid app requires OpenAI's interest form; billing and entitlements to build | Same source | Rejected |

## Decision

Tempercraft is free and open source. No license is chosen yet.

## Consequences and mitigations

- Positive consequences: it's what lets users bring their ChatGPT plan without OpenAI partner approval ([ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md)).
- Costs and constraints introduced:
  - Until a license is added, nobody else can legally reuse the code.
  - Nothing secret can ship in the app. Server-side secrets go in Cloud Functions ([ADR-012](ADR-012-firebase-blaze-plan.md)).
- Failure or reversal risks: OpenAI could change its terms for open-source apps.
- Mitigations and owners: choose a license (MIT and Apache-2.0 are the usual picks) and add a `LICENSE` file (project owner; tracked in the [register gaps](../README.md#gaps-and-actions)).
- Revisit conditions: we add paid tiers. Using people's ChatGPT plans in a paid app requires OpenAI's interest form.

## Implementation and evidence

- License: the Apache License 2.0, chosen on 2026-11-21 ([DEC-018](../product/decisions.md#decisions)). See `LICENSE` and `NOTICE` at the repo root.
- Dependent decisions: [ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md) relies on this one.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
