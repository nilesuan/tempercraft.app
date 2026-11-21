# User journey: an owner adds, verifies or removes an email domain

| Field | Value |
|---|---|
| Document ID | JOURNEY-010 |
| Product or service | Tempercraft desktop app: team settings, the org's email domains |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 6 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md) (the first domain); [JOURNEY-005](JOURNEY-005-sign-in-and-invite-check.md) (paused accounts at sign-in); [DEC-007, DEC-010, DEC-011, DEC-013 and DEC-015](../product/decisions.md#decisions); [authentication design](../architecture/authentication.md#account-and-authenticator-lifecycle); [ADR-013](../adr/ADR-013-transactional-email-resend.md) (email) |

## Journey context

- Journey ID and name: JOURNEY-010, an owner adds, verifies or removes an email domain
- User segment and goal: a team owner. They want people at another of their company's domains to be able to join, or to cut off a domain the org no longer uses.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when the owner opens the org's domains in team settings. It's complete when a new domain is verified, or when a removed domain's invites are cancelled, its accounts paused, and the paused people emailed.
- Preconditions and permissions:
  - Only team owners manage domains ([DEC-007](../product/decisions.md#decisions)).
  - A domain an owner adds counts only after they prove they own it, with a TXT record at `_tempercraft.{domain}` ([DEC-010 and DEC-013](../product/decisions.md#decisions)). The org's first domain, the owner's own, is the exception: it's trusted because a system admin invited the owner ([DEC-017](../product/decisions.md#decisions)).
  - A domain belongs to at most one org, so every account belongs to at most one org.
  - Nobody outside the org's domains can join. To give contractors access, the org issues them an address at one of its own domains.
- Evidence or design sources: the owner's answers on 2026-11-21 ([DEC-010 and DEC-013](../product/decisions.md#decisions)).

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Opens team settings, then Domains | App, owners only | Lists the org's domains and whether each is verified | Org domains | — | Proposed |
| 2 | Adds a domain, for example `opstaging.com.au` | Domains | Checks that no other org has the domain, then shows a TXT record to add at `_tempercraft.opstaging.com.au`, containing a one-time code | Domain, verification code | Another org already has it | [DEC-010 and DEC-013](../product/decisions.md#decisions) |
| 3 | Adds the TXT record at their DNS provider | Their DNS provider, outside Tempercraft | — | DNS record | DNS changes can take a while to show up | [DEC-013](../product/decisions.md#decisions) |
| 4 | Clicks Verify | Domains | A server function looks up `_tempercraft.{domain}`. If the code matches, it marks the domain verified, and invites to it become possible | Domain status | The record isn't visible yet | [DEC-010](../product/decisions.md#decisions) |
| 5 | Sees the result | Toast, for example "opstaging.com.au is verified" | — | — | — | Proposed |
| 6 | To remove a domain: clicks Remove | Domains | A dialog shows the effect, for example "3 pending invites will be cancelled, and 5 people's accounts paused" | Invites and accounts at the domain | — | [DEC-010](../product/decisions.md#decisions) |
| 7 | Confirms | Dialog | A server function removes the domain, cancels its pending invites, pauses its accounts, emails each paused person, and records the change | Domain, invites, account status, audit record | Resend's cap of 100 emails a day | [DEC-010 and DEC-013](../product/decisions.md#decisions); [ADR-013](../adr/ADR-013-transactional-email-resend.md) |

### Paused-account email ([DEC-015](../product/decisions.md#decisions))

Sent from `notifications@mail.tempercraft.app`, in the same short style as the role-change email ([DEC-014](../product/decisions.md#decisions)):

```
Subject: Your Tempercraft account is paused

Hi {name},

Your account in {team} is paused because {domain} was removed from the team on {date}.

Please contact your owner or team manager.

— Tempercraft
```

## Alternate paths

- **Managers and members:** they have no Domains controls, and the server functions refuse them.
- **Another org has the domain:** "This domain is already used by another organization." The message doesn't say which org.
- **Public email domains such as gmail.com:** nobody can prove they own one, so they can never be verified. Proposed: refuse them at step 2, before asking for a DNS record.
- **Record not found yet:** "We couldn't find the record yet. DNS changes can take up to a day." The domain stays unverified, and they can try again later.
- **Removal would pause every owner:** refused, because an org always keeps at least one owner ([DEC-009 and DEC-016](../product/decisions.md#decisions)). Proposed message: "Make someone at another domain an owner first."
- **Contractors:** an address outside the org's domains can't be invited. The org gives the contractor an address at one of its own domains instead.
- **Later checks:** verified domains aren't checked on a schedule. The record is checked again only when someone tries to update the domain ([DEC-013](../product/decisions.md#decisions)).
- **Paused people:** the app shows "Account is paused, please contact your owner or team manager" ([DEC-013](../product/decisions.md#decisions)).
- **Re-verifying a removed domain:** adding the domain again and verifying it restores the accounts that were paused when it was removed ([DEC-015](../product/decisions.md#decisions)). Invites cancelled at the time stay cancelled. The Domains screen then offers a Resend button for them ([DEC-016](../product/decisions.md#decisions)).
- **Unpausing one person:** owners and managers can unpause someone from the members list, but only when the person's domain is one of the org's verified domains. Managers can't unpause owners ([DEC-015 and DEC-016](../product/decisions.md#decisions)).

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 2 to 4. Verify | None yet | Domains verified, and time from adding to verifying | Domain records (proposed) | Project owner |
| 7. Remove | None yet | Every removal records who removed which domain, and which invites and accounts it affected. Owners can see these records in team settings ([DEC-011](../product/decisions.md#decisions)) | An audit record per removal | Project owner |
| 7. Paused emails | None yet | Paused-account emails delivered | Resend delivery events | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. Does the one-time code expire if the owner never adds the record?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
