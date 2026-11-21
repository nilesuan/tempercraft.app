# Tempercraft document register

| Field | Value |
|---|---|
| Document ID | REG-001 |
| Product or service | Tempercraft: free, open-source macOS app for designing web pages with an AI agent (whole product) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 23 |
| Last reviewed | 2026-11-21 |
| Review trigger | When a document, owner, scope, or authoritative location changes |
| Related work | [Decision log](product/decisions.md), [user journeys](user-journeys/JOURNEY-001-invite-to-dashboard.md), [architecture overview](architecture/overview.md), [developer guide](engineering/developer-guide.md) |

## Product and scope

- **Product:** Tempercraft is a free, open-source macOS app for designing web pages with an AI agent. Windows and Linux may follow.
  - **Chat and preview:** you chat on the left and watch a live preview of the generated HTML on the right.
  - **Element picker:** you can point at any element in the preview to ask for a change to it.
  - **Accounts:** you sign in with Google and connect your ChatGPT account.
  - **No server for model calls:** every model call goes straight from your Mac to OpenAI. A small Cloud Function sends invite emails through Resend ([ADR-013](adr/ADR-013-transactional-email-resend.md)).
- **Lifecycle stage (2026-11-21):** scaffolding. The Tauri 2 + Solid 2.0 shell builds and runs. The chat, preview, picker, sign-in, agent, invites and website aren't built yet. The first release will be invite-only ([DEC-001](product/decisions.md#decisions)).
- **Documentation coordinator:** project owner.
- **Shared terms and naming convention:**
  - Every document here follows the matching template from the owner's PDLC template library: a metadata table, the template's sections, and its completion check.
  - Folder layout:

    | Folder | Contents |
    | --- | --- |
    | `docs/` | This register; `SCRATCH.md` holds the owner's working notes and is kept out of git |
    | `product/` | Product decisions |
    | `user-journeys/` | User journeys, one file each, named `JOURNEY-NNN-short-name.md` |
    | `architecture/` | The architecture overview, the authentication design and the agent design |
    | `engineering/` | The developer guide and engineering standards |
    | `policies/` | Public policies: the privacy policy and the vulnerability disclosure policy. Their public text goes in `SECURITY.md` and on the website's `/privacy` page |
    | `adr/` | Architecture decision records, one file each, named `ADR-NNN-short-name.md` |
  - Document IDs:

    | Prefix | Document type |
    | --- | --- |
    | REG | Document register |
    | README | Repository README, at the repo root |
    | DEC | Product decisions |
    | JOURNEY | User journeys |
    | ARCH | Architecture overview |
    | AUTH | Authentication and session design |
    | DESIGN | Detailed technical design |
    | DEV | Developer guide |
    | STD | Engineering standards |
    | PRIV | Privacy policy and collection notices |
    | VDP | Vulnerability disclosure policy |
    | ADR | Architecture decisions |
  - Statuses: Draft for living documents; Proposed, Accepted, Rejected or Superseded for ADRs. NOT RUN marks a check with no evidence yet.
- **Access policy for sensitive documents:** the repository is public, since 2026-11-21, because the app is open source. Keep secrets, tokens, personal data and billing identifiers out of `docs/`. Secrets live in Secret Manager or the macOS Keychain.

## Register

| ID | Document or family | Authoritative location | Accountable owner | Status | Audience | Last reviewed | Next review |
|---|---|---|---|---|---|---|---|
| REG-001 | Document register | [README.md](README.md) | Project owner | Draft | Contributors | 2026-11-21 | When a document is added, moved or retired |
| README-001 | Repository README | [../README.md](../README.md) | Project owner | Draft | Contributors and visitors | 2026-11-21 | When setup, support or documentation locations change |
| DEC-LOG-001 | Decision log (product decisions) | [product/decisions.md](product/decisions.md) | Project owner | Draft | Contributors | 2026-11-21 | When a product decision is made or revisited |
| JOURNEY-001 | User journey: from invite to the first dashboard (end to end) | [user-journeys/JOURNEY-001-invite-to-dashboard.md](user-journeys/JOURNEY-001-invite-to-dashboard.md) | Project owner | Draft | Contributors | 2026-11-21 | When the invite flow is decided |
| JOURNEY-002 | User journey: a system admin invites a team owner | [user-journeys/JOURNEY-002-admin-invites-owner.md](user-journeys/JOURNEY-002-admin-invites-owner.md) | Project owner | Draft | Contributors | 2026-11-21 | When the invite flow is decided |
| JOURNEY-003 | User journey: accept an invite | [user-journeys/JOURNEY-003-accept-invite.md](user-journeys/JOURNEY-003-accept-invite.md) | Project owner | Draft | Contributors | 2026-11-21 | When the invite flow is decided |
| JOURNEY-004 | User journey: download and install the app | [user-journeys/JOURNEY-004-download-and-install.md](user-journeys/JOURNEY-004-download-and-install.md) | Project owner | Draft | Contributors | 2026-11-21 | When the website or installer changes |
| JOURNEY-005 | User journey: first sign-in and the invite check | [user-journeys/JOURNEY-005-sign-in-and-invite-check.md](user-journeys/JOURNEY-005-sign-in-and-invite-check.md) | Project owner | Draft | Contributors | 2026-11-21 | When sign-in or invite enforcement is decided |
| JOURNEY-006 | User journey: a team owner or manager sets up the team and invites people | [user-journeys/JOURNEY-006-owner-and-manager-onboarding.md](user-journeys/JOURNEY-006-owner-and-manager-onboarding.md) | Project owner | Draft | Contributors | 2026-11-21 | When onboarding or invite rules change |
| JOURNEY-007 | User journey: a team member connects ChatGPT | [user-journeys/JOURNEY-007-member-onboarding.md](user-journeys/JOURNEY-007-member-onboarding.md) | Project owner | Draft | Contributors | 2026-11-21 | When onboarding changes |
| JOURNEY-008 | User journey: return to the dashboard | [user-journeys/JOURNEY-008-dashboard.md](user-journeys/JOURNEY-008-dashboard.md) | Project owner | Draft | Contributors | 2026-11-21 | When session length is decided |
| JOURNEY-009 | User journey: an owner or manager changes someone's role | [user-journeys/JOURNEY-009-change-role.md](user-journeys/JOURNEY-009-change-role.md) | Project owner | Draft | Contributors | 2026-11-21 | When role rules change |
| JOURNEY-010 | User journey: an owner adds, verifies or removes an email domain | [user-journeys/JOURNEY-010-manage-domains.md](user-journeys/JOURNEY-010-manage-domains.md) | Project owner | Draft | Contributors | 2026-11-21 | When domain rules change |
| ARCH-001 | Architecture overview | [architecture/overview.md](architecture/overview.md) | Project owner | Draft | Contributors | 2026-11-21 | When boundaries, dependencies or infrastructure change |
| AUTH-001 | Authentication and session design | [architecture/authentication.md](architecture/authentication.md) | Project owner | Draft | Contributors | 2026-11-21 | When sign-in, linking or session rules change |
| DESIGN-AGENT-001 | Detailed technical design: the design agent | [architecture/agent.md](architecture/agent.md) | Project owner | Draft | Contributors | 2026-11-21 | When the agent's contract, tools or evals change |
| DEV-001 | Developer guide | [engineering/developer-guide.md](engineering/developer-guide.md) | Project owner | Draft | Contributors | 2026-11-21 | When setup or commands change |
| STD-SOLID-001 | Engineering standards: Solid 2.0 UI code | [engineering/solid-2-standards.md](engineering/solid-2-standards.md) | Project owner | Draft | Contributors and AI coding tools | 2026-11-21 | On every Solid update |
| PRIV-001 | Privacy policy and collection notices | [policies/privacy-policy.md](policies/privacy-policy.md) | Project owner | Draft | Contributors; the public extract is for users | 2026-11-21 | Before publication, and when processing changes |
| VDP-001 | Vulnerability disclosure policy; its public text is [SECURITY.md](../SECURITY.md) | [policies/vulnerability-disclosure-policy.md](policies/vulnerability-disclosure-policy.md) | Project owner | Draft | Contributors and security researchers | 2026-11-21 | When reporting channels or commitments change |
| ADR-001 | ADR: Desktop shell is Tauri 2 | [adr/ADR-001-desktop-shell-tauri-2.md](adr/ADR-001-desktop-shell-tauri-2.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-002 | ADR: UI framework is Solid 2.0 | [adr/ADR-002-ui-framework-solid-2.md](adr/ADR-002-ui-framework-solid-2.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-003 | ADR: Tempercraft is free and open source | [adr/ADR-003-free-and-open-source.md](adr/ADR-003-free-and-open-source.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-004 | ADR: Model access is Sign in with ChatGPT, called straight from the Mac | [adr/ADR-004-model-access-sign-in-with-chatgpt.md](adr/ADR-004-model-access-sign-in-with-chatgpt.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-005 | ADR: Our own agent, not Codex | [adr/ADR-005-own-agent-not-codex.md](adr/ADR-005-own-agent-not-codex.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-006 | ADR: The agent is a headless TypeScript package | [adr/ADR-006-headless-agent-package.md](adr/ADR-006-headless-agent-package.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-007 | ADR: Hardening with promptfoo, guarantees in code | [adr/ADR-007-promptfoo-hardening-code-guarantees.md](adr/ADR-007-promptfoo-hardening-code-guarantees.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-008 | ADR: Accounts use Google sign-in through Firebase Auth, in the system browser | [adr/ADR-008-google-sign-in-firebase-system-browser.md](adr/ADR-008-google-sign-in-firebase-system-browser.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions; one point is open |
| ADR-009 | ADR: Backend is Firebase on the free Spark plan, with no Cloud Functions | [adr/ADR-009-firebase-spark-no-cloud-functions.md](adr/ADR-009-firebase-spark-no-cloud-functions.md) | Project owner | Superseded by ADR-012 | Contributors | 2026-11-21 | None (history) |
| ADR-010 | ADR: The preview is an iframe served from 127.0.0.1 | [adr/ADR-010-preview-iframe-loopback.md](adr/ADR-010-preview-iframe-loopback.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-011 | ADR: One repo, npm workspaces, folders by what ships | [adr/ADR-011-monorepo-npm-workspaces.md](adr/ADR-011-monorepo-npm-workspaces.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-012 | ADR: Firebase on the Blaze plan, with Cloud Functions for server-side work | [adr/ADR-012-firebase-blaze-plan.md](adr/ADR-012-firebase-blaze-plan.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-013 | ADR: Send invite emails with Resend from a Cloud Function | [adr/ADR-013-transactional-email-resend.md](adr/ADR-013-transactional-email-resend.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-014 | ADR: Separate Firebase projects for dev and prod | [adr/ADR-014-dev-and-prod-firebase-projects.md](adr/ADR-014-dev-and-prod-firebase-projects.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-015 | ADR: Website on Firebase Hosting at tempercraft.app and dev.tempercraft.app | [adr/ADR-015-website-hosting-and-urls.md](adr/ADR-015-website-hosting-and-urls.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-016 | ADR: Sentry for errors, bugs and observability in the website and app | [adr/ADR-016-sentry-error-tracking.md](adr/ADR-016-sentry-error-tracking.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-017 | ADR: Google Analytics for the website and the app | [adr/ADR-017-google-analytics.md](adr/ADR-017-google-analytics.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-018 | ADR: Links in the browser open the app through a `tempercraft://` URL scheme | [adr/ADR-018-open-app-from-browser.md](adr/ADR-018-open-app-from-browser.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |
| ADR-019 | ADR: Block sign-up without an invite, using Firebase Authentication with Identity Platform | [adr/ADR-019-block-sign-up-without-invite.md](adr/ADR-019-block-sign-up-without-invite.md) | Project owner | Accepted | Contributors | 2026-11-21 | Its revisit conditions |

## Applicability and combinations

| Topic | Separate document, combined, or N/A | Location or rationale | Decision owner | Revisit trigger |
|---|---|---|---|---|
| Lifecycle status and next actions | Combined into this register | The [gaps](#gaps-and-actions) below are the single gap list; a separate status record would duplicate it at this size | Project owner | When work splits into parallel features |
| Product brief, PRD and roadmap | Not written yet | Product scope is in [product and scope](#product-and-scope), the [decision log](product/decisions.md) and the [user journeys](user-journeys/JOURNEY-001-invite-to-dashboard.md) | Project owner | Before building invites and teams |
| Authorization model (permissions per role) | Not written yet | The roles are in [DEC-003](product/decisions.md#decisions), role changes in [DEC-008 and DEC-009](product/decisions.md#decisions), and the tenant is the org ([DEC-006](product/decisions.md#decisions)). What each role may do, how org data is kept separate, and how email domains are enforced ([DEC-007 and DEC-010](product/decisions.md#decisions)) still need an authorization model | Project owner | Before building invites and teams |
| Data model | Not written yet | No data is stored yet. Orgs with their email domains, invites and projects will need one, partitioned by org ([DEC-006](product/decisions.md#decisions), [DEC-007](product/decisions.md#decisions), [DEC-010](product/decisions.md#decisions)) | Project owner | Before the first Firestore data |
| Environment, build and deployment guides | Combined into [DEV-001](engineering/developer-guide.md) | One developer and one local environment; release steps are in [before the first release](engineering/developer-guide.md#before-the-first-release) | Project owner | When a staging environment or CI is added |
| AI evaluation plan, AI red-team plan and prompt lifecycle | Combined into [DESIGN-AGENT-001](architecture/agent.md#delivery-and-verification) | The evals don't exist yet and the plan is short | Project owner | When `packages/agent/evals/` exists, or before the first release |
| Security design and threat model | Combined into the [architecture security rules](architecture/overview.md#security-rules) and [AUTH-001](architecture/authentication.md) | Scaffold stage | Project owner | Before the first release |
| Owner's working notes (`docs/SCRATCH.md`) | N/A: informal notes, not a controlled document. Kept out of git with `.gitignore` while the owner edits them | Their stack, roles and journeys moved into the [decision log](product/decisions.md), the ADRs and [user-journeys/](user-journeys/JOURNEY-001-invite-to-dashboard.md), and the file was cleared on 2026-11-21 | Project owner | When the notes change |
| Work items: stories, tasks and bugs | In Linear, not in this repo | Linear is the authoritative location ([DEC-012](product/decisions.md#decisions)). These docs link to Linear issues rather than copying them | Project owner | If the team moves off Linear |
| Analytics tracking plan | Not written yet | Google Analytics is chosen ([ADR-017](adr/ADR-017-google-analytics.md)). The plan lists the events, their parameters and the consent rules | Project owner | Before any analytics ships |
| Privacy policy | Written as a draft: [PRIV-001](policies/privacy-policy.md) | It names Sentry and Google Analytics, and its public text will be published at `/privacy` on the website ([ADR-015](adr/ADR-015-website-hosting-and-urls.md)) | Project owner | Before the first invite |
| Consent and preferences specification | Not written yet | Needed for the analytics consent prompt in the app and the banner on the website ([ADR-017](adr/ADR-017-google-analytics.md)) | Project owner | Before any analytics ships |

## Gaps and actions

Ordered by when each item is due.

| Missing or outdated information | Impact | Required evidence | Owner | Due |
|---|---|---|---|---|
| **Blaze budget alert:** not confirmed | Pay-as-you-go spending has no alert. `tempercraft` and `tempercraft-dev` share one billing account | A budget alert in Cloud Billing on that account ([ADR-012](adr/ADR-012-firebase-blaze-plan.md)) | Project owner | Now |
| **Privacy policy and consent:** [PRIV-001](policies/privacy-policy.md) is drafted, and its owner decisions are made ([DEC-019](product/decisions.md#decisions)). It can't be published until three things are done: the consent prompt, banner and specification; checking each claim against the built product; and Resend's and Sentry's processing locations | Sentry and Google Analytics can't ship lawfully without them | The steps in [PRIV-001's review and publication section](policies/privacy-policy.md#review-and-publication) | Project owner | Before the first invite |
| **Sentry and Google Analytics setup:** no Sentry projects, GA4 properties or tracking plan exist | No error or usage data | The steps in [ADR-016](adr/ADR-016-sentry-error-tracking.md#implementation-and-evidence) and [ADR-017](adr/ADR-017-google-analytics.md#implementation-and-evidence) | Project owner | Before the first invite |
| **Is Google sign-in needed?** Sign in with ChatGPT already returns a verified identity, and every user has to connect ChatGPT. The invite-only teams in the [user journeys](user-journeys/JOURNEY-001-invite-to-dashboard.md) need a Tempercraft account and Firestore, which favours keeping Firebase Auth | Closes the open point in [ADR-008](adr/ADR-008-google-sign-in-firebase-system-browser.md) and sets the scope of [AUTH-001](architecture/authentication.md) | The owner's decision, recorded in ADR-008 | Project owner | Before building sign-in |
| **Google sign-in in `tempercraft-dev`:** the Google provider isn't turned on, there's no Desktop OAuth client yet, and Auth isn't upgraded to Identity Platform | Nobody can sign in against dev, and sign-ups can't be limited to invites | All three set up in the console ([ADR-014](adr/ADR-014-dev-and-prod-firebase-projects.md#implementation-and-evidence), [ADR-019](adr/ADR-019-block-sign-up-without-invite.md), [AUTH-001](architecture/authentication.md#google-sign-in-through-firebase-auth)) | Project owner | Before building sign-in |
| **Session length:** the owner's notes call for an ADR on how long sessions last | Whether people stay signed in until they sign out ([JOURNEY-008](user-journeys/JOURNEY-008-dashboard.md#validation-and-changes)) | An ADR | Project owner | Before building sign-in |
| **App environment wiring:** the per-environment Firebase config module and `src-tauri/tauri.dev.conf.json` don't exist | The app can't pick dev or prod yet | [ADR-014](adr/ADR-014-dev-and-prod-firebase-projects.md#implementation-and-evidence) step 5 | Project owner | Before the app uses Firebase |
| **Invite flow open questions:** invite expiry, and matching an invite to the person who signs in | Invite design, [AUTH-001](architecture/authentication.md), [ADR-013](adr/ADR-013-transactional-email-resend.md) | The owner's answers to the [open questions](user-journeys/JOURNEY-001-invite-to-dashboard.md#validation-and-changes) | Project owner | Before building invites |
| **Billing (later):** planned for after the first release ([DEC-005](product/decisions.md#decisions)). The team owner will own it ([DEC-003](product/decisions.md#decisions)) | Paid plans would trigger the revisit condition in [ADR-003](adr/ADR-003-free-and-open-source.md), and need OpenAI's interest form for ChatGPT plan usage ([ADR-004](adr/ADR-004-model-access-sign-in-with-chatgpt.md)) | The owner's decision on what, if anything, is paid, and when | Project owner | Before building anything billing-related |
| **Resend API keys:** the sending domain `mail.tempercraft.app` is verified in Resend (2026-11-21), but there's no sending-only API key in Secret Manager yet | Invites can't be sent | A `RESEND_API_KEY` secret in each project, with a separate key for each ([ADR-013](adr/ADR-013-transactional-email-resend.md#implementation-and-evidence), [ADR-014](adr/ADR-014-dev-and-prod-firebase-projects.md)) | Project owner | Before building invites |
| **Firestore and Storage:** nothing uses them yet, and both rules files deny everything. Orgs, invites and projects need Firestore, partitioned by org ([DEC-006](product/decisions.md#decisions)). Storage is available on Blaze, but is needed only for file storage | Data model and rules | A data model design | Project owner | Before building teams |
| **Website domains:** `tempercraft.app`, `www` and `dev` aren't connected to Hosting | No website at those addresses | [ADR-015](adr/ADR-015-website-hosting-and-urls.md#implementation-and-evidence) steps 1 to 3 | Project owner | Before the first invite |
| **API-key fallback:** should users without a ChatGPT plan be able to paste an OpenAI API key instead? | Scope of AUTH-001 and the agent | The owner's decision | Project owner | Before the first release |
| **Default model:** the available models come from each account's `GET /v1/models` list, but no default is picked | Agent defaults | The owner's decision, informed by evals | Project owner | Before the first release |
| **Prod setup:** `tempercraft` has no Firestore database, web app or Google sign-in yet | Release builds have no backend | Prod's half of [ADR-014](adr/ADR-014-dev-and-prod-firebase-projects.md#implementation-and-evidence) step 3 | Project owner | Before the first release |

## Lifecycle checkpoints

There's no separate lifecycle status record; this register holds the gap list.

- Discovery decision: 2026-11-21. The owner chose a free, open-source macOS app ([ADR-003](adr/ADR-003-free-and-open-source.md)) that runs on the user's own ChatGPT plan ([ADR-004](adr/ADR-004-model-access-sign-in-with-chatgpt.md)).
- Build scope agreed: not yet. There's no PRD; the [user journeys](user-journeys/JOURNEY-001-invite-to-dashboard.md) propose the first flows.
- Launch readiness: N/A; not started.
- Operational review: N/A; not launched.
- Retirement decision if applicable: N/A.

## Acquisition information when applicable

N/A. No acquisition is involved.

## Completion check

- [ ] Every applicable lifecycle area has an owner and an authoritative location.
- [x] Combined or inapplicable documents have a recorded rationale.
- [ ] Documentation gaps have owners and follow-up dates.
