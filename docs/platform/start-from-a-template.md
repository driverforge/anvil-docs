---
description: Create a new Control4 driver from a template with driverforge new and start seeing its telemetry in Anvil.
---

# Start a driver from a template

Starting a new driver? `driverforge new` creates the project from a template
with the Driverforge SDK already set up, so the driver sends telemetry from
its first deploy. To add Anvil to a driver you already have, follow the
[Quick start](/platform/quick-start) instead.

## Prerequisites

- **Control4 OS 3.3.1 or newer** on the controller you'll deploy to
- The [Anvil Agent installed](/agent/installation) on that controller
- The [`driverforge` CLI installed](/cli/installation)
- An [Anvil](https://dev.driverforge.com) account

## 1. Sign in

```bash
driverforge login
```

## 2. Create the driver

```bash
driverforge new my-driver
```

[`new`](/cli/new) creates `./my-driver` from the official template, then
asks which Anvil project the driver reports to (an existing one, or a new one
it creates), how to version it, and whether to add build configurations and
forward logs.

When it finishes it prints a link to the project in Anvil and offers to open
it. That page shows the remaining steps below and moves on to your data as
soon as the first telemetry arrives.

## 3. Deploy it

```bash
cd my-driver
driverforge device select
driverforge deploy
```

[`device select`](/cli/device) picks the controller to target.
[`deploy`](/cli/deploy) builds the driver, sends it to the agent on that
controller, and loads it.

## 4. Watch the telemetry

Telemetry starts when the driver loads on the controller. Follow it from the
terminal:

```bash
driverforge events --follow
```

or open the project in [Anvil](https://dev.driverforge.com) to see
[events](/platform/events), [logs](/platform/logs) and
[errors](/platform/errors) as they arrive.

## Next steps

- Start from your own templates with [`--repo`](/cli/new#--repo), and
  [write them](/cli/templates)
- Learn about [automatic event capture](/sdk/automatic-capture)
- Let a [coding agent](/coding-agents/overview) read your telemetry and work on the driver with you
