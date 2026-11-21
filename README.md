# Tempercraft

| Field | Value |
|---|---|
| Document ID | README-001 |
| Product or service | Tempercraft: this repository (the desktop app, the design agent, the Firebase config and the docs) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When purpose, setup, support, or key documentation locations change |
| Related work | [Document register](docs/README.md), [developer guide](docs/engineering/developer-guide.md), [decision log](docs/product/decisions.md) |

## Product purpose and status

Tempercraft is a free, open-source macOS app for designing web pages by chatting with an AI agent. Windows and Linux may follow.

- **Chat and preview:** you chat on the left and see a live preview of the generated HTML on the right.
- **Element picker:** you can point at any element in the preview and ask for a change to it.
- **Your own ChatGPT plan:** once you connect your ChatGPT account, every model call goes straight from your Mac to OpenAI on that plan.

**Status (2026-11-21): early scaffolding.** The Tauri 2 + Solid 2.0 shell builds and runs. The chat, preview, picker, sign-in, agent, invites and website aren't built yet.

The first release will be invite-only for teams:
- A Tempercraft admin invites each team's owner.
- The owner invites managers and members.
- Everyone must have an email address at one of the team's domains.

See the [decision log](docs/product/decisions.md).

## Quick start

- **Supported tools and versions:**
  - macOS with the Xcode Command Line Tools, Rust, and Node 22 or later.
  - The Firebase CLI and Java, only for the local emulators.
  - Exact versions are in the [developer guide](docs/engineering/developer-guide.md#prerequisites-and-access).
- **Access prerequisites:** none to run the app locally. Deploying to Firebase needs access to the `tempercraft-dev` and `tempercraft` projects, from the project owner.
- **Setup:** run `npm install` from the repo root.
- **Start and verify:**
  - `npm run dev` opens the app window with hot reload.
  - `npm run typecheck` checks every workspace.
  - `npm run emulators` starts the Firebase emulators as the `demo-tempercraft` project, which has no cloud resources.
- **Stop or clean up:** Ctrl+C stops `npm run dev` and the emulators. Nothing keeps running in the background.

## Repository map

| Location | Purpose |
|---|---|
| `apps/desktop/` | The macOS app: Tauri 2, with the Solid 2.0 UI in `src/` and the Rust core in `src-tauri/` |
| `packages/agent/` | The design agent: instructions, tools and loop, in plain TypeScript |
| `firebase/` | Firestore and Storage rules and indexes |
| `firebase.json`, `.firebaserc` | Firebase CLI configuration. The `dev` alias, also the default, is `tempercraft-dev`; the `prod` alias is `tempercraft` |
| `docs/` | Product decisions, user journeys, architecture, engineering guides and ADRs, indexed by [docs/README.md](docs/README.md) |
| `.mcp.json` | MCP servers for Claude Code: Linear, Sentry, Resend and Cloudflare. They sign in with OAuth, so the file holds no keys |

## Documentation

| Topic | Authoritative location |
|---|---|
| Product requirements and roadmap | No PRD yet; the [decision log](docs/product/decisions.md) and the [user journeys](docs/user-journeys/JOURNEY-001-invite-to-dashboard.md) |
| Architecture and decisions | The [architecture overview](docs/architecture/overview.md), and the ADRs listed in the [document register](docs/README.md#register) |
| Development and contribution | The [developer guide](docs/engineering/developer-guide.md) and the [Solid 2.0 standards](docs/engineering/solid-2-standards.md) |
| Tests and deployment | [Verification commands](docs/engineering/developer-guide.md#verification-commands) and [before the first release](docs/engineering/developer-guide.md#before-the-first-release). There's no CI yet |
| Service ownership and runbooks | N/A: nothing runs in production yet |
| Customer or API documentation | N/A: not written yet |
| Work items | Linear ([DEC-012](docs/product/decisions.md#decisions)) |
| Open questions and gaps | The [register's gaps](docs/README.md#gaps-and-actions) |

## Support and contribution

- **Maintainer:** the project owner.
- **Contributions:** there's no contribution guide or review policy yet. Work is tracked in Linear.
- **Security reports:** there's no private channel for reporting security issues yet. Set one up before the repository is made public ([register gaps](docs/README.md#gaps-and-actions)).

## License and use

Not chosen yet. Until a license is added, nobody else can legally reuse the code ([ADR-003](docs/adr/ADR-003-free-and-open-source.md)).

## Completion check

- [x] Purpose, maturity, setup, and ownership are clear from the entry point.
- [x] Quick-start steps and documentation links work.
- [x] No unsupported support, availability, or licensing promises are introduced.
