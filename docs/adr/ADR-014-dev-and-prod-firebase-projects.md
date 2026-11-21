# ADR-014: Separate Firebase projects for dev and prod

| Field | Value |
|---|---|
| Document ID | ADR-014 |
| Product or service | Tempercraft: backend environments (Firebase Auth, Firestore, Cloud Functions, Hosting, secrets) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-012](ADR-012-firebase-blaze-plan.md), [ADR-015](ADR-015-website-hosting-and-urls.md), [ADR-013](ADR-013-transactional-email-resend.md), [architecture overview](../architecture/overview.md), [developer guide](../engineering/developer-guide.md) |

## Decision identity

- ADR number and title: ADR-014, Separate Firebase projects for dev and prod
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

- **Need:** separate dev and prod backends, so testing never touches real users or data.
- **Before this decision** (checked on 2026-11-21 with the Firebase CLI, `gcloud`, and the Firebase Rules and Firestore APIs):
  - There's one Firebase project, `tempercraft`, on Blaze ([ADR-012](ADR-012-firebase-blaze-plan.md)).
  - Its only Firestore database is a named one, `development`, in `australia-southeast1`, created on 2026-11-21. It holds no collections, and there's no `(default)` database.
  - The `development` database has test-mode rules: anyone can read, write and delete all of its data until 2026-12-21.
  - No web app is registered, so no Firebase web config exists yet. The project's default Hosting site is `tempercraft.web.app`.
- **Firebase's guidance:** "Firebase recommends using a separate Firebase project for each environment." Every app registered to a project shares all of its backends: Hosting, Auth, Firestore, Storage and Functions.
- **Several databases in one project:** a project can have up to 100 Firestore databases, and Firestore's docs list production and testing environments as one use. But only one database per project gets the free quota, the first one created, which here is `development`. A prod `(default)` database added to this project would be billed from its first read.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Separate projects: `tempercraft` for prod and a new `tempercraft-dev` for dev, plus the emulators for local work | Firebase's recommendation. Users, data, functions, secrets, rules, hosting and quotas are all isolated. Each project's first database gets its own free quota. Changes go to dev first and to prod only on purpose | Setup happens twice: in each project, the Google provider, a Desktop OAuth client, a registered web app, secrets and a Blaze billing link | [Firebase: general best practices](https://firebase.google.com/docs/projects/dev-workflows/general-best-practices) | Selected |
| One project with two databases: `(default)` for prod and `development` for dev | One project, and the dev database already exists | Auth is per project, so dev test accounts would sit in the production user pool. Functions, secrets, hosting and Storage are shared, so a dev deploy can break prod. The prod database would get no free quota | [Firestore: manage databases](https://firebase.google.com/docs/firestore/manage-databases), [Firestore pricing](https://firebase.google.com/docs/firestore/pricing) | Rejected |
| One prod project, with the emulators as the only dev backend | No dev cloud costs | Can't test real Google sign-in, real invite emails, the hosted dev site, or builds shared with testers | [Firebase: demo projects](https://firebase.google.com/docs/emulator-suite/install_and_configure) | Rejected as the only dev backend; kept for local work |

## Decision

Accepted by the project owner on 2026-11-21.

| Environment | Firebase project | Selected by | Used for |
|---|---|---|---|
| Local | `demo-tempercraft`, emulators only | `npm run dev:local` and `npm run emulators` | Offline work and rules tests. A `demo-` project has no real resources, so nothing local can reach the cloud by accident |
| Dev | `tempercraft-dev` (new) | `npm run dev`, and dev builds for testers | Day-to-day development, testers and the dev website |
| Prod | `tempercraft` (existing) | Release builds (`npm run build`) | Real users |

- **Both cloud projects:** Blaze on the same billing account, a `(default)` Firestore database in `australia-southeast1`, and Cloud Functions in `australia-southeast1`, next to the data.
- **Same code in both:** `firebase/firestore.rules`, the indexes and the functions deploy to dev first, then to prod, from the same commit.
- **The API URL follows from the Firebase config.** We don't choose an API URL.
  - The app's code holds both projects' web configs and picks one by Vite mode: `vite` and `vite build --mode dev` use dev, and `vite build` uses prod. The web config isn't a secret, so both can live in the repo.
  - The Firebase SDK then talks to that project's Auth, Firestore and callable functions. For example, the invite function is `https://australia-southeast1-tempercraft-dev.cloudfunctions.net/sendInvite` in dev and `https://australia-southeast1-tempercraft.cloudfunctions.net/sendInvite` in prod.
  - The website's HTTP endpoints live under each site's own domain at `/api/` ([ADR-015](ADR-015-website-hosting-and-urls.md)).
- **Firebase CLI aliases:** in `.firebaserc`, `default` and `dev` point at `tempercraft-dev`, and `prod` points at `tempercraft`. A bare `firebase deploy` can never reach prod; prod needs `--project prod`.
- **Functions configuration:** per-project values, such as the site URL used in invite links, go in `functions/.env.dev` and `functions/.env.prod`. Secrets such as `RESEND_API_KEY` are set in each project separately.
- **Dev builds of the app** are a separate app called "Tempercraft Dev", with identifier `app.tempercraft.desktop.dev`. They're built with `tauri build --config src-tauri/tauri.dev.conf.json`, and `npm run dev` uses the same overrides. They install next to the real app and keep their own app data and Keychain entries.
- **Email:** one Resend account with a separate sending-only key per project ([ADR-013](ADR-013-transactional-email-resend.md)). Dev sends only to an allowlist of addresses, so testing never emails real people. Both environments share the free plan's 100 emails a day.
- **The `development` database** in `tempercraft` is replaced by the `(default)` database in `tempercraft-dev`. Deleting it frees the project's free-quota slot for prod's `(default)` database.

## Consequences and mitigations

- Positive consequences: dev can't affect real users or data; prod deploys are deliberate; each project's Firestore starts inside its own free quota.
- Costs and constraints introduced: two projects to configure and keep in step; two sets of secrets; testers' builds are a separate app.
- Failure or reversal risks: drift between the projects (rules, indexes, Auth settings, secrets), and deploying to the wrong project.
- Mitigations and owners (project owner):
  - Rules, indexes and functions live in the repo and deploy to both projects from the same commit.
  - The default alias is dev.
  - A budget alert on the shared billing account covers both projects.
- Revisit conditions: a separate staging environment becomes necessary, for example with more maintainers or paying users; or Firebase changes its guidance.

## Implementation and evidence

State on 2026-11-21:

| Step | State |
|---|---|
| 1. Delete the `development` database in `tempercraft` | Done. It was empty, and was deleted at the owner's request. `tempercraft` has no Firestore database now |
| 2. Create `tempercraft-dev` and link it to the billing account | Done. Created in the `tempercraft.app` organization as "Tempercraft Dev", and linked to the same billing account as `tempercraft` (billing enabled) |
| 3a. Dev: the `(default)` Firestore database in `australia-southeast1`, the repo's rules and indexes, a registered web app | Done. The deny-all rules are deployed; an unauthenticated read returns 403. The web app "Tempercraft" is registered. The default Hosting site is `tempercraft-dev.web.app` |
| 3b. Dev: turn on Google sign-in and create a Desktop OAuth client | NOT RUN. These are Firebase and Google Cloud console steps |
| 3c. Prod: the `(default)` database, a web app, Google sign-in and a Desktop OAuth client | NOT RUN. Do this when the app first needs prod; the next database created in `tempercraft` gets its free quota |
| 4. `.firebaserc` aliases and `npm run emulators` on `demo-tempercraft` | Done. The CLI's active project is dev |
| 4b. `functions` and `hosting` entries in `firebase.json` | NOT RUN. Wait for the first function and the site |
| 5. Add the per-environment Firebase config to the app, and `src-tauri/tauri.dev.conf.json` | NOT RUN |

Sources for the build mechanics: [Firebase: environment configuration for functions](https://firebase.google.com/docs/functions/config-env) and [Tauri CLI `--config`](https://v2.tauri.app/reference/cli/).

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
