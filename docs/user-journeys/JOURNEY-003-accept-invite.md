# User journey: accept an invite

| Field | Value |
|---|---|
| Document ID | JOURNEY-003 |
| Product or service | Tempercraft: the invite email and the accept page on tempercraft.app |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 3 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); previous: [JOURNEY-002](JOURNEY-002-admin-invites-owner.md); next: [JOURNEY-004](JOURNEY-004-download-and-install.md); [ADR-013](../adr/ADR-013-transactional-email-resend.md); [ADR-015](../adr/ADR-015-website-hosting-and-urls.md) |

## Journey context

- Journey ID and name: JOURNEY-003, accept an invite
- User segment and goal: anyone invited. That's a team owner invited by a system admin, or the managers and members an owner or manager invites ([JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md)). They want to accept and get the app.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when the invite email arrives. It's complete when the accept page confirms the invite and takes them to the download page.
- Preconditions and permissions: a pending, unexpired invite. Nobody signs in on the web, because accounts are only created in the app ([DEC-002](../product/decisions.md#decisions)).
- Evidence or design sources: the owner's working notes; [ADR-015](../adr/ADR-015-website-hosting-and-urls.md) for the URLs.

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Opens the invite email | Email from `Tempercraft <invites@mail.tempercraft.app>` | — | — | The email lands in spam | [ADR-013](../adr/ADR-013-transactional-email-resend.md) |
| 2 | Clicks Accept | A button linking to `https://tempercraft.app/invite/{token}`, or `https://dev.tempercraft.app/invite/{token}` in dev | Opens the accept page | Invite token | — | Owner's notes; [ADR-015](../adr/ADR-015-website-hosting-and-urls.md) |
| 3 | Waits a moment | Accept page | The page's script calls `/api/invites/accept`, which checks that the token is valid, unexpired and unused, then records the acceptance | Invite status | Expired, used or unknown token | Proposed |
| 4 | Reads the confirmation | Accept page | "You've accepted your invite", with the invited email address | Invited email | — | Owner's notes |
| 5 | Goes to the download page | `/download` | Goes there automatically, with a Download button as a fallback | — | — | Owner's notes |

## Alternate paths

- **Link scanners:** some mail systems open every link in an email to check it. If merely opening the page accepted the invite, a scanner could accept it. So acceptance happens when the page's script calls the API, which scanners usually don't run.
- **Expired invite:** "This invite has expired. Ask whoever invited you for a new one."
- **Already accepted:** the confirmation shows again, with the download link.
- **Unknown or revoked token:** "This invite isn't valid." The message doesn't reveal whether the address was ever invited.
- **Opened on a phone or a PC:** the page accepts the invite and explains that Tempercraft runs on macOS, so they should download it on a Mac.
- **Forwarded email:** whoever opens the link can accept it, but signing in still has to match the invited address ([JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md)).
- **App already installed:** the confirmation page also offers Open Tempercraft, which uses the `tempercraft://` link ([ADR-018](../adr/ADR-018-open-app-from-browser.md)).

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 3 and 4. Accept | None yet | Share of invites accepted, and time from sending to acceptance | Invite timestamps (proposed) | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. Should accepting on the web be required, or is signing in to the app with the invited account enough?
  2. How long is an invite valid?
  3. What should the email say, and under which sender name?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
