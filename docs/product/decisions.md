# Decision log

| Field | Value |
|---|---|
| Document ID | DEC-LOG-001 |
| Product or service | Tempercraft: product and delivery decisions |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 14 |
| Last reviewed | 2026-11-21 |
| Review trigger | When new decisions supersede or qualify earlier ones |
| Related work | [Document register](../README.md), [architecture decision records](../README.md#register), [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md) |

## Scope and authority

- **What belongs here:** product and delivery decisions, such as who the product is for, release scope, sign-up and pricing.
- **Where technical decisions live:** architecture decision records in [adr/](../adr), one file each, listed in the [document register](../README.md#register). They stay authoritative for their subjects, and this log links to them rather than repeating them. [ADR-003](../adr/ADR-003-free-and-open-source.md) records the free and open-source decision, because the architecture depends on it.
- **Authority:** the project owner makes every decision.
- **Open questions:** questions that aren't decided yet are tracked in the register's [gaps](../README.md#gaps-and-actions).

## Decisions

| ID | Date | Question | Options | Actual decision and rationale | Decision-maker | Evidence | Revisit trigger |
|---|---|---|---|---|---|---|---|
| DEC-001 | 2026-11-21 | Who can use the first release? | Not recorded | Invite-only: a team owner is invited to sign up, and members accept invites. Rationale not recorded | Project owner | Owner's working notes, 2026-11-21 (`docs/SCRATCH.md`, kept out of git) | Before sign-up opens to the public |
| DEC-002 | 2026-11-21 | Where can people sign up? | Not recorded | Only inside the app. The website shows the landing page, the download and the invite confirmation. Rationale not recorded | Project owner | Same notes | When sign-up on the web is needed |
| DEC-003 | 2026-11-21 | What can each role do? | Not recorded | The team owner owns the org and its billing, and can also do everything a team manager can. A team manager manages the team and its members. From the notes: the system admin (Tempercraft staff) sends invites, and team members use the app. Rationale not recorded | Project owner | The owner's answer on 2026-11-21; the working notes | When paid plans or new roles are added |
| DEC-004 | 2026-11-21 | Whom do system admins invite? | Team owners or team managers | Team owners first. Owners, and the managers they invite, invite everyone else. Rationale: an org needs its owner before anyone else joins (proposed in JOURNEY-002 and accepted) | Project owner | The owner's answer on 2026-11-21 | When admins need to add people to an existing org |
| DEC-005 | 2026-11-21 | Is there billing in the first release? | Not recorded | No. Billing is planned for a later release. Rationale not recorded | Project owner | The owner's answer on 2026-11-21 | When billing is planned |
| DEC-006 | 2026-11-21 | What is a tenant? | Not recorded | The org. Each org has exactly one team, so the org and its team are the same tenant. Rationale not recorded | Project owner | The owner's answer on 2026-11-21 | When an org needs more than one team |
| DEC-007 | 2026-11-21 | Which email addresses can join an org? | Not recorded | Only addresses at the org's email domains. An org can have several, for example `onlineprojects.com.au` and `opstaging.com.au`, and the team owner adds them. Invites go only to addresses at those domains, and sign-ins must come from them. Rationale not recorded | Project owner | The owner's answer on 2026-11-21 | When an org needs members outside its domains |
| DEC-008 | 2026-11-21 | Who can change someone's role? | Not recorded | An owner can change another user's role, including making them an owner. A manager can change a user's role up to manager. Members can't change anyone's role. Rationale not recorded | Project owner | The owner's answer on 2026-11-21 | When roles are added, or billing arrives |
| DEC-009 | 2026-11-21 | What are the detailed rules for role changes? | The proposals under DEC-008's consequences, and the open questions in JOURNEY-009 | Managers can demote other managers, but can't change an owner's role. Nobody can change their own role. Making someone an owner needs a recent sign-in. The person gets an email when their role changes. An org always keeps at least one owner. Invites can carry any role the inviter could assign. A server function makes every role change after checking the caller, and records who changed whose role, from what, to what, and when. Rationale not recorded | Project owner | The owner's answers on 2026-11-21 | When roles are added |
| DEC-010 | 2026-11-21 | How are an org's email domains managed? | The open questions under DEC-007 | Owners must prove they own a domain, for example with a DNS record, before it's added. A domain can belong to only one org, so every account belongs to at most one org. Removing a domain cancels the pending invites at it and pauses the accounts at it. Nobody outside the org's domains can join; to give contractors access, the org issues them an address at one of its own domains. Rationale not recorded | Project owner | The owner's answers on 2026-11-21 | When an org needs outsiders, or two orgs need the same domain |
| DEC-011 | 2026-11-21 | How recent must a sign-in be to make someone an owner, and who sees the audit records? | The proposals in JOURNEY-009 | Within the last 5 minutes, checked against when the person last signed in with Google. Owners can see the audit records in the app. Rationale not recorded | Project owner | The owner's answers on 2026-11-21 | When audit or sign-in rules change |
| DEC-012 | 2026-11-21 | Where is the work tracked? | Not recorded | In Linear, for project management: stories, tasks and bugs. These docs keep the decisions and designs, and link to Linear for the work. Rationale not recorded | Project owner | The owner's message on 2026-11-21 | When the team outgrows Linear |
| DEC-013 | 2026-11-21 | How are domains verified, and what happens to paused accounts? | The open questions in JOURNEY-010 | The verification TXT record goes at `_tempercraft.{domain}`. Verified domains aren't checked again on a schedule; the record is checked again only when someone tries to update the domain. A paused person sees "Account is paused, please contact your owner or team manager" and gets an email. Rationale not recorded | Project owner | The owner's answers on 2026-11-21 | When domain rules change |
| DEC-014 | 2026-11-21 | What does the role-change email say? | Three wording options offered on 2026-11-21 | Option A: one short, neutral template. The subject is "Your role in {team} is now {new role}", and the body says who changed the role, from what, to what, and when, ending with "If you weren't expecting this, reply to this email to contact {changer}." Rationale not recorded | Project owner | The owner's answer on 2026-11-21 | When people give feedback on the email |
| DEC-015 | 2026-11-21 | How are paused accounts restored, and how are notification emails sent? | The open questions in JOURNEY-009 and JOURNEY-010 | Verifying a removed domain again restores the accounts paused when it was removed. Owners and managers can unpause someone. The paused-account email uses the wording proposed in JOURNEY-010. When someone becomes an owner, the other owners get an email too. These emails come from `notifications@mail.tempercraft.app`. Rationale not recorded | Project owner | The owner's answers on 2026-11-21 | When pausing or notification rules change |
| DEC-016 | 2026-11-21 | Which of the open proposals stand? | The 13 proposals listed on 2026-11-21 | Eleven confirmed, one changed and two left open; the list is under Consequences and actions. Changed: Sentry in the app uses the official SDKs first, with the community plugin as the fallback. Left open: whether the owner's first domain needs a DNS check, and whether to block sign-up with a blocking function | Project owner | The owner's answers on 2026-11-21 | — |
| DEC-017 | 2026-11-21 | Does the owner's own domain need a DNS check, and is sign-up blocked without an invite? | The two points DEC-016 left open | The owner's own domain needs no DNS check, because a system admin invited the owner; only domains added later need it. Sign-up is blocked for anyone without an invite, by a blocking function that needs Firebase Authentication with Identity Platform ([ADR-019](../adr/ADR-019-block-sign-up-without-invite.md)). Rationale: the admin's invite vouches for the first domain, which keeps onboarding simple (recommended on 2026-11-21 and accepted) | Project owner | The owner's answers on 2026-11-21 | When sign-up opens to the public |

## Consequences and actions

- **DEC-001 needs an invite flow.** That means:
  - invite emails, sent with Resend from a Cloud Function ([ADR-013](../adr/ADR-013-transactional-email-resend.md));
  - an accept page on tempercraft.app ([ADR-015](../adr/ADR-015-website-hosting-and-urls.md));
  - an authorization model for the roles in DEC-003.

  The open questions are in the [user journey](../user-journeys/JOURNEY-001-invite-to-dashboard.md#validation-and-changes), and the actions are in the register's [gaps](../README.md#gaps-and-actions).
- **DEC-002 means the website has no sign-up form.** Sign-in in the app ([authentication design](../architecture/authentication.md)) has to connect an accepted invite to the new account. That design is pending.
- **DEC-003 adds an organization with an owner.** Permissions per role still need an authorization model.
- **DEC-004 sets the invite chain:** system admin, then team owner, then managers and members ([JOURNEY-002](../user-journeys/JOURNEY-002-admin-invites-owner.md), [JOURNEY-006](../user-journeys/JOURNEY-006-owner-and-manager-onboarding.md)).
- **DEC-005 keeps the first release free**, so [ADR-003](../adr/ADR-003-free-and-open-source.md) stands. When billing is planned, ADR-003's revisit condition applies: OpenAI documents ChatGPT plan usage for free, open-source apps, and a paid app needs OpenAI's interest form ([ADR-004](../adr/ADR-004-model-access-sign-in-with-chatgpt.md)).
- **DEC-006 makes the org the tenant.** Confirmed in DEC-016: tenancy inside the app.
  - Everyone signs in to the same Firebase project.
  - Firestore data and security rules are partitioned by org, and every request checks that the caller belongs to the org.
  - Identity Platform's separate tenants, each with its own user pool, aren't needed.
  - The data model and the authorization model still need writing.
- **DEC-007 ties membership to email domains.**
  - The org's first domain is the owner's own email domain, set when they set up the team. It needs no DNS check, because a system admin invited the owner (DEC-017).
  - `sendInvite` and the sign-in check both enforce the domains on the server, confirmed in DEC-016. The app's own checks are only there to give feedback.
  - Public email domains, such as gmail.com, can't be org domains.
  - Its open questions were answered the same day, as DEC-010.
- **DEC-008 allows several owners per org.** The owner confirmed the detailed rules on the same day, as DEC-009.
- **DEC-009 needs three things built:**
  - a recent-sign-in check before anyone is made an owner ([authentication design](../architecture/authentication.md#account-and-authenticator-lifecycle));
  - a role-change email, sent through Resend ([ADR-013](../adr/ADR-013-transactional-email-resend.md)), which counts toward the 100 emails a day;
  - an audit record for every change.

  The flow is in [JOURNEY-009](../user-journeys/JOURNEY-009-change-role.md). Because nobody can change their own role, an owner who wants to step down needs another owner to change it.

- **DEC-010 settles how domains work.**
  - Public email domains such as gmail.com can never be org domains, because nobody can prove they own them. That makes the matching DEC-007 proposal automatic.
  - Decided in DEC-017: the owner's first domain is trusted from the system admin's invite, so only domains added later need the DNS check.
  - Confirmed in DEC-016: a domain can't be removed if that would pause every owner, because an org always keeps at least one owner (DEC-009).
  - To build: a DNS check in a server function, a paused state for accounts, and an audit record for each removal. The flows are in [JOURNEY-010](../user-journeys/JOURNEY-010-manage-domains.md).

- **DEC-011 sets the details:**
  - The server compares the sign-in time in the caller's Firebase ID token with the current time. If more than 5 minutes have passed, the app asks for a fresh Google sign-in.
  - Owners see the audit records for role changes and domain removals in team settings. Whether managers see them too isn't decided.

- **DEC-012 makes Linear the home of the work.**
  - The register lists Linear as the authoritative location for work items, and the repo's `.mcp.json` connects Claude Code to it.
  - Confirmed in DEC-016: issue descriptions follow the PDLC work-item templates, such as the user story, task and bug report.
  - The same day's tooling choices are technical, so they're ADRs: Sentry is [ADR-016](../adr/ADR-016-sentry-error-tracking.md), Google Analytics is [ADR-017](../adr/ADR-017-google-analytics.md), and opening the app from the browser is [ADR-018](../adr/ADR-018-open-app-from-browser.md).

- **DEC-013's two open points,** restoring paused accounts and the paused-account email's wording, were settled the same day as DEC-015.
- **DEC-014's wording asks people to reply to whoever changed their role,** so the email's reply-to address is that person's. DEC-015 sets the sending address.

- **DEC-015 adds an unpause action and a third email.** These details were confirmed in DEC-016:
  - Unpausing someone needs their email domain to be one of the org's verified domains, so DEC-007 still holds.
  - Managers can unpause members and managers, but not owners, matching DEC-009.
  - Invites cancelled when a domain was removed stay cancelled. Once the domain is verified again, a Resend button sends them again.
  - The wording of the new-owner email to the other owners is in [JOURNEY-009](../user-journeys/JOURNEY-009-change-role.md).

- **DEC-016 confirms:**
  - the email to the other owners ([JOURNEY-009](../user-journeys/JOURNEY-009-change-role.md));
  - unpausing only at a verified org domain, and managers can't unpause owners;
  - cancelled invites stay cancelled, with a Resend button after re-verification;
  - a domain can't be removed if that would pause every owner;
  - the server enforces the domain rule;
  - one Firebase project, with each org's data kept separate;
  - system admins send invites from an admin screen in the app;
  - Linear issues follow the PDLC templates;
  - the analytics details in [ADR-017](../adr/ADR-017-google-analytics.md).
- **DEC-016 changes** Sentry in the app to the official SDKs first, at the owner's request ([ADR-016](../adr/ADR-016-sentry-error-tracking.md)).
- **DEC-016 left two points open,** and DEC-017 settled both the same day:
  - the owner's first domain needs no DNS check;
  - sign-up is blocked without an invite, by a blocking function ([ADR-019](../adr/ADR-019-block-sign-up-without-invite.md)). It needs Firebase Authentication with Identity Platform, which is free on Blaze up to 50,000 monthly active users.

## Superseded decisions

No decision has been fully superseded. DEC-017 narrows DEC-010: the owner's first domain no longer needs a DNS check, while domains added later still do. Superseded architecture decisions keep their own records: [ADR-009](../adr/ADR-009-firebase-spark-no-cloud-functions.md) is superseded by [ADR-012](../adr/ADR-012-firebase-blaze-plan.md).

## Communication

This is a single-maintainer project, so nobody else needs to be told yet. Contributors read this log and the register.

## Completion check

- [ ] Each recorded decision has authority, rationale, date, and evidence.
- [x] Consequences and actions are traceable.
- [x] Superseded decisions retain their history and replacement link.
