# ADR-009: Backend is Firebase on the free Spark plan, with no Cloud Functions

| Field | Value |
|---|---|
| Document ID | ADR-009 |
| Product or service | Tempercraft: Firebase project `tempercraft` |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Superseded |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | Superseded by [ADR-012](ADR-012-firebase-blaze-plan.md) |

## Decision identity

- ADR number and title: ADR-009, Backend is Firebase on the free Spark plan, with no Cloud Functions
- Decision status: Superseded
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: superseded by [ADR-012](ADR-012-firebase-blaze-plan.md) on 2026-11-21

## Context

As recorded on 2026-11-21: nothing needed to run on a server, and Auth and Firestore both have free tiers on Spark.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Spark plan, no Cloud Functions | No cost and no billing account | No Cloud Functions, and no new Cloud Storage buckets | Cloud Storage for Firebase requires the pay-as-you-go Blaze plan for new default buckets since 2024-10-30 | Selected at the time |
| Blaze plan | Cloud Functions and Storage | Pay-as-you-go billing | Same | Rejected at the time: nothing needed it |

## Decision

As recorded: Firebase on the free Spark plan, with no Cloud Functions. Avoid Cloud Storage unless file storage becomes necessary.

## Consequences and mitigations

- Positive consequences: no cost and no billing account.
- Costs and constraints introduced: no server-side code and no file storage.
- Failure or reversal risks: any feature that needs a secret or trusted server-side code would force a change of plan.
- Mitigations and owners: N/A; superseded.
- Revisit conditions: server-side work or file storage becomes necessary. Both happened; see below.

## Implementation and evidence

Superseded by [ADR-012](ADR-012-firebase-blaze-plan.md) on 2026-11-21. The owner confirmed that the project is on Blaze, and invite emails for the invite-only first release ([DEC-001](../product/decisions.md#decisions)) need server-side code. The date the project moved to Blaze isn't recorded. This record keeps the original rationale as history.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
