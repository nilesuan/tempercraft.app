# ADR-018: Links in the browser open the app through a `tempercraft://` URL scheme

| Field | Value |
|---|---|
| Document ID | ADR-018 |
| Product or service | Tempercraft: the desktop app's URL scheme, and the website pages that link to it |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-001](ADR-001-desktop-shell-tauri-2.md) (Tauri), [ADR-014](ADR-014-dev-and-prod-firebase-projects.md) (the dev app), [ADR-015](ADR-015-website-hosting-and-urls.md) (website), [JOURNEY-003](../user-journeys/JOURNEY-003-accept-invite.md), [JOURNEY-004](../user-journeys/JOURNEY-004-download-and-install.md), [authentication design](../architecture/authentication.md) |

## Decision identity

- ADR number and title: ADR-018, Links in the browser open the app through a `tempercraft://` URL scheme
- Decision status: Accepted. The owner decided that links in the browser should open the app; the details under Decision are proposals.
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

- **Need:** a link on the website or in an email should open the desktop app. Examples:
  - "Open Tempercraft" after accepting an invite ([JOURNEY-003](../user-journeys/JOURNEY-003-accept-invite.md));
  - "Open Tempercraft" after installing it ([JOURNEY-004](../user-journeys/JOURNEY-004-download-and-install.md));
  - a link in a role-change email.
- **Firebase Dynamic Links, the "dynamic link" option, no longer exists.** Google shut it down on 2025-08-25.
- **What Tauri supports (checked on 2026-11-21):**
  - Tauri 2's deep-link plugin supports custom URL schemes on macOS. They're declared in the app's configuration, because macOS doesn't allow registering them while the app runs.
  - The plugin documents universal links, ordinary https links that open an app, only for iOS.
- **Constraints:**
  - Any app can claim the same custom scheme, so a scheme link must never carry a secret.
  - Sign-in already uses loopback redirects to `127.0.0.1`, not a scheme ([authentication design](../architecture/authentication.md)).

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| A custom scheme, `tempercraft://`, plus an https page on the website that hands off to it | Works on macOS today with Tauri's plugin. https links stay shareable, and fall back to the download page when the app isn't installed | The browser asks "Open Tempercraft?" first. Another app could claim the same scheme | [Tauri: deep linking](https://v2.tauri.app/plugin/deep-linking/) | Selected |
| Firebase Dynamic Links | — | Shut down on 2025-08-25 | [Dynamic Links FAQ](https://firebase.google.com/support/dynamic-links-faq) | Rejected |
| Universal links: https links that open the app directly | No prompt | Tauri documents them for iOS, not for macOS desktop apps | [Tauri: deep linking](https://v2.tauri.app/plugin/deep-linking/) | Not available now; revisit |
| A deep-link service such as Branch or AppsFlyer | Deferred deep links and link analytics | Costs money, and is aimed at mobile apps | — | Rejected |

## Decision

The owner decided that links in the browser open the app.

The details are proposed and need confirming:
- **Schemes:** `tempercraft://` for the release app, and `tempercraft-dev://` for the Tempercraft Dev app ([ADR-014](ADR-014-dev-and-prod-firebase-projects.md)). That way the two installs never fight over links. Each build declares its scheme in its Tauri configuration.
- **Links:** `tempercraft://open` opens the app. More links, such as one that opens a project, are added only when a journey needs them.
- **The website** gets an `https://tempercraft.app/open` page, which `dev.tempercraft.app` has too. The page tries the scheme, and shows the Download button if the app doesn't open, because a browser can't tell whether an app is installed.
- **Safety:**
  - The app treats every link as untrusted input. It checks the link against its known list, ignores anything else, and never does anything destructive without asking first.
  - Links never carry tokens or invite codes.

## Consequences and mitigations

- Positive consequences: one click from the site or an email opens the app, with no third-party service.
- Costs and constraints introduced:
  - The browser asks the user to confirm before opening the app.
  - Links only work with an installed build, so testing needs one too.
- Failure or reversal risks: another app claims the scheme; a malformed link reaches the app.
- Mitigations and owners (project owner): no secrets in links, and strict checking of every link.
- Revisit conditions: Tauri adds universal links for macOS, or Windows and Linux builds arrive. The plugin registers schemes at runtime on those platforms, and needs its single-instance companion.

## Implementation and evidence

All NOT RUN:
1. Add Tauri's deep-link plugin, with `tempercraft` in the main configuration and `tempercraft-dev` in `src-tauri/tauri.dev.conf.json`.
2. Handle `tempercraft://open` in the app. Test it with an installed build.
3. Add the `/open` page to the website, and an Open Tempercraft button to the accept and download pages.
4. Check whether macOS also needs the single-instance plugin. The plugin's docs differ on this.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
