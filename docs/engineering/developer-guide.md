# Developer guide

| Field | Value |
|---|---|
| Document ID | DEV-001 |
| Product or service | Tempercraft repository: local development of the desktop app, agent and Firebase config |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 8 |
| Last reviewed | 2026-11-21 |
| Review trigger | When setup, tools, architecture, commands, or troubleshooting steps change |
| Related work | [Architecture overview](../architecture/overview.md), [Solid 2.0 standards](solid-2-standards.md), [ADR-011](../adr/ADR-011-monorepo-npm-workspaces.md), [document register](../README.md) |

## Product and code orientation

Tempercraft is a free, open-source macOS app for designing web pages by chatting with an AI agent. The repository is one npm workspace monorepo ([ADR-011](../adr/ADR-011-monorepo-npm-workspaces.md)):

| Path | What it is |
| --- | --- |
| `apps/desktop/` | The Tauri 2 app, npm workspace `@tempercraft/desktop`. The Solid 2.0 UI is in `src/` and the Rust core in `src-tauri/` |
| `packages/agent/` | The design agent, npm workspace `@tempercraft/agent` |
| `firebase/` | Firestore and Storage rules and indexes. `firebase.json` and `.firebaserc` stay at the root |
| `docs/` | This documentation: `product/`, `user-journeys/`, `architecture/`, `engineering/` and `adr/`, indexed by the [document register](../README.md) |

The full tree and the reasons for it are in the [architecture overview](../architecture/overview.md#repository-layout). The project owner owns all of it.

## Prerequisites and access

This is what the repo was set up with on 2026-11-21:

| Requirement | Supported version or source | Installation or access request | Verification |
|---|---|---|---|
| macOS with Xcode Command Line Tools | macOS 27 | `xcode-select --install`. Full Xcode isn't needed for macOS builds | `xcode-select -p` |
| Rust | 1.100 (Homebrew `rust`) | `brew install rust`. Universal builds need rustup instead; see [before the first release](#before-the-first-release) | `rustc --version` |
| Node.js | 26.13 via nvm; 22 or later works. Comes with npm 11 | nvm | `node --version` |
| Firebase CLI | 15.37 | `brew install firebase-cli`. Only needed for the emulators and for deploying rules | `firebase --version` |
| Java | OpenJDK 27 (Homebrew), on `PATH` | `brew install openjdk`. Only needed for the Firebase emulators | `java -version` |
| Firebase project access | Projects `tempercraft-dev` and `tempercraft` | Ask the project owner. Needed to deploy rules, and later functions and the website | `firebase use` shows `tempercraft-dev` |
| OpenAI API key | The developer's own key | Only needed to run the agent evals ([agent design](../architecture/agent.md#cost)) | — |

## First successful run

Run these from the repo root:

| Step | Command or action | Working directory or environment | Expected result | Troubleshooting |
|---|---|---|---|---|
| 1 | Clone the repository | — | A checkout with `apps/`, `packages/`, `firebase/` and `docs/` | — |
| 2 | `npm install` | Repo root | Installs every workspace, with one lockfile at the root | — |
| 3 | `npm run dev` | Repo root | `tauri dev` runs Vite on `localhost:1420` plus the Rust core, and the app window opens with hot reload. The first Rust build takes about a minute; later builds are incremental | [Common problems](#common-problems-and-ownership) |
| 4 (optional) | `npm run emulators` | Repo root; needs Java | Firebase emulators for the `demo-tempercraft` project: Auth on 9099, Firestore on 8080, Storage on 9199, UI on 4000 | [Common problems](#common-problems-and-ownership) |

No credentials are needed for these steps. The Firebase web config isn't a secret ([architecture overview](../architecture/overview.md#environments-delivery-and-observability)).

## Daily workflow

- **Workspaces:** `apps/desktop` is `@tempercraft/desktop` and `packages/agent` is `@tempercraft/agent`. Add a dependency with `npm install <pkg> -w @tempercraft/desktop`.
- **Solid libraries:**
  - Before adding one, run `npm view <pkg> peerDependencies`. It must accept `solid-js` 2.
  - After installing, `npm ls solid-js` must still show a single version.
  - See [ecosystem readiness](solid-2-standards.md#ecosystem-readiness-npm-2026-11-21).
- **UI code:** follow the [Solid 2.0 standards](solid-2-standards.md).
- **Rust crates** go in `apps/desktop/src-tauri/Cargo.toml`.
- **Updates:** `package-lock.json` and `Cargo.lock` pin exact versions. Update Solid on purpose, because it's shipping patches every few days right now.
- **Firebase:**
  - `firebase.json` and `.firebaserc` stay at the root, and the rules and indexes live in `firebase/`. The CLI finds `firebase.json` from any subfolder.
  - There are two projects, both on Blaze ([ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md)): `tempercraft-dev` (alias `dev`, also the default) and `tempercraft` (alias `prod`). `firebase deploy` goes to dev; deploy to prod with `--project prod`. `firebase use` shows the active project.
  - The emulators run as `demo-tempercraft`, a demo project with no cloud resources, so local work can't touch dev or prod.
- **Docs:** update the affected documents with each change, and list new ones in the [document register](../README.md).
- **Work items:** stories, tasks and bugs live in Linear ([DEC-012](../product/decisions.md#decisions)), and the `linear` MCP server gives Claude Code access to them.

Current versions (2026-11-21):

| Package | Version |
| --- | --- |
| `solid-js`, `@solidjs/web` | 2.0.3 |
| `@solidjs/vite-plugin` | 3.0.1 (compiler 2.0.2) |
| `vite` | 8.3.8 |
| `typescript` | 6.0.3 |
| `@tauri-apps/cli`, `@tauri-apps/api` | 2.12.6, 2.12.5 |
| `tauri` crate | 2.12.7 |
| `@tauri-apps/plugin-opener` and its crate | 2.7.3 |

## Verification commands

Run these from the repo root:

| Check | Command | Scope and prerequisites | Expected result |
|---|---|---|---|
| Type-check | `npm run typecheck` | Every workspace | No errors |
| Release build | `npm run build` | The release app bundle (`tauri build`) | A built `.app` |
| UI build only | `npm run build -w @tempercraft/desktop` | The UI, into `apps/desktop/dist` | A built `dist/` |
| Other Tauri CLI commands | `npm run tauri -w @tempercraft/desktop -- <args>` | For example `-- info`, or `-- icon path/to/icon.png` | The command's output |
| Firebase emulators | `npm run emulators` | Needs Java | Emulators listening on the ports in [first successful run](#first-successful-run) |
| Single Solid version | `npm ls solid-js` | After any dependency change | One version |
| Active Firebase project | `firebase use` | Before any `firebase deploy` | `tempercraft-dev` |

## Common problems and ownership

- **Storage emulator warning:** with Java 27, the Storage emulator prints a `sun.misc.Unsafe` warning that you can ignore. If a future JDK breaks the emulators, install `openjdk@21`.
- **Homebrew's `rust` can't add compile targets,** so universal builds need rustup ([before the first release](#before-the-first-release)).
- **"Multiple Solid instances" in the dev console** means a 1.x-only library pulled in a second copy of Solid ([Solid 2.0 standards](solid-2-standards.md#standards-register)).
- **Ownership:** the project owner keeps this guide current. Update it whenever setup or commands change.

## Onboarding verification

- The repo was set up on 2026-11-21 on macOS 27 with the tool versions above.
- That day, `npm run typecheck` passed, `vite build` succeeded and the full `tauri build` pipeline compiled ([Solid 2.0 standards](solid-2-standards.md#review-and-evidence)).
- Following this guide from a clean machine: NOT RUN.

## Working with engineering agents

- **Repository instructions:** there's no `AGENTS.md` or `CLAUDE.md` yet.
- **Solid skills:** Solid 2.0 ships agent skills in `node_modules/solid-js/skills/`. Link them into `.claude/skills/` so Claude Code uses them. The instructions are in the [Solid 2.0 standards](solid-2-standards.md#standards-consumed-by-agents). Status: not linked yet.
- **Agents' tasks** use the commands in [verification commands](#verification-commands) to check their work. The presence of an instruction file doesn't prove a tool reads it.
- **MCP servers:** `.mcp.json` at the repo root gives Claude Code four remote servers:

  | Server | URL | What it reaches |
  | --- | --- | --- |
  | `linear` | `https://mcp.linear.app/mcp` | Your Linear workspace |
  | `sentry` | `https://mcp.sentry.dev/mcp` | Your Sentry organizations |
  | `resend` | `https://mcp.resend.com/mcp` | Your Resend account, including sending email and managing domains |
  | `cloudflare` | `https://mcp.cloudflare.com/mcp` | Your Cloudflare account, where tempercraft.app's DNS lives |

  - **Setup:** each developer approves the servers once, when Claude Code first asks, and then signs in to each service with OAuth by running `/mcp`.
  - **No secrets:** the file holds no keys. Keep it that way, because the repo will be public.
  - **Narrower Sentry access:** change the URL to `https://mcp.sentry.dev/mcp/{organizationSlug}/{projectSlug}` once the Sentry project exists.
  - **Check:** `claude mcp list` shows each server's status. On 2026-11-21 all three servers then in the file showed "Pending approval" until first use.

## Daily collaboration and Git recipes

N/A for now. There's one maintainer, no branching or review policy, and no CI. Add a contribution guide when a second contributor joins.

## Before the first release

- **Universal builds:** Homebrew's `rust` can't add compile targets. To ship one app for both Apple Silicon and Intel Macs:
  1. Switch to rustup: `brew install rustup`, then `rustup-init`.
  2. Add the targets: `rustup target add x86_64-apple-darwin aarch64-apple-darwin`.
  3. Build with `npm run build -- --target universal-apple-darwin`.
- **Signing and notarization:** macOS warns about, or blocks, downloaded apps that aren't signed with a Developer ID and notarized. Both need an Apple Developer Program membership, which costs US$99 a year. Once the certificate and credentials are set up, Tauri's build can sign and notarize.
- **Updates:** add Tauri's updater plugin.
- **CSP:** replace the template's `"csp": null` (see the [security rules](../architecture/overview.md#security-rules)).
- **License:** the Apache License 2.0 is in place ([DEC-018](../product/decisions.md#decisions)). Before making the repository public, turn on GitHub's private vulnerability reporting ([VDP-001](../policies/vulnerability-disclosure-policy.md)).

## Completion check

- [ ] A developer can reach a working local instance using the documented steps.
- [x] Commands include context, prerequisites, and expected results.
- [ ] The guide links to architecture, contribution, and delivery documentation.
