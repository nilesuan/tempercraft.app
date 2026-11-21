# ADR-012: Firebase on the Blaze plan, with Cloud Functions for server-side work

| Field | Value |
|---|---|
| Document ID | ADR-012 |
| Product or service | Tempercraft: Firebase project `tempercraft` |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | Supersedes [ADR-009](ADR-009-firebase-spark-no-cloud-functions.md); [ADR-013](ADR-013-transactional-email-resend.md); [architecture overview](../architecture/overview.md) |

## Decision identity

- ADR number and title: ADR-012, Firebase on the Blaze plan, with Cloud Functions for server-side work
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21. The project was already on Blaze when the owner confirmed it; the date of the upgrade isn't recorded.
- Supersedes or superseded by: supersedes [ADR-009](ADR-009-firebase-spark-no-cloud-functions.md)

## Context

[ADR-009](ADR-009-firebase-spark-no-cloud-functions.md) kept the `tempercraft` project on the free Spark plan with no Cloud Functions, because nothing needed a server. Two things changed on 2026-11-21:

- **The project is on Blaze.** The owner confirmed it, and `gcloud billing projects describe tempercraft` reports billing enabled.
- **Invites need server-side code.** The first release is invite-only ([DEC-001](../product/decisions.md#decisions)), so Tempercraft has to send invite emails. The app is open source ([ADR-003](ADR-003-free-and-open-source.md)), so an email API key shipped inside it could be pulled out and used to send mail as tempercraft.app.

Cloud Functions, Firebase extensions such as Trigger Email, and new Cloud Storage buckets all require Blaze.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Blaze, with Cloud Functions for work that can't run on the Mac | Server-side code and secrets (Secret Manager) in the same project as Auth and Firestore. Higher Auth email limits | Usage beyond the no-cost quotas is billed. Budgets send alerts but don't cap spending | [Firebase Auth limits](https://firebase.google.com/docs/auth/limits) | Selected |
| Spark, with no server-side code | No billing | No way to send invite emails without exposing a key. Email-link sign-in is limited to 5 emails a day | Same source | Rejected: the project is already on Blaze, and invites need a server |
| Spark, plus a separate backend such as Cloudflare Workers | Keeps Firebase free | A second platform to secure and deploy. The Worker would have to verify Firebase identities and read Firestore on its own | — | Rejected: more moving parts for the same result |

## Decision

Run the `tempercraft` Firebase project on Blaze.
- **Cloud Functions are allowed** for work that needs a secret or has to be trusted, so it can't run on the user's Mac. The first is sending invite emails ([ADR-013](ADR-013-transactional-email-resend.md)).
- **Model calls are unchanged.** They still go straight from the Mac to OpenAI and never through a function ([ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md)).
- **Cloud Storage stays unused** until file storage is needed.

## Consequences and mitigations

- Positive consequences: server-side code and secrets are available. Firebase Auth's Blaze email limits apply, for example 25,000 email-link sign-in emails a day instead of 5.
- Costs and constraints introduced:
  - A billing account is attached, and usage beyond the no-cost quotas is billed.
  - "No server" now means no server for model calls; small functions may exist for invites.
- Failure or reversal risks: the Firebase config in an open-source app is public, so anyone can call a public function. Abuse could run up cost or send unwanted mail.
- Mitigations and owners:
  - Every function verifies the caller's Firebase identity and role, and rate-limits.
  - Set a budget alert in Cloud Billing. Project owner; not confirmed yet ([register gaps](../README.md#gaps-and-actions)).
- Revisit conditions: monthly spend exceeds the budget, or a server-side feature would carry model calls or user tokens, which would conflict with [ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md).

## Implementation and evidence

- Billing enabled on `tempercraft`: checked with `gcloud billing projects describe tempercraft` on 2026-11-21.
- No functions exist yet. When the first one is written, add a `functions` entry to `firebase.json` and update the [architecture overview](../architecture/overview.md).
- Budget alert: NOT RUN (not confirmed).

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
