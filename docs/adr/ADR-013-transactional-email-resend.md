# ADR-013: Send invite emails with Resend from a Cloud Function

| Field | Value |
|---|---|
| Document ID | ADR-013 |
| Product or service | Tempercraft: transactional email from tempercraft.app (team invites first) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Accepted |
| Version | 6 |
| Last reviewed | 2026-11-21 |
| Review trigger | When its assumptions change or the decision is superseded |
| Related work | [ADR-012](ADR-012-firebase-blaze-plan.md), [DEC-001](../product/decisions.md#decisions), [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md), [register gaps](../README.md#gaps-and-actions) |

## Decision identity

- ADR number and title: ADR-013, Send invite emails with Resend from a Cloud Function
- Decision status: Accepted
- Proposed date: 2026-11-21
- Decision-maker and actual decision date: Project owner, 2026-11-21
- Supersedes or superseded by: N/A

## Context

- **Need:** the first release is invite-only ([DEC-001](../product/decisions.md#decisions)). Admins invite managers, and managers accept from an email ([user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md)). The owner's notes ask "how and where do we send invites". Volume is low, well under 100 emails a day.
- **The domain when this was proposed** (checked with `dig` on 2026-11-21):
  - Mail for tempercraft.app is on Google Workspace: MX `smtp.google.com`, SPF `include:_spf.google.com`, DKIM at `google._domainkey`.
  - DNS is hosted on Cloudflare.
  - There's no DMARC record.
- **Constraint:** no email credential can ship in the open-source app, so sending runs server-side. [ADR-012](ADR-012-firebase-blaze-plan.md) allows Cloud Functions for that.

## Options considered

Prices and limits were checked on 2026-11-21.

| Option | Benefits | Costs and risks | Evidence | Why selected or rejected |
|---|---|---|---|---|
| Resend | Free plan: 3,000 emails a month (100 a day), 3 domains, 30-day logs, API and SMTP. API keys can be limited to sending, from one domain. Adds its DNS records through a Cloudflare sign-in | Another vendor account. The 100-a-day cap; Pro is $20 a month for 50,000 | [Resend pricing](https://resend.com/pricing), [Cloudflare setup](https://resend.com/docs/knowledge-base/cloudflare) | Selected |
| Mailgun | Free plan: 100 emails a day | 1 domain, 1 API key, 1 day of logs. Basic is $15 a month for 10,000 | [Mailgun pricing](https://www.mailgun.com/pricing/) | Rejected: the same cap with less on the free plan |
| Twilio SendGrid | Mature | No free plan since 2025, only a 60-day trial. Essentials is $19.95 a month | [Twilio changelog](https://www.twilio.com/en-us/changelog/sendgrid-free-plan) | Rejected |
| Google Workspace SMTP (`smtp-relay.gmail.com` or `smtp.gmail.com`) | Included in Workspace. Up to 10,000 messages per user a day through the relay. Google DKIM is already set up | The server would hold a Workspace user's app password, which has full mailbox access if it leaks. Abuse of invites would limit sending for the real mailbox. A dedicated sending user costs another seat. No delivery logs | [SMTP relay](https://support.google.com/a/answer/2956491), [sending from apps](https://support.google.com/a/answer/176600) | Rejected |
| Cloudflare Email Service | DNS is already on Cloudflare | No sending on Workers Free. Workers Paid ($5 a month) includes 3,000 emails, then $0.35 per 1,000. Still in beta | [Cloudflare pricing](https://developers.cloudflare.com/email-service/platform/pricing/) | Rejected for now |
| Amazon SES | Cheapest at scale | Since July 2026, new accounts get no free monthly allowance. A sandbox to leave, and more setup for this volume | [AWS: SES pricing plans](https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-ses-pricing-plans/) | Rejected |

## Decision

Accepted by the project owner on 2026-11-21:
- **Sender:** a Cloud Function, for example `sendInvite`, sends invite emails through Resend's free plan.
- **Checks:** the function verifies the caller's Firebase identity and role, builds the email from its own template (callers supply only the invitee and the team), and rate-limits per sender.
- **Keys:** each environment has its own Resend API key, limited to sending from `mail.tempercraft.app` and stored in that project's Secret Manager ([ADR-014](ADR-014-dev-and-prod-firebase-projects.md)).
- **Addresses:** Resend sends for the subdomain `mail.tempercraft.app`, so mail comes from an address such as `Tempercraft <invites@mail.tempercraft.app>`, with replies going to a monitored project mailbox. The subdomain keeps the app's sending reputation apart from the Workspace mail on the root domain.

## Consequences and mitigations

- Positive consequences:
  - $0 at invite volumes.
  - App mail gets its own sending reputation, separate from the Workspace mailbox.
  - Delivery logs, bounce handling and a suppression list.
- Costs and constraints introduced:
  - One more vendor account.
  - A cap of 100 emails a day on the free plan.
  - New DNS records, all under `mail.tempercraft.app`:
    - a DKIM TXT record at `resend._domainkey.mail`
    - a CNAME at `send.mail` to `send.forge.rmta.net`, which carries the SPF record and the bounce MX
    - a CNAME at `rsend.mail` to `rsend-apne1.forge.rmta.net`

    Workspace's records on the root domain don't change.
- Failure or reversal risks:
  - If the function accepted arbitrary recipients or content, it would become a spam relay for the domain.
  - Resend's free plan terms could change.
- Mitigations and owners (project owner):
  - Server-side templates, role checks and per-sender limits.
  - DMARC is in place with `p=none`, and aggregate reports go to `dmarc@tempercraft.app`. Tighten the policy once the reports show that all mail from the domain passes.
  - If Resend stops fitting, Mailgun's free plan has the same daily cap.
- Revisit conditions: sending regularly passes 100 emails a day, Resend's pricing changes, or deliverability problems appear.

## Implementation and evidence

| Step | State (2026-11-21) |
|---|---|
| 1. Create a Resend account | Done by the project owner |
| 2. Add the sending domain in Resend, and let Resend's Cloudflare auto-configure add the DNS records | Done. The owner added `mail.tempercraft.app`; Resend shows DKIM and SPF as Verified, with sending enabled. Checked with `dig` against 1.1.1.1: the DKIM TXT at `resend._domainkey.mail.tempercraft.app` matches Resend's key; `send.mail` resolves to `send.forge.rmta.net` (SPF `v=spf1 ip4:… ~all`, MX `feedback.forge.rmta.net`); `rsend.mail` resolves to `rsend-apne1.forge.rmta.net`. Workspace's MX, SPF and DKIM on the root are unchanged |
| 3. Add a `_dmarc` TXT record at the root | Done: `v=DMARC1; p=none; rua=mailto:dmarc@tempercraft.app;`. It resolves from Cloudflare's nameserver and 1.1.1.1 (checked 2026-11-21). `mail.tempercraft.app` has no record of its own, so the root policy covers it. Aggregate reports go to the `dmarc@tempercraft.app` alias, added on 2026-11-21 |
| 4. Create a sending-only API key per environment, and store each with `firebase functions:secrets:set RESEND_API_KEY --project dev` (then `--project prod`) | NOT RUN |
| 5. Write `sendInvite`, with tests for unauthorized callers, wrong roles and rate limits | NOT RUN. Waits on the invite-flow questions in the [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md#validation-and-changes) |

Resend also offers SMTP (`smtp.resend.com`, port 465 or 587, username `resend`, password = API key) for tools that need it; from a Cloud Function its SDK is simpler.

## Completion check

- [x] The choice, alternatives, and consequences are understandable without the original discussion.
- [x] The decision status and actual authority are recorded accurately.
- [x] Revisit conditions and dependent work are linked.
