# ADR-015: Website on Firebase Hosting at tempercraft.app and dev.tempercraft.app

| Field | Value |
|---|---|
| Document ID | ADR-015 |
| Product or service | Tempercraft: the tempercraft.app website (landing page, download, invite acceptance, privacy policy) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-014](ADR-014-dev-and-prod-firebase-projects.md), [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md), [ADR-013](ADR-013-transactional-email-resend.md), [architecture overview](../architecture/overview.md) |

## Decision identity

- ADR number and title: ADR-015, Website on Firebase Hosting at tempercraft.app and dev.tempercraft.app
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

- **What needs hosting:** the desktop app's UI is bundled into the app ([ADR-001](ADR-001-desktop-shell-tauri-2.md)) and isn't hosted anywhere. The hosted frontend is the website from the [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md):
  - the landing page and download (steps 3 to 5)
  - the page that confirms an accepted invite (step 2)
  - a privacy policy
  - OpenAI's request that the site say the app uses the visitor's ChatGPT plan ([authentication design](../architecture/authentication.md#abuse-and-usability))
- **Backend:** accepting an invite needs a backend call. [ADR-014](ADR-014-dev-and-prod-firebase-projects.md) puts backends in one Firebase project per environment.
- **What exists** (checked on 2026-11-21):
  - DNS is on Cloudflare, and tempercraft.app has no A record yet.
  - `tempercraft` already has its default Hosting site, `tempercraft.web.app`.
  - The GitHub repository is private.
- **Firebase Hosting on Blaze:**
  - 10 GB of storage and 10 GB a month of transfer at no cost, then $0.026 per GB stored and $0.15 per GB transferred.
  - Free SSL certificates for custom domains, up to 20 subdomains per apex domain.
  - Rewrites can route paths to Cloud Functions in any region.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Firebase Hosting, the default site of each environment's project | Same project as that environment's functions and Auth, so `/api/` rewrites reach the right backend with no CORS and no environment URLs in the site's code. Free SSL and preview channels | Static content only, which suits this site. Deploys through the Firebase CLI | [Hosting quotas and pricing](https://firebase.google.com/docs/hosting/usage-quotas-pricing), [rewrites to functions](https://firebase.google.com/docs/hosting/functions), [custom domains](https://firebase.google.com/docs/hosting/custom-domain) | Selected |
| Cloudflare Pages | DNS is already on Cloudflare; preview deployments per branch | A second platform to run. The site would call each environment's functions cross-origin, so it needs per-environment URLs and CORS | — | Rejected |
| Firebase App Hosting | Server-side rendering frameworks | Not needed for a static site; runs on Cloud Run | — | Rejected |
| Installers on GitHub Releases | The usual home for open-source desktop builds, and Tauri's updater can read them | Assets of a private repository aren't publicly downloadable | Repository visibility on 2026-11-21: private | Rejected until the repository is public |

## Decision

Accepted by the project owner on 2026-11-21.

| Environment | Hosting site | URL | Search engines |
|---|---|---|---|
| Prod | Default site of `tempercraft` | `https://tempercraft.app`, with `https://www.tempercraft.app` redirecting to it | Indexed |
| Dev | Default site of `tempercraft-dev` | `https://dev.tempercraft.app` | Not indexed: the dev build adds `noindex` |
| Previews | Preview channels in `tempercraft-dev` | Firebase-generated `*.web.app` URLs that expire on their own | Not indexed |
| Local | Hosting emulator | `http://127.0.0.1:5000` | — |

Every environment serves the same paths:

| Path | What it serves |
|---|---|
| `/` | Landing page, including the statement about ChatGPT plan usage |
| `/download` | The current installer for that environment: "Tempercraft" in prod, "Tempercraft Dev" in dev |
| `/invite/{token}` | Confirms the invite, then links to `/download` |
| `/privacy` | Privacy policy |
| `/api/**` | Rewritten to Cloud Functions in `australia-southeast1` |

- **Invite links:** invite emails link to `{site}/invite/{token}`. `{site}` comes from the function's per-project config: `https://tempercraft.app` in prod and `https://dev.tempercraft.app` in dev.
- **Installers:** they're served from each environment's Hosting site while the repository is private and the release is invite-only. Keep only the last few Hosting releases, so old installers don't build up storage.
- **DNS:** add the records Firebase shows for each custom domain in Cloudflare, as DNS only (not proxied), so Firebase can issue and renew the certificates.
- **Code:** the site lives in `apps/web/` ([repository layout](../architecture/overview.md#repository-layout)). Its framework isn't chosen yet.

## Consequences and mitigations

- Positive consequences:
  - Each site talks only to its own environment's functions, through the same paths.
  - It's free at this scale.
  - Invitees get one URL per environment.
- Costs and constraints introduced:
  - Custom-domain records in Cloudflare for `tempercraft.app`, `www` and `dev`.
  - Installers count against Hosting storage and transfer.
- Failure or reversal risks:
  - Download traffic could outgrow the free 10 GB a month.
  - The site might later need server-side rendering.
- Mitigations and owners (project owner):
  - Move installers to GitHub Releases once the repository is public, or when downloads approach the free transfer limit.
  - Keep the budget alert from [ADR-014](ADR-014-dev-and-prod-firebase-projects.md).
- Revisit conditions:
  - The repository becomes public.
  - Monthly downloads approach 10 GB.
  - The site needs server-side rendering.

## Implementation and evidence

Both default sites exist: `tempercraft.web.app` and `tempercraft-dev.web.app` (2026-11-21). The rest is NOT RUN:
1. Connect `tempercraft.app` and `www.tempercraft.app` to the prod site, and `dev.tempercraft.app` to the dev site. Add Firebase's records in Cloudflare as DNS only. This needs a deployed site first.
2. Create `apps/web/`, and add a `hosting` entry to `firebase.json` with the `/api/**` rewrite to functions in `australia-southeast1`.
3. Deploy to dev with `firebase deploy --only hosting`, and to prod with `--project prod`.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
