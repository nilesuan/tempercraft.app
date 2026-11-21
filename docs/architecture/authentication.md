# Authentication and session design

| Field | Value |
|---|---|
| Document ID | AUTH-001 |
| Product or service | Tempercraft desktop app: the Tempercraft account (Google through Firebase Auth) and the ChatGPT connection (Sign in with ChatGPT) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 14 |
| Last reviewed | 2026-11-21 |
| Review trigger | When identity providers, authenticators, linking, recovery, session rules, or assurance needs change |
| Related work | [ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md), [ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md), [architecture overview](overview.md), [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md) |

## Identity and threat scope

Tempercraft has two sign-ins, and both happen in the user's normal browser:

1. **Tempercraft account:** Google, through Firebase Auth ([ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md)).
2. **ChatGPT connection:** OpenAI's Sign in with ChatGPT with "ChatGPT plan usage", which lets the app call the model on the user's own ChatGPT plan ([ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md)).

Both use the same mechanism: open the system browser, then catch the redirect on `127.0.0.1`. One OAuth helper in the Rust core serves both. Status (2026-11-21): planned; nothing is built yet.

- **Identities:**
  - The Firebase user, from the Google account.
  - One OpenAI identity (the ID token's `sub`) per issued ChatGPT client ID.
  - One host ID per installation (see [host ID](#host-id)).
- **Relying services:** Firebase (Auth now; Firestore rules later) and the OpenAI API.
- **Trust boundaries:** OpenAI and Google tokens stay in the Rust core and the macOS Keychain. The webview holds only Firebase's own session.
- **Assurance:** no formal assurance level is claimed.
- **Authorization:** the roles are defined in [DEC-003](../product/decisions.md#decisions): system admin, team owner, team manager and team member. Each org, with its one team, is a tenant ([DEC-006](../product/decisions.md#decisions)). Everyone signs in to the same Firebase project, and access to an org's data depends on belonging to that org. Membership is limited to addresses at the org's email domains ([DEC-007](../product/decisions.md#decisions)). Domains are verified by DNS and belong to one org only, so each account belongs to at most one org ([DEC-010](../product/decisions.md#decisions)). The authorization model, meaning what each role may do in the app and the backend, isn't written yet ([register gaps](../README.md#gaps-and-actions)).

> **Open question:** Sign in with ChatGPT already returns a verified identity (`openid profile email`), and every user has to connect ChatGPT to use the app, so it could be the only login. See [ADR-008](../adr/ADR-008-google-sign-in-firebase-system-browser.md).

## Account and authenticator lifecycle

| Event | Identity evidence and permitted actor | Enforced checks | User notification | Failure and recovery |
|---|---|---|---|---|
| Sign up (first Google sign-in), only inside the app ([DEC-002](../product/decisions.md#decisions)) | The user's Google account | `state` and PKCE on the loopback callback; Firebase verifies the Google ID token; a `beforeUserCreated` blocking function refuses accounts without an invite ([ADR-019](../adr/ADR-019-block-sign-up-without-invite.md)) | None from Tempercraft | Retry the sign-in. Account recovery is Google's |
| Returning Google sign-in, or a restored session at launch | Firebase session | Firebase SDK session checks | None | If the session is no longer valid, sign in again |
| First ChatGPT connection (registration) | The user's ChatGPT account | `state`, `nonce` and PKCE; ID token validation; the granted scopes include `chatgpt.tokens.use.direct` | "You're using your ChatGPT plan" dialog, once | `access_denied` stops the flow; `invalid_grant` starts again |
| Returning ChatGPT sign-in | Saved issued client ID, host ID and retained ID token | As for registration | None | Start a new sign-in |
| Add another ChatGPT account | Another ChatGPT account | Separate registration per account | The active account is shown in settings | Accounts stay independent |
| Sign out of ChatGPT | The signed-in user | Revoke the refresh token | — | Keep the client ID and host ID for a later sign-in |
| Credentials compromised | The user | — | — | The user disconnects the app in ChatGPT's settings |
| Accept an invite *(planned)* | Not designed yet | Not designed yet | Invite email ([ADR-013](../adr/ADR-013-transactional-email-resend.md)) | Not designed yet |
| Change someone's role *(planned)* | An owner, who can give any role including owner, or a manager, who can change members and other managers to manager or member. Never their own role; always in the same org ([DEC-008 and DEC-009](../product/decisions.md#decisions)) | A server function checks the caller's role, the person's current role and the last-owner rule. Making someone an owner needs a Google sign-in within the last 5 minutes, checked against the sign-in time in the caller's Firebase ID token ([DEC-011](../product/decisions.md#decisions)) | An email to the person whose role changed, and to the other owners when someone becomes an owner. Sent from `notifications@mail.tempercraft.app` ([DEC-015](../product/decisions.md#decisions)) | The change is refused, with the reason. If the sign-in isn't recent, the app asks the owner to sign in with Google again |
| Pause the accounts at a removed domain *(planned)* | An owner removing one of the org's domains ([DEC-010](../product/decisions.md#decisions)) | A server function cancels the pending invites at that domain and pauses its accounts. The security rules and functions refuse paused accounts | An email to each paused person. In the app: "Account is paused, please contact your owner or team manager" ([DEC-013](../product/decisions.md#decisions)) | Verifying the domain again restores its paused accounts, and owners and managers can unpause someone ([DEC-015](../product/decisions.md#decisions)) |

Tempercraft has no passwords or factors of its own, so enrollment, factor replacement and account recovery belong to Google and OpenAI. Role changes are sensitive ([DEC-009](../product/decisions.md#decisions)). Making someone an owner needs a Google sign-in within the last 5 minutes ([DEC-011](../product/decisions.md#decisions)). If it's been longer, the app asks the owner to sign in with Google again before the change goes through.

## Federation and account linking

### Google sign-in through Firebase Auth

Firebase's `signInWithPopup` and `signInWithRedirect` don't work in Tauri, because Google blocks OAuth inside embedded webviews. Instead:

1. **Once per project:** in `tempercraft-dev` first, then `tempercraft` ([ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md)), create an OAuth client of type **Desktop app** in that Google Cloud project, and turn on the Google provider in its Firebase Auth.
2. **Rust:** start a listener on `127.0.0.1` on a free port, and generate a `state` value and a PKCE verifier.
3. **Rust:** open `https://accounts.google.com/o/oauth2/v2/auth` in the system browser with `tauri-plugin-opener`, passing:
   - `response_type=code`
   - `scope=openid email profile`
   - `redirect_uri=http://127.0.0.1:<port>`
   - `state`
   - `code_challenge` and `code_challenge_method=S256`
4. **Rust:** on the callback, check `state`, then exchange the code at `https://oauth2.googleapis.com/token`, sending the `code_verifier`. Desktop clients also send the client secret, which Google doesn't treat as confidential for installed apps.
5. **UI:** pass the `id_token` to Firebase: `signInWithCredential(auth, GoogleAuthProvider.credential(idToken))`.

During development, point the SDK at the Auth emulator: `connectAuthEmulator(auth, "http://127.0.0.1:9099")`.

### Sign in with ChatGPT (plan usage)

OpenAI documents this flow for "open-source and locally hosted apps", which describes Tempercraft. Paid or remotely hosted apps have to apply through OpenAI's interest form instead. The flow needs no client secret and no partner API key.

#### Host ID

Before the first sign-in, generate an `ext_agent_host_id` once per installation and keep it for the life of the install.
- **Format:** `urn:uuid:` followed by a UUIDv4, or a JWK-thumbprint URI per RFC 9278.
- **What it is:** an opaque identifier, not a secret. Never derive it from an email address or user ID.

#### First sign-in (registration)

1. Start a listener on `http://127.0.0.1:<port>/auth/callback`. Use `127.0.0.1`, not `localhost`. The port may change between sign-ins, but the path may not.
2. Generate a fresh `state`, `nonce` and PKCE verifier.
3. Open the system browser at `https://auth.openai.com/api/accounts/authorize` with these parameters:

   | Parameter | Value |
   | --- | --- |
   | `client_id` | `dynamic_agent_client` (first registration only) |
   | `agent_name_hint` | `Tempercraft` (first registration only; the same name on every install) |
   | `ext_agent_host_id` | The host ID |
   | `response_type` | `code` |
   | `redirect_uri` | `http://127.0.0.1:<port>/auth/callback` |
   | `scope` | `openid profile email offline_access resource.invoke chatgpt.tokens.use.direct` |
   | `resource` | `https://api.openai.com/v1` |
   | `state`, `nonce` | Fresh random values |
   | `code_challenge`, `code_challenge_method` | An S256 PKCE challenge |

4. The callback returns `code`, `state`, the issued `client_id` (`oaiapp_…`) and `scope`.
   - On `error=access_denied`, stop.
   - Save the issued `client_id`. Never save `dynamic_agent_client`.
5. POST a form-encoded `grant_type=authorization_code` request to `https://auth.openai.com/api/accounts/oauth/token`. Send:
   - the issued `client_id`
   - `code`
   - `code_verifier`
   - the same `redirect_uri` and `resource` as in step 3

   On `invalid_grant`, start again.
6. Validate the ID token:
   - its signature, against OpenAI's JWKS
   - issuer `https://auth.openai.com`
   - audience equal to the issued `client_id`
   - expiry
   - `nonce`

   Its `sub` is the account's identity.
7. Check that the granted scopes include `chatgpt.tokens.use.direct`. A valid ID token alone doesn't authorize plan usage.

#### Returning sign-ins and multiple accounts

- **Signing in again:**
  - Use the saved issued `client_id`, the same host ID, and a fresh `state`, `nonce` and PKCE verifier.
  - Leave out `agent_name_hint`.
  - Send the retained ID token as `id_token_hint`; it may already have expired. Optionally send the email as `login_hint`.
- **Multiple accounts:**
  - Keep each account's registration (issued client ID, identity, tokens) separate, even when two accounts share an email.
  - Never combine one registration's client ID with another's tokens.
  - Show the active account in settings.

### Account linking

- The Firebase user and the ChatGPT identities are separate accounts. Nothing merges them, and matching email text alone must never link them.
- **Invites:** an accepted invite has to be connected to the Firebase user who signs up ([user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md)). The rule for that isn't designed yet. It must rely on a verified identity, not on email text the user typed. The address must also be at one of the org's domains ([DEC-007](../product/decisions.md#decisions)), and the check uses the ID token's verified email.

## Session contract

| Session or credential | Issuer and audience | Storage and transport | Lifetime and renewal | Revocation and verification |
|---|---|---|---|---|
| Firebase session | Firebase Auth of the build's project (`tempercraft-dev` or `tempercraft`) | Kept by the Firebase JS SDK in the webview. That's fine, because it's the Firebase session, not an OpenAI token | Renewed by the Firebase SDK | Signing out, or revocation in Firebase |
| Google tokens from the desktop OAuth flow | Google; Tempercraft's Desktop OAuth client | Held by the Rust core. The ID token goes to the UI once, for `signInWithCredential` | Used at sign-in | — |
| OpenAI access token | `auth.openai.com`; resource `https://api.openai.com/v1` | Keychain; sent as a bearer token by the Rust core | 1 hour. Refreshed near expiry | Expires; ends at sign-out |
| OpenAI refresh token | `auth.openai.com`; the issued client ID | Keychain | 30 days, rotating: each refresh returns a replacement with a fresh 30 days | Revoked at sign-out |
| OpenAI ID token | `auth.openai.com`; audience is the issued client ID | Keychain | n/a | Kept only to send as `id_token_hint` |

- **Refresh** near expiry: send a form POST to the token endpoint with:
  - `grant_type=refresh_token`
  - the issued `client_id`
  - `refresh_token`
  - `resource=https://api.openai.com/v1`
  - no `scope`

  Replace the access token, expiry, scopes and refresh token together. Run only one refresh at a time per account, so a rotating refresh token is never used twice.
- **Storage:** OpenAI's example writes an owner-only (0600) JSON file. We'll store one record per issued client ID and account in the macOS Keychain, from Rust.
  - Tokens never go into webview storage, logs, URLs, analytics or support transcripts.
  - An ID token is only ever sent as `id_token_hint` to OpenAI's authorize endpoint.
  - Links that open the app (`tempercraft://`) never carry tokens or invite codes, because any app can claim a URL scheme ([ADR-018](../adr/ADR-018-open-app-from-browser.md)).
- **Sign-out:**
  1. Revoke the refresh token at the `revocation_endpoint` listed in `https://auth.openai.com/.well-known/openid-configuration`. Send a form POST with `token`, `token_type_hint=refresh_token` and `client_id`; an empty 200 means success.
  2. Clear the tokens.
  3. Keep the account's client ID and the host ID for a later sign-in.

  If credentials are ever compromised, users can disconnect the app in ChatGPT's settings.

The Firebase web config (`apiKey`, `projectId` and so on) only identifies the project. It isn't a secret and can live in the repo. Security comes from the Firestore and Storage rules and the Firebase Auth settings.

### Calling the model

- **Model list:** call `GET https://api.openai.com/v1/models` with the access token.
  - Show the `display_name` of entries with `visibility: "list"`, and send the chosen `slug` as `model`.
  - Reload the list when the user switches accounts. Don't hard-code model names.
- **Inference:** call `POST https://api.openai.com/v1/responses` with `Authorization: Bearer <access token>`, and:
  - set `store: false` and `stream: true`
  - send the full history in `input` every turn (no `previous_response_id`)
  - put instructions in the `instructions` field; explicit system-role messages are rejected
- **Not supported in this flow:**
  - **Request fields:** `background`, `conversation`, `max_output_tokens`, `max_tool_calls`, `metadata`, `moderation`, `multi_agent`, `prompt`, `prompt_cache_retention`, `safety_identifier`, `temperature`, `top_logprobs`, `top_p`, `truncation` and `user`.
  - **Tools:** image generation, file search, Code Interpreter, computer use, hosted MCP and connectors, and `tool_search`.
  - **Inputs and APIs:** audio and video input, and the Files API.

  Text, image and file inputs do work when the model accepts them, so preview screenshots can be sent as images.
- **Tools:** function and custom tools work. The docs say to "group function/custom tools in namespaces or supply them through `additional_tools` input items". Check the exact request shape against the API reference when we implement it.
- **Completion:** a turn has succeeded only when `response.completed` arrives.
  - Also handle `response.incomplete`, interrupted streams and `response.failed`.
  - Usage limits arrive as `response.failed` with the code `subscription_sharing_usage_limit_exceeded` or `subscription_sharing_usage_unavailable`, possibly mid-stream.
  - Read OpenAI's [Errors and recovery](https://developers.openai.com/siwc/token-sharing-open-source/errors-and-recovery) page before building this part.
- **Limits:** ChatGPT Plus has a five-hour usage limit shared by every app that uses the user's plan. Pro doesn't have the five-hour limit.

## Abuse and usability

- **UI that OpenAI asks for**, from OpenAI's UI/UX guidelines:
  - A **Continue with ChatGPT** button with the approved branding. The button formats are on the [website integration page](https://developers.openai.com/siwc/website).
  - Once, after the first successful connection: a dialog saying **You're using your ChatGPT plan**, with a **Got it** button.
  - Near the composer or model picker: **Using ChatGPT plan**, with a **Manage usage** link to `https://chatgpt.com/settings/usage`.
  - On a usage-limit error: a message or dialog whose primary action is **Manage usage**.
  - For users who signed in with Google: a banner inviting them to **Continue with ChatGPT**.
  - On the tempercraft.app site: a statement that the (free) app uses the visitor's ChatGPT plan, because OpenAI asks apps to show which of their plans support it.
- **Rate limits:** Firebase Auth allows 100 new accounts an hour per IP address. Invite sending will need its own per-sender limits ([ADR-012](../adr/ADR-012-firebase-blaze-plan.md)).
- **Fail closed:** without a valid ChatGPT token there are no model calls. Behavior during a Google, Firebase or OpenAI sign-in outage isn't specified yet.
- **Accessibility and support:** not specified yet.

## Verification and rollout

| Scenario | Required behavior | Candidate and environment | Result | Evidence |
|---|---|---|---|---|
| Valid Google sign-in from the app | Firebase signs the user in with `signInWithCredential` | Not built | NOT RUN | — |
| Loopback callback with a wrong `state` | Rejected | Not built | NOT RUN | — |
| ChatGPT ID token with the wrong issuer, audience or `nonce`, or expired | Rejected | Not built | NOT RUN | — |
| Granted scopes lack `chatgpt.tokens.use.direct` | No plan usage | Not built | NOT RUN | — |
| Two refreshes at once for one account | Only one runs; the rotating refresh token is used once | Not built | NOT RUN | — |
| Sign-out | Refresh token revoked; tokens cleared; client ID and host ID kept | Not built | NOT RUN | — |
| Usage-limit error mid-stream | The **Manage usage** prompt is shown | Not built | NOT RUN | — |
| Making someone an owner without a recent sign-in | Refused; the app asks for a fresh Google sign-in | Not built | NOT RUN | — |
| A manager changing an owner, or anyone changing their own role | Refused by the server | Not built | NOT RUN | — |
| Tokens never in webview storage, logs or URLs | Not present | Not built | NOT RUN | — |

The Firebase Auth emulator covers the Google side locally ([developer guide](../engineering/developer-guide.md)). There's no emergency access procedure, because Tempercraft runs no admin console of its own yet.

## Sources

- [ChatGPT plan usage: overview](https://developers.openai.com/siwc/token-sharing-open-source)
- [Registration and sign-in](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
- [Accounts and sessions](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions)
- [Token reference](https://developers.openai.com/siwc/token-sharing-open-source/token-reference)
- [Models and inference](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
- [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)
- [UI/UX guidelines](https://developers.openai.com/siwc/ui-ux-guidelines)
- [Codex App Server](https://learn.chatgpt.com/docs/app-server): the note that its built-in login isn't for commercial or hosted services
- [Google: OAuth 2.0 for desktop apps](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Firebase: Google sign-in on the web](https://firebase.google.com/docs/auth/web/google-signin) (see "Handle the sign-in flow manually")
- [Firebase Auth limits](https://firebase.google.com/docs/auth/limits)

## Completion check

- [ ] Identity, federation, recovery, and session boundaries are explicit.
- [ ] Revocation, failure, and account-linking behavior have testable expectations.
- [ ] Rollout evidence covers allowed and denied paths for the actual candidate.
