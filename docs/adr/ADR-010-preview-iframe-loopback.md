# ADR-010: The preview is an iframe served from 127.0.0.1

| Field | Value |
|---|---|
| Document ID | ADR-010 |
| Product or service | Tempercraft desktop app: preview and element picker |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Architecture: preview and picker](../architecture/overview.md#preview-and-element-picker-planned), [ADR-001](ADR-001-desktop-shell-tauri-2.md) |

## Decision identity

- ADR number and title: ADR-010, The preview is an iframe served from 127.0.0.1
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

The app shows a live preview of the generated pages next to the chat, with an element picker. Generated code is untrusted, so it must not reach the app, its IPC or any token.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| An iframe in the main webview, served by the Rust core on `127.0.0.1` | Works the same way in any shell. Isolates generated code on a separate origin. "Open in browser" comes for free | Every `postMessage` has to be checked. External sites often refuse to be framed | [Architecture overview](../architecture/overview.md#preview-and-element-picker-planned) | Selected |
| A second native child webview (`Window::add_child`) | Native isolation | Tauri 2.12 still gates child webviews behind its `unstable` feature | Tauri 2.12 | Rejected |

## Decision

Show the preview in an iframe whose pages the Rust core serves on `127.0.0.1`, on a random port, under a random path prefix, with `picker.js` injected into every HTML page.

## Consequences and mitigations

- Positive consequences: the page runs on its own origin (`http://127.0.0.1:<port>`), so its scripts can't reach the app, its IPC or any token. Relative URLs, `fetch` and modules work as on a real site.
- Costs and constraints introduced: both sides of the picker messaging check who sent each message.
- Failure or reversal risks: we may need to show arbitrary external sites, and many refuse to be framed.
- Mitigations and owners: keep the picker protocol small and checked on both sides (project owner).
- Revisit conditions: we need the preview to show arbitrary external sites, or Tauri stabilizes child webviews.

## Implementation and evidence

- Design: [architecture overview](../architecture/overview.md#preview-and-element-picker-planned).
- Code: planned in `apps/desktop/preview-runtime/` and the Rust core. Verification: NOT RUN.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
