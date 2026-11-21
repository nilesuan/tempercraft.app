# ADR-017: Google Analytics for the website and the app

| Field | Value |
|---|---|
| Document ID | ADR-017 |
| Product or service | Tempercraft: product analytics for the website (tempercraft.app) and the desktop app |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-016](ADR-016-sentry-error-tracking.md) (errors), [ADR-012](ADR-012-firebase-blaze-plan.md) (Cloud Functions), [ADR-014](ADR-014-dev-and-prod-firebase-projects.md) (environments), [ADR-015](ADR-015-website-hosting-and-urls.md) (website), [authentication design](../architecture/authentication.md#session-contract) |

## Decision identity

- ADR number and title: ADR-017, Google Analytics for the website and the app
- Decision status: Accepted. The owner chose Google Analytics for both; the integration details under Decision are proposals.
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

- **Need:** see how people use the website and the app, for example how many invitees finish onboarding ([user journeys](../user-journeys/JOURNEY-001-invite-to-dashboard.md#requirements-and-measures)).
- **Website:** a normal website, which Google Analytics 4 (GA4) measures with its standard tag, `gtag.js`.
- **App:** a desktop app whose UI the webview loads from the app itself, not from a website. GA4's Measurement Protocol accepts events from anywhere, but Google says it is meant "to supplement, not replace" the normal tag. Its `api_secret` is "private to your organization" and "should be regularly updated to avoid excessive SPAM", so it can't ship inside an open-source app.
- **Constraints:**
  - Tokens must never reach analytics ([authentication design](../architecture/authentication.md#session-contract)).
  - Prompts, file contents and email addresses mustn't either; Google's terms also forbid sending personal data.
  - In many regions, including the EU and the UK, analytics needs the user's consent.
- **Cost:** GA4's standard tier is free.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| GA4 tag on the website | The standard setup, and free | Needs a consent banner where the law requires one | [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) | Selected for the website |
| GA4 tag inside the app's webview | The same code as the site | Untested on the app's own address (`tauri://localhost`), and GA expects web pages | — | Not chosen; could be tested later |
| Measurement Protocol called straight from the app | Simple | The secret would be published with the open-source app, inviting fake events | [Measurement Protocol reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference) | Rejected |
| Measurement Protocol through a Cloud Function that holds the secret | The secret stays on the server. Only signed-in users' events are accepted, and only listed event names | A function call for each batch of events. Events from before sign-in need another route | Same source; [ADR-012](ADR-012-firebase-blaze-plan.md) | Proposed for the app |

## Decision

The owner decided to use Google Analytics for both the website and the app.

The owner confirmed these integration details on 2026-11-21 ([DEC-016](../product/decisions.md#decisions)):
- **Website:** the GA4 tag with Consent Mode, plus a consent banner for visitors in regions that need one.
- **App:** the app batches its events and sends them to a `trackEvents` Cloud Function. The function checks the caller's Firebase identity and the event names, then forwards the events to GA4's Measurement Protocol. The `api_secret` lives in Secret Manager and is rotated regularly.
- **Environments:** dev and prod send to separate GA4 properties ([ADR-014](ADR-014-dev-and-prod-firebase-projects.md)).
- **Consent in the app:** on first launch, the app asks whether to share anonymous usage data, and sends nothing until the user agrees. They can change their answer in settings.
- **What gets sent:** only events and parameters listed in an analytics tracking plan. Never prompts, file names or contents, email addresses, or tokens.

## Consequences and mitigations

- Positive consequences: one free analytics tool across the site and the app.
- Costs and constraints introduced:
  - A consent banner, a consent prompt in the app, and a privacy policy that names Google Analytics.
  - A small Cloud Function for the app's events.
  - The Measurement Protocol collects nothing automatically: every event has to be sent on purpose.
- Failure or reversal risks: personal data sent by mistake; fake events if the function is abused.
- Mitigations and owners (project owner):
  - The function forwards only events and parameters on its list, and only from signed-in users.
  - The tracking plan is reviewed with each new event.
- Revisit conditions:
  - Tests show the GA4 tag works inside the app's webview.
  - Consent or privacy requirements outweigh the value of the data.
  - Event volume makes the function costly.

## Implementation and evidence

All NOT RUN:
1. Create GA4 properties for dev and prod, each with streams for the website and the app.
2. Write the analytics tracking plan, listing events, parameters and the consent rules.
3. Add the website tag with Consent Mode and a consent banner.
4. Build `trackEvents`, and the app's consent prompt and setting.
5. Name Google Analytics in the privacy policy.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
