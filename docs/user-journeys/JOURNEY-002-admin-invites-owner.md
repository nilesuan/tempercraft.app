# User journey: a system admin invites a team owner

| Field | Value |
|---|---|
| Document ID | JOURNEY-002 |
| Product or service | Tempercraft: sending invites (desktop app and the `sendInvite` function) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 7 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); next: [JOURNEY-003](JOURNEY-003-accept-invite.md); [DEC-003, DEC-004, DEC-007 and DEC-010](../product/decisions.md#decisions); [ADR-013](../adr/ADR-013-transactional-email-resend.md); [ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md) |

## Journey context

- Journey ID and name: JOURNEY-002, a system admin invites a team owner
- User segment and goal: a system admin, meaning Tempercraft's own staff. They want a new organization to join the invite-only release.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when the admin decides to bring in a new organization. It's complete when the app confirms "Invited {email}" and the invite email is on its way.
- Preconditions and permissions:
  - The admin is signed in and holds the system admin role. How that role is granted isn't designed; a Firebase custom claim set by a script is one option.
  - **Who gets invited:** system admins invite team owners first, and owners and managers invite everyone else ([DEC-004](../product/decisions.md#decisions), [JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md)). Each new org starts with its owner, and the owner's email domain becomes the org's first domain ([DEC-007](../product/decisions.md#decisions)). So the admin invites them at their company address. The admin's invite vouches for that domain, so the owner can invite people straight away, with no DNS check ([DEC-017](../product/decisions.md#decisions)).
  - **Where invites are sent from:** an admin screen in the desktop app, shown only to system admins ([DEC-016](../product/decisions.md#decisions)). It reuses the app's sign-in, so no admin website has to be built or secured.
- Evidence or design sources: the owner's working notes; [DEC-003, DEC-004, DEC-007 and DEC-010](../product/decisions.md#decisions); [ADR-013](../adr/ADR-013-transactional-email-resend.md) for how the email is sent.

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Opens the admin screen | App, admin screen visible only to system admins | Shows the invite form and the list of sent invites | — | — | [DEC-016](../product/decisions.md#decisions) |
| 2 | Enters the future owner's company email address | Invite form | Checks the address format, and refuses domains another org already has ([DEC-010](../product/decisions.md#decisions)). Proposed: also refuses public email domains such as gmail.com, since they can never be verified | Invitee's email | A typo sends the invite to the wrong person | Proposed |
| 3 | Clicks Send invite | Invite form | Calls the `sendInvite` function. It checks the caller is a system admin, records the invite (email, role team owner, inviter, expiry), and sends the email through Resend | Invite record, with a single-use token stored only as a hash | Resend errors; the free plan's cap of 100 emails a day | Owner's notes; [ADR-013](../adr/ADR-013-transactional-email-resend.md) |
| 4 | Sees the confirmation | Toast | "Invited {email}" | — | — | Owner's notes |
| 5 | Checks on the invite later | Admin screen, sent invites | Shows each invite's status: sent, accepted or expired | Invite status | — | Proposed |

## Alternate paths

- **Invalid address:** the form shows an error and sends nothing.
- **Already invited:** the admin can resend the pending invite instead of creating a second one.
- **Already a user:** the form says so and sends nothing.
- **Inviting a manager or member directly:** not in the first release. Owners and managers do that ([DEC-004](../product/decisions.md#decisions)).
- **Sending fails:** an error toast replaces the confirmation, and the invite isn't marked as sent. This covers reaching Resend's cap of 100 emails a day, which dev and prod share.
- **Revoking:** an admin can cancel a pending invite, and its link stops working.
- **Dev environment:** dev sends only to allowlisted addresses ([ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md)). Other addresses fail with a clear message.
- **Offline:** the request fails with an error toast.
- **Accessibility:** screen readers announce the toast.

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 3. Send invite | None yet | Invites delivered, out of invites sent | Resend delivery events | Project owner |
| 4. Confirmation | None yet | The toast appears only after the function succeeds | Function logs | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. How does someone become a system admin?
  2. How long does an invite stay valid, and can it be resent or revoked?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
