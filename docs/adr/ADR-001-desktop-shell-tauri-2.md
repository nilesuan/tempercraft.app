# ADR-001: Desktop shell is Tauri 2

| Field | Value |
|---|---|
| Document ID | ADR-001 |
| Product or service | Tempercraft desktop app: application shell (macOS first; Windows and Linux later) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Architecture overview](../architecture/overview.md), [developer guide](../engineering/developer-guide.md), [ADR-010](ADR-010-preview-iframe-loopback.md) |

## Decision identity

- ADR number and title: ADR-001, Desktop shell is Tauri 2
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

Tempercraft is a desktop app, macOS first, with Windows and Linux possible later. It shows a chat next to a live preview of locally generated HTML. The owner ruled out Electron because of its memory use. The shell has to give the app files, a local preview server, the macOS Keychain and HTTPS, while keeping the privileged part small.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Tauri 2 | Uses the operating system's web engine instead of shipping Chromium; on macOS that's WKWebView, Safari's engine. The app is much smaller and uses less memory. A thin Rust core handles files, the preview server, the Keychain and HTTP. Windows (WebView2) and Linux (WebKitGTK) come later from the same code | Some Rust. The preview renders with each OS's own engine, and Linux's WebKitGTK is the weakest. Native screenshots need per-platform code | The scaffold builds and runs on Tauri 2.12 ([developer guide](../engineering/developer-guide.md#onboarding-verification)) | Selected |
| Electron | Identical Chromium everywhere and the richest APIs | Ships Chromium, which brings the size and RAM cost the owner wants to avoid | Owner's requirement | Rejected |
| Native SwiftUI | The best Mac feel | Windows and Linux would be a rewrite | — | Rejected |
| Electrobun | TypeScript end to end | Young, with a small ecosystem | — | Rejected |

## Decision

Build the desktop app on Tauri 2 and stay on the 2.x line. Tauri 3 is in alpha (`@tauri-apps/cli` 3.0.0-alpha.6 on 2026-11-21).

## Consequences and mitigations

- Positive consequences: a small app with low memory use, and one codebase for macOS now and Windows and Linux later.
- Costs and constraints introduced: some Rust; rendering differs between WebKit, WebView2 and WebKitGTK; native screenshots need per-platform code.
- Failure or reversal risks: WebKit rendering differences could hurt users' designs.
- Mitigations and owners: keep the Rust core thin, so a change of shell stays contained (project owner).
- Revisit conditions: WebKit rendering differences hurt users' designs, Linux becomes a priority, or Tauri 3 becomes stable.

## Implementation and evidence

- Code: `apps/desktop/`. The Rust core is in `src-tauri/` (crate `tempercraft`). Current versions are in the [developer guide](../engineering/developer-guide.md#daily-workflow).
- Design: [architecture overview](../architecture/overview.md). The preview approach follows from Tauri's current limits ([ADR-010](ADR-010-preview-iframe-loopback.md)).
- Evidence: on 2026-11-21 the full `tauri build` pipeline compiled and the UI rendered ([Solid 2.0 standards](../engineering/solid-2-standards.md#review-and-evidence)).

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
