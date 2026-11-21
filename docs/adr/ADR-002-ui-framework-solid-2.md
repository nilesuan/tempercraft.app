# ADR-002: UI framework is Solid 2.0

| Field | Value |
|---|---|
| Document ID | ADR-002 |
| Product or service | Tempercraft desktop app: user interface (`apps/desktop/src/`) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Solid 2.0 engineering standards](../engineering/solid-2-standards.md), [ADR-001](ADR-001-desktop-shell-tauri-2.md), [developer guide](../engineering/developer-guide.md) |

## Decision identity

- ADR number and title: ADR-002, UI framework is Solid 2.0
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21. React was recommended first; the owner chose Solid 2.0 instead.
- Supersedes or superseded by: N/A

## Context

The UI streams model replies into a chat, token by token, next to a live preview, inside a system webview ([ADR-001](ADR-001-desktop-shell-tauri-2.md)). It needs cheap fine-grained updates and a small runtime.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Solid 2.0 | Fine-grained updates: a streamed token touches one text node instead of re-rendering the message. A small runtime: the current UI bundle is 30 KB, 12.6 KB gzipped. Async is built into the reactive core. There's an official AI-chat streaming example | 2.0.0 shipped on 2026-11-17, so parts of the ecosystem still support only 1.x, and AI coding tools default to 1.x patterns | [Solid 2.0 engineering standards](../engineering/solid-2-standards.md) | Selected |
| React | A bigger ecosystem | Heavier, and it re-renders on every token unless carefully memoized | — | Rejected |
| Solid 1.x | A mature ecosystem | Superseded, so we'd have to migrate within months | — | Rejected |

## Decision

Write the UI in Solid 2.0 (`solid-js` 2.0.3 on 2026-11-21), built with `@solidjs/vite-plugin` on Vite 8, following the [Solid 2.0 engineering standards](../engineering/solid-2-standards.md).

## Consequences and mitigations

- Positive consequences: streaming updates are cheap, and the bundle is small.
- Costs and constraints introduced: every Solid-specific library must support `solid-js` 2; there are no devtools for 2.0 yet; AI coding tools need Solid's bundled skills to avoid 1.x patterns.
- Failure or reversal risks: patches are landing fast (2.0.0 to 2.0.3 within days), and a library we need may stay 1.x-only.
- Mitigations and owners: the lockfile pins exact versions; prefer framework-agnostic libraries; link Solid's agent skills (project owner; see the [standards](../engineering/solid-2-standards.md#standards-consumed-by-agents)).
- Revisit conditions: a library we can't do without stays 1.x-only.

## Implementation and evidence

- Code: `apps/desktop/src/`. The three settings that differ from a 1.x project are listed in the [standards](../engineering/solid-2-standards.md#scope-and-authority).
- Evidence (2026-11-21): one copy of each Solid package in `npm ls`, `npm run typecheck` passes, and `vite build` succeeds ([standards](../engineering/solid-2-standards.md#review-and-evidence)).

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
