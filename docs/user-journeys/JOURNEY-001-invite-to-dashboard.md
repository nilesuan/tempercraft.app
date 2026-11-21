# User journey: from invite to the first dashboard

| Field | Value |
|---|---|
| Document ID | JOURNEY-001 |
| Product or service | Tempercraft: the invite-only first release, end to end (invite email, website, macOS app) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 14 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | Detailed journeys [JOURNEY-002](JOURNEY-002-admin-invites-owner.md) to [JOURNEY-008](JOURNEY-008-dashboard.md), role changes in [JOURNEY-009](JOURNEY-009-change-role.md), and domains in [JOURNEY-010](JOURNEY-010-manage-domains.md); [DEC-001 to DEC-010](../product/decisions.md#decisions); [ADR-013](../adr/ADR-013-transactional-email-resend.md); [ADR-015](../adr/ADR-015-website-hosting-and-urls.md); the owner's working notes (`docs/SCRATCH.md`, kept out of git) |

## Journey context

- Journey ID and name: JOURNEY-001, from invite to the first dashboard. This is the end-to-end view; each stage has its own detailed journey.
- User segment and goal: the people invited to the invite-only first release ([DEC-001](../product/decisions.md#decisions)). A system admin invites a team owner ([DEC-004](../product/decisions.md#decisions)); the owner sets up the team and invites managers and members. Everyone wants to install Tempercraft and reach their dashboard.
- Current or proposed journey: proposed. None of it is built.
- Trigger and completion condition: it starts when a system admin invites a team owner. It's complete when the team's members reach their dashboards.
- Preconditions and permissions:
  - Roles ([DEC-003](../product/decisions.md#decisions)):

    | Role | What they do |
    | --- | --- |
    | System admin | Tempercraft staff; invites team owners |
    | Team owner | Owns the org, and its billing once that exists. Can do everything a team manager can, and can make other people owners |
    | Team manager | Manages the team and its members, and can change people's roles up to manager |
    | Team member | Uses the app; can't change anyone's role |
  - Each org has exactly one team, and the org is the tenant ([DEC-006](../product/decisions.md#decisions)). Billing comes in a later release ([DEC-005](../product/decisions.md#decisions)).
  - Members' email addresses must be at one of the org's email domains, which the owner manages ([DEC-007](../product/decisions.md#decisions)). Each domain belongs to one org only, so each account belongs to at most one org. Domains added after the owner's own are verified by DNS ([DEC-017](../product/decisions.md#decisions)). People outside the domains, such as contractors, need an address at one of them ([DEC-010](../product/decisions.md#decisions)).
  - Sign-up is only possible inside the app ([DEC-002](../product/decisions.md#decisions)).
  - Invitees need a Mac. Accounts use Google sign-in ([ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md)), and the agent also needs a connected ChatGPT account ([authentication design](../architecture/authentication.md)).
- Evidence or design sources: the owner's working notes and answers as of 2026-11-21, the [authentication design](../architecture/authentication.md), and ADR-013 to ADR-015.

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | System admin invites a team owner | App, admin screen ([DEC-016](../product/decisions.md#decisions)) | Sends the invite email and shows "Invited {email}" | Invitee's email and role | — | [JOURNEY-002](JOURNEY-002-admin-invites-owner.md) |
| 2 | Owner accepts the invite | Invite email, then the accept page on tempercraft.app | Confirms the acceptance and opens the download page | Invite token | Expired or already-used invites | [JOURNEY-003](JOURNEY-003-accept-invite.md) |
| 3 | Owner downloads and installs the app | Website, then the macOS disk image | Tempercraft is in Applications | Installer | macOS blocks unsigned builds | [JOURNEY-004](JOURNEY-004-download-and-install.md) |
| 4 | Owner signs in | App, then Google in the browser | Checks the invite and starts onboarding | Google identity, invite | Signing in with a different Google account than the invited one | [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md) |
| 5 | Owner sets up the team and invites managers and members | App onboarding | Creates the org, which has one team, with the owner's domain as its first domain, and sends the invites | Org, domains, emails and roles | Resend's free plan sends 100 emails a day | [JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md) |
| 6 | Each invitee accepts, installs and signs in | As steps 2 to 4 | As steps 2 to 4 | As steps 2 to 4 | As steps 2 to 4 | [JOURNEY-003](JOURNEY-003-accept-invite.md) to [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md) |
| 7 | Managers invite more members | App onboarding or team settings | Sends the member invites | Emails | As step 5 | [JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md) |
| 8 | Members connect ChatGPT | App onboarding, then ChatGPT in the browser | Connects each member's plan and opens the dashboard | ChatGPT tokens, in the Keychain | No eligible plan; a cancelled sign-in | [JOURNEY-007](JOURNEY-007-member-onboarding.md) |
| 9 | Everyone opens the app on later days | App | Goes straight to the dashboard while the session is valid | Recent projects | Session length isn't decided | [JOURNEY-008](JOURNEY-008-dashboard.md) |

## Alternate paths

- **Not invited:** anyone can download the app, but signing in without an invite shows "Tempercraft is invite-only for now" ([JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md)).
- **Visiting the site directly:** a visitor who finds tempercraft.app can download the app but can't sign up ([JOURNEY-004](JOURNEY-004-download-and-install.md)).
- **Changing roles later:** owners and managers change roles in team settings ([JOURNEY-009](JOURNEY-009-change-role.md), [DEC-008 and DEC-009](../product/decisions.md#decisions)). Nobody can change their own role.
- **Managing domains later:** owners add, verify and remove domains in team settings ([JOURNEY-010](JOURNEY-010-manage-domains.md)).
- **Failures:** each detailed journey lists its own alternate and failure paths.

## Requirements and measures

There's no PRD yet, so no step has a requirement ID. These end-to-end measures are proposals:

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| Whole journey | None yet | Time from the owner's invite to the first member's dashboard | Invite timestamps in Firestore (proposed) | Project owner |
| Drop-off | None yet | Share of invitees who stop at each stage | Invite status: sent, accepted, signed in, onboarded (proposed) | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions for the owner, across the journeys:
  1. **Matching an invite to the person who signs in:** see [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md).
  2. **Session length:** the owner's notes call for an ADR on how long sessions last ([JOURNEY-008](JOURNEY-008-dashboard.md)).
  3. **ChatGPT for owners and managers:** members connect ChatGPT during onboarding. Do owners and managers too?
  4. **Recent projects:** where the dashboard's list comes from ([JOURNEY-008](JOURNEY-008-dashboard.md)).

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
