# ADR-019: Block sign-up without an invite, using Firebase Authentication with Identity Platform

| Field | Value |
|---|---|
| Document ID | ADR-019 |
| Product or service | Tempercraft: account creation in Firebase Auth (`tempercraft-dev` and `tempercraft`) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [DEC-001, DEC-007, DEC-010 and DEC-017](../product/decisions.md#decisions); [ADR-008](ADR-008-google-sign-in-firebase-system-browser.md) (Google sign-in); [ADR-014](ADR-014-dev-and-prod-firebase-projects.md) (projects); [JOURNEY-005](../user-journeys/JOURNEY-005-sign-in-and-invite-check.md); [authentication design](../architecture/authentication.md#account-and-authenticator-lifecycle) |

## Decision identity

- ADR number and title: ADR-019, Block sign-up without an invite, using Firebase Authentication with Identity Platform
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21 ([DEC-017](../product/decisions.md#decisions))
- Supersedes or superseded by: N/A

## Context

- **Who may join:** the first release is invite-only ([DEC-001](../product/decisions.md#decisions)). Only invited addresses at an org's domains may join ([DEC-007 and DEC-010](../product/decisions.md#decisions)).
- **What Firebase does by default:** it creates an account the first time anyone signs in with Google through `signInWithCredential` ([ADR-008](ADR-008-google-sign-in-firebase-system-browser.md)). Nothing stops that unless a blocking function refuses it.
- **What blocking functions need:** Firebase Authentication with Identity Platform. The upgrade needs no migration, and existing SDK code keeps working. It also unlocks multi-factor authentication, audit logging, and SAML and OIDC providers.
- **Cost:** on the Blaze plan, which both projects use, Google sign-in is free up to 50,000 monthly active users, then from about US$0.0055 per monthly active user. The blocking function is an ordinary Cloud Function, within the free tier at invite volumes.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| A `beforeUserCreated` blocking function | A Google account without an invite never becomes a Tempercraft account. The check runs on Google's side, before the account exists | Needs the Identity Platform upgrade. Every sign-up depends on the function | [Firebase: blocking functions](https://firebase.google.com/docs/auth/extend-with-blocking-functions), [Firebase Authentication with Identity Platform](https://firebase.google.com/docs/auth#identity-platform), [Firebase pricing](https://firebase.google.com/pricing) | Selected |
| A check after sign-in | No upgrade | Firebase creates an account for anyone first, which then has to be ignored or deleted | — | Rejected |

## Decision

- **The upgrade:** both projects move to Firebase Authentication with Identity Platform, `tempercraft-dev` first.
- **The check:** a `beforeUserCreated` blocking function refuses to create an account unless the Google account's verified email has a valid invite. The address must be at one of the org's domains, or be the owner a system admin invited.
- **When it refuses:** the app shows "Tempercraft is invite-only for now", with the address they signed in with ([JOURNEY-005](../user-journeys/JOURNEY-005-sign-in-and-invite-check.md)).

## Consequences and mitigations

- Positive consequences: invite-only is enforced on the server before an account exists, so there are no stray accounts.
- Costs and constraints introduced:
  - Charges per monthly active user above 50,000.
  - A function sits in the sign-up path. If it fails, sign-ups fail too: the check fails closed.
- Failure or reversal risks: a bug or outage in the function would block legitimate sign-ups.
- Mitigations and owners (project owner):
  - Keep the function small.
  - Test both allowed and refused sign-ups.
  - Watch its errors.
- Revisit conditions: sign-up opens to the public, or monthly active users approach 50,000.

## Implementation and evidence

All NOT RUN:
1. Upgrade `tempercraft-dev` to Firebase Authentication with Identity Platform, then `tempercraft`.
2. Write and deploy the `beforeUserCreated` function with the other functions.
3. Test it:
   - an invited address is allowed;
   - an address without an invite is refused;
   - an address at a domain that isn't the org's is refused;
   - an expired invite is refused.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
