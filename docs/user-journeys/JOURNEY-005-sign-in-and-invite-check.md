# User journey: first sign-in and the invite check

| Field | Value |
|---|---|
| Document ID | JOURNEY-005 |
| Product or service | Tempercraft desktop app: first sign-in (Google through Firebase Auth) and the invite-only check |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 9 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); previous: [JOURNEY-004](JOURNEY-004-download-and-install.md); next: [JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md) for owners and managers, [JOURNEY-007](JOURNEY-007-member-onboarding.md) for members; [ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md); [authentication design](../architecture/authentication.md) |

## Journey context

- Journey ID and name: JOURNEY-005, first sign-in and the invite check
- User segment and goal: anyone who opens the app without a session. That's an invited owner, manager or member, or someone who wasn't invited. They want to get in.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when the app opens with no session. It's complete when an invited person reaches onboarding, or a non-invited person is told the release is invite-only.
- Preconditions and permissions: a Google account. On the happy path, there's an invite for that account's email address.
- Evidence or design sources: the owner's working notes; [ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md); the [authentication design](../architecture/authentication.md).

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Opens the app | Welcome screen | Shows Continue with Google | — | — | Owner's notes |
| 2 | Clicks Continue with Google | System browser | Opens Google sign-in | — | — | [ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md) |
| 3 | Signs in with Google | Browser | Shows "You can close this tab and return to Tempercraft" | Google account | Closing the browser before finishing | [Google sign-in steps](../architecture/authentication.md#google-sign-in-through-firebase-auth) |
| 4 | Returns to the app | App | Signs in to Firebase with the Google ID token | Firebase user | — | [Authentication design](../architecture/authentication.md) |
| 5 | Waits a moment | App | Looks for an invite for the account's verified Google email address, and checks that the address is at one of the org's verified domains and that the account isn't paused. If all of that holds, it connects the invite to the account and sets the role and org | Invite, role and org; the org's domains | The Google account's email differs from the invited one | Proposed; [DEC-007 and DEC-010](../product/decisions.md#decisions) |
| 6a | Invited: starts onboarding | App | Team owners and managers go to team setup ([JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md)); team members go to connecting ChatGPT ([JOURNEY-007](JOURNEY-007-member-onboarding.md)) | — | — | Owner's notes |
| 6b | Not invited: reads the message | App | "Tempercraft is invite-only for now", with the address they signed in with and a Sign out button | — | — | Owner's notes |

## Alternate paths

- **Wrong Google account:** the invite-only message shows which account they used, so they can sign out and sign in with the invited address.
- **Enforcing invite-only:** a `beforeUserCreated` blocking function rejects sign-ups without an invite, so Google accounts that weren't invited never get a Tempercraft account ([ADR-019](../adr/ADR-019-block-sign-up-without-invite.md), [DEC-017](../product/decisions.md#decisions)). It needs the project upgraded to Firebase Authentication with Identity Platform, which is free on Blaze up to 50,000 monthly active users. When the function refuses a sign-up, the app shows the invite-only message from step 6b.
- **No Google account for a work address:** people whose company doesn't use Google Workspace can create a Google account with their existing work address, which Google verifies. Their sign-in then carries that address.
- **Paused account:** if their email domain was removed from the org, the app shows "Account is paused, please contact your owner or team manager" ([DEC-010 and DEC-013](../product/decisions.md#decisions), [JOURNEY-010](JOURNEY-010-manage-domains.md)). An owner or manager can unpause them, and verifying the domain again restores them ([DEC-015](../product/decisions.md#decisions)).
- **Expired invite:** treated as not invited, with "Ask whoever invited you for a new invite."
- **Sign-in not finished:** the app offers to try again.
- **Offline:** the app explains that signing in needs a connection.
- **Onboarding interrupted:** the next launch resumes onboarding where they left off.

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 3 and 4. Sign-in | None yet | Share of started sign-ins that finish | Firebase Auth | Project owner |
| 5 and 6. Invite check | None yet | Share of sign-ins rejected as not invited | Function logs (proposed) | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. Is the account's verified Google email enough to claim an invite? The [authentication design](../architecture/authentication.md#account-linking) rules out matching on email text the user typed. A verified Google email is a different case, but it needs an explicit decision.
  2. What happens for an invited person whose Google account uses a different email address?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
