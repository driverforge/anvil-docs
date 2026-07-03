---
sidebar_position: 4
description: Create and manage projects — each one a single driver's stream of events, logs, and errors.
---

import Screenshot from '@site/src/components/Screenshot';

# Managing projects

A **project** is where a driver's telemetry lives. Each project has its own
[events, logs, and errors](/platform/overview), its own
[API keys](/security/api-keys), and its own settings. Most teams use one project
per driver, often with separate projects for development and production. You can
create as many projects as your [plan](/platform/plans) allows.

:::tip
Creating and managing projects requires the **owner** or **admin** role in the
organization. See [Members & roles](/platform/members).
:::

## Creating a project

<Screenshot name="create-project" alt="The Create New Project drawer, showing the platform selector and the name and description fields." />

1. Open the **Projects** page from the sidebar, then click **New Project**. (If
   the organization has no projects yet, click **Create your first project** on
   the empty Projects page instead.)
2. Select the **platform** your driver targets. Control4 is supported today;
   selecting another platform shows a "coming soon" notice.
3. Type a **Project Name**. This is how the project appears throughout Anvil — you
   can change it later.
4. Optionally add a **Description** to remind you and your team what the project
   is for.
5. Click **Create Project**.

When the project is created, Anvil:

- generates a **Default API Key** so you can start sending telemetry immediately
  (see [API Keys](/security/api-keys)),
- makes you the project's **owner**, and
- opens the new project's dashboard, which shows setup instructions until the
  first data arrives.

From there, follow the [Quick Start](/getting-started/quick-start) to wire the SDK
into your driver and send your first events.

:::note
Your [plan](/platform/plans) sets how many projects an organization can have. If
you've reached the limit, you'll be prompted to upgrade instead of creating
another.
:::

## Finding and switching projects

The **Projects** page lists every project in the organization, each with a
sparkline of its recent activity so you can see at a glance which drivers are
busy. Click any project to open its dashboard.

To move between projects from anywhere in the app, use the **project switcher** at
the top of the sidebar — it also has a shortcut to create a new project.

## Editing project settings

Open a project and go to **Settings → General** (owners and admins). Here you can:

- **Project Name** — rename the project.
- **Project Slug** — change the short identifier used in the project's URLs
  (lowercase letters, numbers, and hyphens). Changing it updates the project's
  URLs; Anvil redirects you to the new one.
- **Description** — update the optional description.

Click **Save Changes** to apply.

## Deleting a project

1. In the project, go to **Settings → General**.
2. Scroll to the **Danger Zone** and click **Delete this project**.
3. In the confirmation dialog, type the project's name exactly, then confirm.

:::warning
Deleting a project is permanent. Its events, logs, errors, and API keys are
removed and can't be recovered. Migrate or export anything you still need first.
:::

## API keys

Every project has one or more API keys your driver uses to send telemetry. Manage
them under **Settings → API Keys** — see [API Keys](/security/api-keys) for how
they work and how to create, view, and revoke them.

## Further reading

- [Quick Start](/getting-started/quick-start) — wire the SDK into your driver and send your first events
- [API Keys](/security/api-keys) — how project ingestion keys work
- [Members & roles](/platform/members) — who can create and manage projects
- [Plans](/platform/plans) — project limits by plan
