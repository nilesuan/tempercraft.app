# User journey: a team member connects ChatGPT

| Field | Value |
|---|---|
| Document ID | JOURNEY-007 |
| Product or service | Tempercraft desktop app: onboarding for team members (Sign in with ChatGPT) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); previous: [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md); next: [JOURNEY-008](JOURNEY-008-dashboard.md); [ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md); [Sign in with ChatGPT design](../architecture/authentication.md#sign-in-with-chatgpt-plan-usage) |

## Journey context

- Journey ID and name: JOURNEY-007, team member onboarding: connect ChatGPT
- User segment and goal: a team member who has just signed in for the first time. They want to start designing. Tempercraft runs the agent on their own ChatGPT plan ([ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md)).
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when the invite check finds a team member invite. It's complete when ChatGPT is connected and the dashboard opens.
- Preconditions and permissions: a claimed team member invite, and a ChatGPT account on a plan that allows ChatGPT plan usage.
- Evidence or design sources: the owner's working notes ("connect my openai account"); OpenAI's flow and UI guidelines, as set out in the [authentication design](../architecture/authentication.md).

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Sees "Connect your ChatGPT account" | Onboarding | Shows the Continue with ChatGPT button, with OpenAI's approved branding | — | — | Owner's notes; [OpenAI's UI requirements](../architecture/authentication.md#abuse-and-usability) |
| 2 | Clicks Continue with ChatGPT | System browser | Opens OpenAI's sign-in. The first time, this also registers the installation | Host ID | — | [Sign in with ChatGPT](../architecture/authentication.md#sign-in-with-chatgpt-plan-usage) |
| 3 | Signs in to ChatGPT and approves Tempercraft | Browser | Returns to the app | — | Cancelling, or denying access | [Authentication design](../architecture/authentication.md) |
| 4 | Returns to the app | App | Validates the tokens, checks the granted scopes, and stores the tokens in the Keychain | ChatGPT tokens | The plan doesn't allow plan usage | [Authentication design](../architecture/authentication.md) |
| 5 | Reads "You're using your ChatGPT plan" and clicks Got it | Dialog, shown once | — | — | — | [OpenAI's UI requirements](../architecture/authentication.md#abuse-and-usability) |
| 6 | Lands on the dashboard | Dashboard | Continues in [JOURNEY-008](JOURNEY-008-dashboard.md) | — | — | Owner's notes |

## Alternate paths

- **Cancelled or denied:** the step stays open and explains that Tempercraft needs ChatGPT to run the agent.
- **No eligible plan:** the app explains which plans work. Whether users can paste an OpenAI API key instead isn't decided ([register gaps](../README.md#gaps-and-actions)).
- **Several ChatGPT accounts:** they can add or switch accounts later in settings.
- **Usage limits later:** a usage-limit error shows Manage usage, which links to ChatGPT's usage settings.
- **Skipping for now:** not specified. Without ChatGPT, the agent can't run.

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 2 to 4. Connect | None yet | Share of members who connect ChatGPT on the first try | App events; there are no analytics yet | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. Can members skip this step and connect later?
  2. Do owners and managers go through it too ([JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md))?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
