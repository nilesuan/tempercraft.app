# Privacy policy and collection notices

| Field | Value |
|---|---|
| Document ID | PRIV-001 |
| Product or service | Tempercraft: the macOS app, the tempercraft.app websites, and the emails Tempercraft sends |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When processing, responsible entities, recipients, user routes, or applicable requirements change |
| Related work | [ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md) (OpenAI); [ADR-013](../adr/ADR-013-transactional-email-resend.md) (email); [ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md) (Firebase); [ADR-016](../adr/ADR-016-sentry-error-tracking.md) (Sentry); [ADR-017](../adr/ADR-017-google-analytics.md) (analytics); [ADR-019](../adr/ADR-019-block-sign-up-without-invite.md) (sign-up); [DEC-001 to DEC-017](../product/decisions.md#decisions); [authentication design](../architecture/authentication.md) |

## Applicability and source of truth

- **What this record prepares:** both a general privacy policy and short collection notices.
  - The policy will be published on the website at `/privacy` ([ADR-015](../adr/ADR-015-website-hosting-and-urls.md)), and linked from the app.
  - The notices appear in the app and on the website, at the moments listed in [collection notice at the interaction](#collection-notice-at-the-interaction).
- **Responsible entity:** [Open: the owner as an individual, or a company].
- **Audience:**
  - people invited to the invite-only first release ([DEC-001](../product/decisions.md#decisions)): team owners, managers and members;
  - visitors to the website;
  - people who receive invites.
- **Regions:** not limited. The owner and the data are in Australia, but anyone can be invited.
- **Which laws apply:** [Open: not assessed]. Candidates are Australia's Privacy Act 1988 and its Australian Privacy Principles (the small business exemption may apply), the GDPR and UK GDPR if people in the EU or UK are invited, and US state laws. The draft below is written to be compatible with them, but that isn't a legal assessment.
- **Sources of truth:** the decisions and designs linked in Related work. Almost nothing is built yet, so every claim below is NOT RUN until the claims table shows evidence.

## Public policy draft

The text below is the public extract. Before publishing, resolve every "[Open: …]" item, and verify every claim in the [claims table](#claims-and-operating-evidence).

### Who we are

Tempercraft is a free, open-source macOS app for designing web pages with an AI agent, together with the website tempercraft.app. In this policy, "Tempercraft", "we" and "us" mean [Open: the responsible entity].

Questions or requests: privacy@tempercraft.app [Open: this mailbox doesn't exist yet].

### What we collect

- **Your account:** when you sign in with Google, Google shares your name, email address, profile photo and account ID with us, through Firebase Authentication.
- **Your team:**
  - your team's name and email domains;
  - your role;
  - the invitations you send or receive: the invited email address, the role, who sent it and when;
  - records of role changes and domain changes: who made each change and when.
- **Emails we send:** invitations, role-change and paused-account notices, and notices to owners when a new owner is added. Our email provider records whether each email was delivered.
- **Error reports:** when the app or the website hits an error, the error's details, the app version and your operating system. Before a report is sent, we remove tokens, email addresses, file paths, prompts and the contents of your files.
- **Usage analytics, only if you agree:** which features you use, recorded against a random identifier, plus the device details and approximate location Google Analytics works out. The app sends nothing until you agree. On the website, we ask first wherever the law requires it.
- **Website visits:** Google, which hosts the website, processes your IP address and browser details to deliver pages and protect the site.

### What we don't collect

- **Your designs and prompts:** your project files stay on your Mac. When you use the agent, your prompts, the files it needs and screenshots of the preview go straight from your Mac to OpenAI, under your own ChatGPT account. They don't pass through Tempercraft's servers, and we don't keep them. What OpenAI does with them is covered by OpenAI's terms and your ChatGPT data controls.
- **Your ChatGPT sign-in:** the tokens that connect Tempercraft to your ChatGPT account are stored only in your Mac's Keychain. They never reach our servers, logs or analytics.

### How we use it

- To run accounts, teams and invitations, and to make sure only invited people at your team's email domains can join.
- To send the emails described above.
- To find and fix problems.
- If you agree, to understand how Tempercraft is used, so we can improve it.
- To keep Tempercraft secure and prevent abuse.

We don't sell personal information, and we don't use it for advertising. We don't train AI models on your information.

### Who receives it

| Provider | What for | Where |
|---|---|---|
| Google: Firebase Authentication, Cloud Firestore, Cloud Functions and Firebase Hosting | Accounts, team data, our server functions and the website | Team data is stored in Sydney, Australia. Sign-in and hosting run on Google's global infrastructure |
| Google Analytics | Usage analytics, only if you agree | Google's global infrastructure |
| Resend | Sending our emails | Outside Australia [Open: confirm Resend's processing locations] |
| Sentry | Error reports | [Open: the region chosen when the Sentry account is created] |
| OpenAI | Only what you send through the agent, directly from your Mac under your own ChatGPT account | OpenAI's infrastructure |

Some of these providers process information outside Australia, including in the United States.

### How long we keep it

- **Account and team information:** while your account and team exist, until you ask us to delete it.
- **Invitations and change records:** while your team exists, so its owners can see the history. [Open: whether invitations are deleted sooner after they expire or are cancelled.]
- **Error reports:** deleted automatically after [Open: the Sentry retention period].
- **Analytics:** Google Analytics keeps event data for [Open: the retention setting; proposed 2 months].

### Your choices and requests

- **Analytics:** turn usage analytics on or off at any time, in the app's settings or the website's cookie settings.
- **Access, correction, export and deletion:** email privacy@tempercraft.app. We'll check that the request comes from your account's email address before we act on it.
- **Your team:** your team's owners and managers decide who's in the team and what role each person has. If your email domain is removed from your team, your account is paused, not deleted, and you can ask your owner or a team manager to restore it.
- **ChatGPT:** you can disconnect Tempercraft from your ChatGPT account in the app or in ChatGPT's settings at any time.

### Complaints

Please contact us first at privacy@tempercraft.app. If you're not satisfied with our answer, you can complain to the Office of the Australian Information Commissioner (oaic.gov.au), or to the data protection authority where you live.

### Children

Tempercraft is a tool for work teams and isn't meant for anyone under 16. [Open: confirm the minimum age.]

### Changes to this policy

When this policy changes, we'll publish the new version here with its effective date. For significant changes, we'll also tell account holders by email or in the app.

Effective date: [Open: set on publication].

## Collection notice at the interaction

| Interaction and audience | Information and purpose | Required or optional and consequence of declining | Short explanation and detailed policy link | Delivery point |
|---|---|---|---|---|
| Google sign-in, for anyone opening the app ([JOURNEY-005](../user-journeys/JOURNEY-005-sign-in-and-invite-check.md)) | Name, email address, profile photo and Google account ID, to create the account and check the invite | Required; without it, Tempercraft can't be used | "Sign in with Google to create your Tempercraft account." plus a link to the privacy policy | The welcome screen, before sign-in |
| Connecting ChatGPT, for members, and owners and managers if they connect ([JOURNEY-007](../user-journeys/JOURNEY-007-member-onboarding.md)) | Tokens stored on the Mac; prompts and files go to OpenAI | Required to use the agent | "Your prompts and files go straight from your Mac to OpenAI, under your ChatGPT plan." | The onboarding step, before connecting |
| Usage analytics in the app, for every user ([ADR-017](../adr/ADR-017-google-analytics.md)) | Feature-usage events, to improve Tempercraft | Optional; declining changes nothing else | "Share anonymous usage data to help improve Tempercraft? You can change this in Settings." | First launch, before any analytics is sent |
| Analytics on the website, for visitors ([ADR-017](../adr/ADR-017-google-analytics.md)) | Google Analytics cookies and events | Optional where the law requires consent | A consent banner, linking to the privacy policy | The first visit, before the analytics tag loads |
| Sending an invite, for owners, managers and admins ([JOURNEY-002](../user-journeys/JOURNEY-002-admin-invites-owner.md), [JOURNEY-006](../user-journeys/JOURNEY-006-owner-and-manager-onboarding.md)) | The invitee's email address and role, to send the invite | Required to invite someone | "We'll email an invitation to this address." | The invite form |

Every notice links to the full policy and must work with screen readers. The app and the website are in English only for now.

## Claims and operating evidence

| Public statement | Authoritative source and revision | Implemented behavior and verification | Owner | Open mismatch |
|---|---|---|---|---|
| Project files stay on your Mac; prompts and files go straight to OpenAI | [ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md), [architecture overview](../architecture/overview.md) | NOT RUN | Project owner | The agent isn't built |
| ChatGPT tokens are stored only in the Keychain | [Session contract](../architecture/authentication.md#session-contract) | NOT RUN | Project owner | Not built |
| Team data is stored in Sydney | [ADR-014](../adr/ADR-014-dev-and-prod-firebase-projects.md) | Dev: the `(default)` database is in `australia-southeast1` (checked with gcloud on 2026-11-21) | Project owner | Prod has no database yet |
| Only invited people at the team's domains can join | [DEC-007, DEC-010 and DEC-017](../product/decisions.md#decisions), [ADR-019](../adr/ADR-019-block-sign-up-without-invite.md) | NOT RUN | Project owner | Not built |
| Emails come from `mail.tempercraft.app` through Resend | [ADR-013](../adr/ADR-013-transactional-email-resend.md), [DEC-015](../product/decisions.md#decisions) | The domain is verified in Resend (2026-11-21); sending is NOT RUN | Project owner | No API keys or functions yet |
| Error reports are scrubbed of tokens, email addresses, paths, prompts and files | [ADR-016](../adr/ADR-016-sentry-error-tracking.md) | NOT RUN | Project owner | Sentry isn't set up |
| Analytics is sent only after agreement, and contains no personal details | [ADR-017](../adr/ADR-017-google-analytics.md) | NOT RUN | Project owner | No consent prompt, banner or function yet |
| No selling, no advertising, no model training | [ADR-017](../adr/ADR-017-google-analytics.md) | NOT RUN | Project owner | The GA property must have advertising features turned off |
| Retention periods | — | — | Project owner | Not decided |
| Requests go to privacy@tempercraft.app | — | NOT RUN | Project owner | The mailbox doesn't exist |
| Who is responsible | — | — | Project owner | The entity isn't decided |

## Review and publication

- **State on 2026-11-21:** Draft. Not reviewed, approved or published. Communication: NOT SENT.
- **Before publishing:**
  1. Decide the responsible entity, and create `privacy@tempercraft.app`.
  2. Assess which laws apply, ideally with a privacy professional.
  3. Decide the retention periods and the minimum age.
  4. Build the consent prompt and banner, and write the consent and preferences specification.
  5. Verify every row of the claims table against the built product.
- **Publication:** on the website at `/privacy`, with its effective date, and linked from the app's welcome screen and analytics prompt. Each published version is kept, with its dates.

## Completion check

- [ ] Policy and collection-notice purposes, applicability and audiences are explicit.
- [ ] Every public statement matches current data handling and staffed user routes.
- [ ] Interaction placement, choice behavior and accessible delivery have verification.
- [ ] Approved revision, actual publication and historical versions are recorded.
