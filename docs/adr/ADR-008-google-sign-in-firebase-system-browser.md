# ADR-008: Accounts use Google sign-in through Firebase Auth, in the system browser

| Field | Value |
|---|---|
| Document ID | ADR-008 |
| Product or service | Tempercraft: user accounts |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 2 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [Authentication and session design](../architecture/authentication.md), [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md), [register gaps](../README.md#gaps-and-actions) |

## Decision identity

- ADR number and title: ADR-008, Accounts use Google sign-in through Firebase Auth, in the system browser
- Decision status: Accepted, with one open point (see Consequences)
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

The owner wants Tempercraft accounts with Google sign-in, and Firebase Auth is free at our scale. Google blocks OAuth inside embedded webviews, so Firebase's `signInWithPopup` and `signInWithRedirect` can't work in Tauri.

## Options considered

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Firebase Auth with Google, signed in through the system browser and handed over with `signInWithCredential` | Works despite Google's block on embedded webviews | A loopback OAuth helper in the Rust core, and an OAuth client of type Desktop app | [Google: OAuth 2.0 for desktop apps](https://developers.google.com/identity/protocols/oauth2/native-app) | Selected: the owner's call |
| `signInWithPopup` or `signInWithRedirect` inside the webview | The least code | Google blocks OAuth inside embedded webviews | Same source | Rejected: doesn't work |
| Sign in with ChatGPT as the only login | One sign-in. It already returns a verified identity (`openid profile email`), and every user has to connect ChatGPT anyway | No Tempercraft account for backend features of our own | [ADR-004](ADR-004-model-access-sign-in-with-chatgpt.md) | Open |

## Decision

Tempercraft accounts use Google sign-in through Firebase Auth. The app runs the OAuth flow in the system browser, then calls `signInWithCredential(auth, GoogleAuthProvider.credential(idToken))`. The steps are in the [authentication design](../architecture/authentication.md#federation-and-account-linking).

## Consequences and mitigations

- Positive consequences: one free account system, with Firebase's session in the webview.
- Costs and constraints introduced: a Rust OAuth helper that both sign-ins share.
- Failure or reversal risks: Google sign-in may turn out to be unnecessary. It's only worth keeping if we add backend features of our own. The invite-only teams in [DEC-001](../product/decisions.md#decisions) and the [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md) are such features, which favours keeping it, but the owner hasn't closed the question.
- Mitigations and owners: the owner decides before sign-in is built ([register gaps](../README.md#gaps-and-actions)).
- Revisit conditions: the owner drops Google sign-in in favour of Sign in with ChatGPT only.

## Implementation and evidence

- Design: [authentication and session design](../architecture/authentication.md).
- Setup still to do, in `tempercraft-dev` first and then `tempercraft` ([ADR-014](ADR-014-dev-and-prod-firebase-projects.md)): create the Desktop app OAuth client and turn on the Google provider in Firebase Auth. Verification: NOT RUN.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
