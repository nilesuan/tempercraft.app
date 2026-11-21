# User journey: a team owner or manager sets up the team and invites people

| Field | Value |
|---|---|
| Document ID | JOURNEY-006 |
| Product or service | Tempercraft desktop app: onboarding for team owners and team managers |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 8 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); previous: [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md); domains: [JOURNEY-010](JOURNEY-010-manage-domains.md); afterwards, the people invited follow [JOURNEY-003](JOURNEY-003-accept-invite.md); [DEC-003 to DEC-017](../product/decisions.md#decisions); [ADR-013](../adr/ADR-013-transactional-email-resend.md) |

## Journey context

- Journey ID and name: JOURNEY-006, team owner and team manager onboarding
- User segment and goal: a team owner or team manager who has just signed in for the first time ([DEC-003](../product/decisions.md#decisions)):
  - The team owner owns the org, and can also do everything a manager can. Billing comes in a later release ([DEC-005](../product/decisions.md#decisions)).
  - The team manager manages the team and its members.

  Both want the team set up and its people invited.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when the invite check finds a team owner or team manager invite. It's complete when the team exists and the invites are sent, or when they skip inviting.
- Preconditions and permissions:
  - A claimed team owner or team manager invite ([JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md)).
  - Each org has exactly one team, and the org is the tenant ([DEC-006](../product/decisions.md#decisions)). Setting up the team therefore creates the org.
  - Members' email addresses must be at one of the org's domains ([DEC-007](../product/decisions.md#decisions)). Each domain belongs to one org only, domains added after the owner's own are verified by DNS, and nobody outside the org's domains can join ([DEC-010 and DEC-017](../product/decisions.md#decisions)).
- Evidence or design sources: the owner's working notes ("as a manager, when onboarding, I will be asked to setup the team and invite team members"); DEC-003 to DEC-010.

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Owners only: sees "Set up your team" and enters the team's name | Onboarding | Creates the org and its one team, with them as the owner. Their own email domain, for example `onlineprojects.com.au`, becomes the org's first domain. It's trusted without a DNS check, because a system admin invited them | Org (the tenant) and its domains | Another org already has the domain | Owner's notes; [DEC-006 and DEC-017](../product/decisions.md#decisions) |
| 2 | Owners only, optionally: adds more domains, for example `opstaging.com.au`, and verifies each with a DNS record | Onboarding, or team settings later | Shows a TXT record to add, checks for it, and marks the domain verified ([JOURNEY-010](JOURNEY-010-manage-domains.md)) | Org domains | DNS changes can take a while to show up | [DEC-007, DEC-010 and DEC-017](../product/decisions.md#decisions) |
| 3 | Adds people by email address, each with a role they're allowed to give. Owners can invite owners, managers and members; managers can invite managers and members | Onboarding | Shows the verified domains, and rejects addresses at any other domain | Emails and roles | Typos | Owner's notes; [DEC-007](../product/decisions.md#decisions); invite roles from [DEC-009](../product/decisions.md#decisions) |
| 4 | Clicks Send invites | Onboarding | Calls `sendInvite` for each address, with its role and the org. The function checks the domain again. Shows "Invited {n} people" | Invite records | Resend's cap of 100 emails a day; some sends fail | Proposed; [ADR-013](../adr/ADR-013-transactional-email-resend.md) |
| 5 | Finishes onboarding | App | Opens the dashboard ([JOURNEY-008](JOURNEY-008-dashboard.md)) | — | Whether owners and managers connect ChatGPT first isn't decided | Proposed |

## Alternate paths

- **Managers:** steps 1 and 2 are for owners only, so managers go straight to inviting members.
- **An added domain not verified yet:** invites to addresses at that domain can't be sent until it's verified (proposed). The owner can still invite people at the first domain straight away.
- **Address at another domain:** rejected with "Only addresses at onlineprojects.com.au or opstaging.com.au can join this team." The function enforces the same rule, so a modified app can't get around it.
- **Contractors:** they need an address at one of the org's domains, which the org issues them ([DEC-010](../product/decisions.md#decisions)).
- **Public email domains:** domains such as gmail.com can never be verified, so they can't be org domains.
- **Skipping invites:** they can invite people later, from team settings.
- **Invalid addresses:** they're flagged inline, and the valid ones still go out.
- **Some invites fail:** the toast says which addresses failed, so they can retry them.
- **Removing a domain:** covered in [JOURNEY-010](JOURNEY-010-manage-domains.md). Its pending invites are cancelled and its accounts paused.
- **Leaving midway:** onboarding resumes at the next launch.

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 1. Team set up | None yet | Share of owners who finish setting up the team | Org and domain records in Firestore (proposed) | Project owner |
| 3 and 4. Invites sent | None yet | People invited per team, and addresses rejected for their domain | Invite records and function logs | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. Do owners and managers connect ChatGPT too, and when?
  2. Is there a team size limit in the first release?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
