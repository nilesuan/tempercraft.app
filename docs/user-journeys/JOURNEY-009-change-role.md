# User journey: an owner or manager changes someone's role

| Field | Value |
|---|---|
| Document ID | JOURNEY-009 |
| Product or service | Tempercraft desktop app: team settings, the members list and role changes |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 6 |
| Last reviewed | 2026-11-21 |
| Review trigger | When the workflow, user segment, channels, or failure behavior changes |
| Related work | [JOURNEY-001](JOURNEY-001-invite-to-dashboard.md) (roles); [JOURNEY-006](JOURNEY-006-owner-and-manager-onboarding.md) (inviting); [DEC-003, DEC-008, DEC-009, DEC-011, DEC-014 and DEC-015](../product/decisions.md#decisions); [authentication design](../architecture/authentication.md#account-and-authenticator-lifecycle); [ADR-013](../adr/ADR-013-transactional-email-resend.md) (email) |

## Journey context

- Journey ID and name: JOURNEY-009, an owner or manager changes someone's role
- User segment and goal: a team owner or team manager who wants to change what someone in their team can do. For example, they make a member a manager, or make a manager an owner.
- Current or proposed journey: proposed.
- Trigger and completion condition: it starts when they open the members list in team settings. It's complete when the new role is saved, shown in the list, and emailed to the person.
- Preconditions and permissions ([DEC-008 and DEC-009](../product/decisions.md#decisions)):

  | Role | Can change |
  | --- | --- |
  | Team owner | Anyone else's role, to owner, manager or member. Making someone an owner needs a Google sign-in within the last 5 minutes |
  | Team manager | Members and other managers, to manager or member. Not owners |
  | Team member | Nobody's role |

  Nobody can change their own role, and an org always keeps at least one owner. The person whose role changes is in the same org ([DEC-006](../product/decisions.md#decisions)).
- Evidence or design sources: the owner's answers on 2026-11-21 ([DEC-008 and DEC-009](../product/decisions.md#decisions)).

## Journey steps

| Step | User action | Touchpoint | System or staff response | Data involved | Difficulty or failure | Evidence |
|---|---|---|---|---|---|---|
| 1 | Opens team settings, then Members | App | Lists the team's people and their roles. Only owners and managers see role controls, and their own row has none | Members and roles | — | [DEC-009](../product/decisions.md#decisions) |
| 2 | Picks a person and a new role | Members list | Offers only the roles the user may give: owners see owner, manager and member; managers see manager and member, and no controls on owners | The person and the new role | — | [DEC-008 and DEC-009](../product/decisions.md#decisions) |
| 3 | Confirms | Dialog, for example "Make Jane an owner? Owners can change anyone's role." | — | — | — | Proposed |
| 4 | Making someone an owner: signs in again, if their last Google sign-in was more than 5 minutes ago | System browser, Google sign-in | Refreshes the user's sign-in | Sign-in time | They cancel the sign-in, so nothing changes | [DEC-009 and DEC-011](../product/decisions.md#decisions) |
| 5 | Waits a moment | App | A server function checks the user's role, the person's current role, the sign-in time for owner changes, and the last-owner rule. It then saves the change and records it | Membership record, audit record | — | [DEC-009](../product/decisions.md#decisions) |
| 6 | Sees the result | Toast, for example "Jane is now a manager" | The list shows the new role | — | — | Proposed |
| 7 | — | Email to the person, and to the other owners when someone becomes an owner | The emails below, sent from `notifications@mail.tempercraft.app`. Replies go to the person who made the change | Email addresses | Resend's cap of 100 emails a day | [DEC-009, DEC-014 and DEC-015](../product/decisions.md#decisions); [ADR-013](../adr/ADR-013-transactional-email-resend.md) |
| 8 | — | The other person's app | Their access changes the next time their app checks their role | Their role | How quickly the change reaches their app isn't designed | Proposed |

### Role-change email ([DEC-014](../product/decisions.md#decisions))

```
Subject: Your role in {team} is now {new role}

Hi {name},

{changer} changed your role in {team} from {old role} to {new role} on {date}.

If you weren't expecting this, reply to this email to contact {changer}.

— Tempercraft
```

### Email to the other owners ([DEC-016](../product/decisions.md#decisions))

Sent when someone becomes an owner ([DEC-015](../product/decisions.md#decisions)), in the same style:

```
Subject: {new owner} is now an owner of {team}

Hi {name},

{changer} made {new owner} an owner of {team} on {date}. Owners can change anyone's role and manage the team's email domains.

If you weren't expecting this, reply to this email to contact {changer}.

— Tempercraft
```

## Alternate paths

- **Members:** they see the list and its roles, with no role controls. The server function refuses them too.
- **A manager and an owner:** managers can't change an owner's role. The control isn't offered, and the function refuses it.
- **A manager demoting another manager:** allowed ([DEC-009](../product/decisions.md#decisions)).
- **Your own role:** nobody can change it. There's no control on your own row, and the function refuses it. So an owner who wants to step down asks another owner to change their role.
- **The last owner:** can't be demoted. The app says "Make someone else an owner first."
- **Sign-in cancelled or failed:** the owner change isn't made, and the list stays as it was.
- **Email not delivered:** the role change still stands. The failure shows in Resend's logs.
- **Offline:** the change fails with an error toast, and nothing is saved.

## Requirements and measures

| Step or problem | Linked requirement | Completion or quality measure | Instrumentation | Owner |
|---|---|---|---|---|
| 5. Role change | None yet | Every change records who changed whose role, from what, to what, and when. Owners can see these records in team settings ([DEC-011](../product/decisions.md#decisions)) | An audit record per change | Project owner |
| 5. Refused changes | None yet | Changes refused by the server, by reason | Function logs | Project owner |
| 7. Email | None yet | Role-change emails delivered | Resend delivery events | Project owner |

## Validation and changes

- Prototype or implementation: none.
- Research or acceptance evidence: NOT RUN.
- Open questions:
  1. Can managers see the audit records too?

## Completion check

- [x] The journey has a clear user, trigger, and completion condition.
- [x] Failure and alternate paths are included.
- [ ] Key steps link to requirements and a way to verify success.
