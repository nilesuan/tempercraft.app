# ADR-016: Sentry for errors, bugs and observability in the website and app

| Field | Value |
|---|---|
| Document ID | ADR-016 |
| Product or service | Tempercraft: the website (tempercraft.app) and the desktop app (webview UI and Rust core) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-014](ADR-014-dev-and-prod-firebase-projects.md) (environments), [ADR-015](ADR-015-website-hosting-and-urls.md) (website), [ADR-017](ADR-017-google-analytics.md) (analytics), [architecture overview](../architecture/overview.md#environments-delivery-and-observability), [developer guide](../engineering/developer-guide.md#working-with-engineering-agents) (Sentry MCP) |

## Decision identity

- ADR number and title: ADR-016, Sentry for errors, bugs and observability in the website and app
- Decision status: Accepted. The owner chose Sentry; the integration details under Decision are proposals.
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

- **Need:** errors, bugs and performance problems in the website ([ADR-015](ADR-015-website-hosting-and-urls.md)) and the desktop app must reach the team. Today there's no telemetry at all.
- **The app has two parts:** the Solid UI runs in a webview, and the Rust core runs natively ([ADR-001](ADR-001-desktop-shell-tauri-2.md)). Either can fail on its own.
- **Constraints:**
  - The app is open source. A Sentry DSN is public by design: it only lets a client send events.
  - Tokens, prompts and file contents must never reach logs ([security rules](../architecture/overview.md#security-rules)).
  - Dev and prod are separate ([ADR-014](ADR-014-dev-and-prod-firebase-projects.md)).
- **Already in place:** the repo's `.mcp.json` connects Claude Code to Sentry.
- **Cost, checked on 2026-11-21:** Sentry's free Developer plan has one user and about 5,000 errors a month. The Team plan costs about US$26 a month, billed annually.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Sentry | One tool for the site and the app: errors, crashes, tracing and release health. A free plan, and an MCP server | For Tauri, the SDK is a community plugin at version 0.x. The free plan has one user and about 5,000 errors a month | [Sentry pricing](https://sentry.io/pricing/), [tauri-plugin-sentry](https://docs.rs/crate/tauri-plugin-sentry/latest/source/README.md), [Sentry: Tauri v2 support](https://sentry.zendesk.com/hc/en-us/articles/28526715924251-Does-Sentry-have-a-Tauri-v2-SDK) | Selected by the owner |
| Platform logs only | Nothing to add | No view of crashes in the app, or of errors in visitors' browsers | — | Rejected |

## Decision

The owner decided to use Sentry for errors, bugs and observability, in both the website and the desktop app.

The integration details below were proposed. The owner reordered the desktop approach to official SDKs first ([DEC-016](../product/decisions.md#decisions)), and the rest still needs confirming:
- **Projects:** two Sentry projects, `tempercraft-desktop` and `tempercraft-web`. Every event is tagged with its environment, dev or prod.
- **Desktop app:** Sentry's official SDKs first: the Rust SDK in the core catches panics, and the browser SDK in the webview catches JavaScript errors. If native crash reports become necessary, add the community `tauri-plugin-sentry` as well. Native crashes are faults outside Rust panics, and the plugin captures them as minidumps.
- **Website:** Sentry's browser SDK, or the SDK for the site's framework once that's chosen.
- **Privacy:**
  - Don't send personal data by default.
  - Before sending, scrub tokens, email addresses, home-folder paths, prompts and file contents.
  - No session replay.
- **Releases:** release builds upload source maps and debug symbols, so stack traces are readable.

## Consequences and mitigations

- Positive consequences: crashes and errors arrive with context, from both the site and the app, in one place.
- Costs and constraints introduced:
  - The free plan's limits: one user and about 5,000 errors a month.
  - The official SDKs alone don't capture native crashes outside Rust panics.
  - User data now reaches another service, so the privacy policy must name Sentry.
- Failure or reversal risks: a token or personal detail could leak into an event; the plugin could stop being maintained.
- Mitigations and owners (project owner):
  - Scrub data before it's sent, and test the scrubbing with known secrets.
  - Add the community plugin, with a pinned version, if native crashes show up.
- Revisit conditions:
  - Errors regularly pass the free quota, or more people need access (consider the Team plan).
  - Native crashes show up that the official SDKs miss.
  - Sentry releases an official Tauri SDK.

## Implementation and evidence

All NOT RUN:
1. Create the Sentry organization and the two projects.
2. Add the official Rust SDK and browser SDK to the app, and the browser SDK to the website, each with its environment tag.
3. Write the scrubbing rules and test them with fake tokens and email addresses.
4. Upload source maps and debug symbols from release builds.
5. Name Sentry in the privacy policy.

Open questions: should the Cloud Functions report to Sentry too? Should users be able to turn crash reports off in the app's settings?

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
