---
sidebar_position: 11
description: View and manage the Control4 controllers registered to your organization.
---

import Screenshot from '@site/src/components/Screenshot';

# Devices

A **device** is a Control4 controller that's registered to your organization. A
controller registers itself when the [Anvil Agent](/agent/overview) is installed
on it, and from then on it's a target you can deploy drivers to with the
[CLI](/cli/deploy).

:::tip
Managing devices requires the **owner** or **admin** role.
:::

## The Devices page

The organization-level **Devices** page lists every controller registered to your
organization, with its name, address, and status (for example **Active** or
**Revoked**). The [`anvil device`](/cli/context) commands work against this same
list — `anvil device list` shows these controllers and `anvil device select`
chooses which one the CLI deploys to.

<Screenshot name="devices" alt="The Devices page listing controllers with their status and the per-device actions menu." />

## Renaming a device

Controllers register with a system-generated name; give yours something
memorable.

1. On the **Devices** page, open the **⋯** menu for the device and choose
   **Rename**.
2. Enter a new name and save.

## Revoking a device

Revoking cuts off a controller's access — it can no longer send telemetry or
accept deploys until it re-registers.

1. Open the **⋯** menu for the device and choose **Revoke device**.
2. Confirm in the dialog.

A revoked controller shows a **Revoked** status. You can **Remove** a revoked
device to delete it from the list entirely.

## Device limits

Your [plan](/platform/plans) sets how many active controllers your organization
can have. If you hit the limit, revoke a controller you no longer use or
[upgrade](/platform/subscription).

## Further reading

- [Anvil Agent](/agent/overview) — how a controller registers and what the agent does
- [`anvil device`](/cli/context) — selecting the deploy target from the CLI
- [`anvil deploy`](/cli/deploy) / [`anvil sync`](/cli/sync) — pushing drivers to a controller
