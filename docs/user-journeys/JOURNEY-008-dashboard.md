# User journey: return to the dashboard

| Field | Value |
|---|---|
| Document ID | JOURNEY-008 |
| Product or service | Tempercraft desktop app: launching with a saved session, and the dashboard |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 5 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); previous: [JOURNEY-007](JOURNEY-007-member-onboarding.md); [session contract](../architecture/authentication.md#session-contract) |

## Journey context

- Journey ID and name: JOURNEY-008, return to the dashboard
- User segment and goal: anyone in a team, whether member, manager or owner, opening Tempercraft again. They want to pick up their work.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when they open the app. It's complete when the dashboard shows their recent projects, or the empty state.
- Preconditions and permissions: a signed-in account whose session is still valid, with ChatGPT connected.
- Evidence or design sources: the owner's working notes; the [session contract](../architecture/authentication.md#session-contract).

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Opens the app | App | Restores the Firebase session | Firebase session | — | Owner's notes |
| 2 | — | App | With a valid session, goes straight to the dashboard, with no sign-in screen. If the ChatGPT access token is close to expiry, it refreshes it in the background | ChatGPT tokens | The session is no longer valid | Owner's notes; [session contract](../architecture/authentication.md#session-contract) |
| 3 | Looks at the dashboard | Dashboard | Lists their recent projects | Recent projects | Where the list comes from isn't decided | Owner's notes |
| 4 | Has no projects yet | Dashboard | An empty state that says "You have no projects" | — | — | Owner's notes |
| 5 | Opens a project | Dashboard | Opens the chat and the preview | Project folder | The folder was moved or deleted | Proposed |

## Alternate paths

- **Session no longer valid:** goes to sign-in ([JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md)).
- **ChatGPT disconnected:** if the ChatGPT refresh token lapsed or was revoked, the app asks them to reconnect ([JOURNEY-007](JOURNEY-007-member-onboarding.md)).
- **Removed from the team:** not specified.
- **Paused account:** if their email domain is removed from the org, the app blocks access and shows "Account is paused, please contact your owner or team manager" ([DEC-010 and DEC-013](../product/decisions.md#decisions)). An owner or manager can unpause them ([DEC-015](../product/decisions.md#decisions)).
- **Offline:** the dashboard can still list local projects, but the agent can't run.
- **Missing project folder:** the project is marked missing, with options to locate it or remove it from the list.

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 2. Session restore | None yet | Share of launches that reach the dashboard without signing in | Not decided; there are no analytics yet | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Facts for the session decision:
  - **Firebase:** sessions are long-lived. ID tokens last an hour and refresh automatically. The refresh token expires only when the user is deleted or disabled, after a major account change, or when it's revoked ([Firebase: manage sessions](https://firebase.google.com/docs/auth/admin/manage-sessions)). So unless we cap it, a Tempercraft session lasts until sign-out.
  - **ChatGPT:** the connection uses a refresh token that lasts 30 days and renews with every refresh ([session contract](../architecture/authentication.md#session-contract)).
- Open questions:
  1. **How long do sessions last?** The owner's notes call for an ADR. The options are to keep Firebase's default (until sign-out or revocation), or to require signing in again after a set time.
  2. What counts as a "recent project", and are projects personal or shared with the team?
  3. How many projects does the dashboard show, and in what order?
  4. Does the empty state offer anything besides the message, such as a New project button?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
