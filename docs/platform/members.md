---
sidebar_position: 3
description: Invite people to your organization and control what they can do with owner, admin, and member roles.
---

import Screenshot from '@site/src/components/Screenshot';

# Members & roles

Invite people to your organization and control what they can do. Member
management lives under **Settings → Members**.

:::tip
Inviting, removing, and re-roling members requires the **owner** or **admin**
role. Members can see the organization's projects but can't manage other people.
:::

## Roles

Every member has one of three roles:

| Role | Can do |
|------|--------|
| **Owner** | Everything — including managing billing and subscriptions, managing all members and roles, and deleting the organization. |
| **Admin** | Invite and remove members, create and manage projects, and access all projects. |
| **Member** | Access the organization's projects. |

An organization can have several owners, but there must always be at least one.

<Screenshot name="members" alt="The Members settings page, showing Current Members and the Invite Member form." />

## Inviting a member

1. Go to **Settings → Members** and click **Invite Member**.
2. Enter the person's **email address**.
3. Choose a **role** (Member, Admin, or Owner) from the dropdown. The default is
   Member.
4. Click **Send Invite**.

The invitation is emailed to that address and appears under **Invited Members**.

- Invitations expire after **7 days**.
- The invitee doesn't need an Anvil account yet — they'll be prompted to create
  one when they accept.

:::note
If you've reached your [plan](/platform/plans)'s member limit, the invite form is
replaced by an upgrade prompt. See [Subscription](/platform/subscription) to add
seats or change plans.
:::

### Managing pending invitations

Under **Invited Members**, each pending invitation can be:

- **Resend** — send a fresh email and reset the 7-day expiry.
- **Revoke** — cancel the invitation so the link no longer works.

## Changing a member's role

1. Go to **Settings → Members**.
2. Open the **⋯** menu next to the member and choose **Change Role**.
3. Pick the new role — you'll see what each role can do — and confirm.

## Removing a member

1. Open the **⋯** menu next to the member and choose **Remove**.
2. Confirm the removal.

## Rules that keep things safe

- You can't manage members with the same or higher privilege than your own role —
  an admin can't change or remove an owner, for instance.
- You can't remove or demote the **last owner**; promote someone else to owner
  first.

## Further reading

- [Managing your organization](/platform/organizations) — general settings and deletion
- [Subscription](/platform/subscription) — member limits and adding seats
