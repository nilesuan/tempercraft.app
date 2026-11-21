# User journey: download and install the app

| Field | Value |
|---|---|
| Document ID | JOURNEY-004 |
| Product or service | Tempercraft: the website's landing and download pages, and the macOS installer |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 3 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (end to end); previous: [JOURNEY-003](JOURNEY-003-accept-invite.md); next: [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md); [ADR-015](../adr/ADR-015-website-hosting-and-urls.md); [before the first release](../engineering/developer-guide.md#before-the-first-release) |

## Journey context

- Journey ID and name: JOURNEY-004, download and install the app
- User segment and goal: invited owners, managers and members, and anyone else who visits tempercraft.app. They want Tempercraft installed on their Mac.
- Current or proposed journey: proposed. No website or installer exists yet.
- Trigger and completion condition: it starts on the landing page, or on the download page after accepting an invite. It's complete when Tempercraft opens from Applications.
- Preconditions and permissions: a Mac. The download is public, because the invite check happens at sign-in ([JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md)).
- Evidence or design sources: the owner's working notes; [ADR-015](../adr/ADR-015-website-hosting-and-urls.md).

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Goes to tempercraft.app | Landing page | Explains Tempercraft, including that it runs on the visitor's ChatGPT plan | — | — | Owner's notes; [authentication design](../architecture/authentication.md#abuse-and-usability) |
| 2 | Scrolls down to the download section | Landing page | Shows a Download for macOS button | — | — | Owner's notes |
| 3 | Clicks Download | `/download` | Downloads the disk image | Installer (`.dmg`) | A slow download | Owner's notes; [ADR-015](../adr/ADR-015-website-hosting-and-urls.md) |
| 4 | Opens the disk image | Finder | Shows the app next to a shortcut to Applications | — | — | Owner's notes |
| 5 | Drags Tempercraft to Applications | Finder | Copies the app | — | — | Owner's notes |
| 6 | Opens Tempercraft | Applications or Launchpad | macOS checks the app's signature and notarization, then opens it on the welcome screen | — | macOS blocks apps that aren't signed with a Developer ID and notarized | Proposed |

## Alternate paths

- **Unsigned build:** macOS refuses to open it. Signing and notarization need an Apple Developer Program membership (US$99 a year) and must be done before anyone outside the team installs the app ([before the first release](../engineering/developer-guide.md#before-the-first-release)).
- **Intel Mac:** needs a universal build, covered in the same section.
- **Older macOS:** the minimum supported version isn't set.
- **Not a Mac:** the page says Tempercraft is for macOS, and that Windows and Linux may come later.
- **Dev builds:** testers get "Tempercraft Dev" from `dev.tempercraft.app/download`, and it installs next to the real app ([ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md)).
- **Updates:** a newer version replaces the app. Tauri's updater plugin isn't added yet.
- **Already installed:** the download page also offers Open Tempercraft, which uses the `tempercraft://` link. The browser asks before opening the app ([ADR-018](../adr/ADR-018-open-app-from-browser.md)).

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 3. Download | None yet | Downloads per week | Hosting logs (proposed) | Project owner |
| 6. First open | None yet | Installs that reach the welcome screen | Not decided; no analytics yet | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. What's the minimum macOS version?
  2. What goes on the landing page besides the ChatGPT plan statement?
  3. Should the download page say that sign-up is invite-only?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
