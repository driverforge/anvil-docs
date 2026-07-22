---
sidebar_position: 6
---

# device

Manage the active deploy target — the Control4 controller that [`deploy`](/cli/deploy),
[`sync`](/cli/sync), and [`upgrade`](/cli/upgrade) act on. The CLI remembers it so you
don't pass it every time. `driverforge device` on its own does nothing; run one of its
subcommands.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
driverforge device <subcommand>
```

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`) with an [organization](/cli/org)
  selected (`driverforge org select`)

## Subcommands

### driverforge device list

List the controllers registered to your active organization; `*` marks the
selected one. A controller registers itself when the [Anvil Agent](/agent/overview)
is installed on it.

```bash
driverforge device list
```

### driverforge device select [name|id]

Choose the active controller. Matches its friendly name, hostname, Control4 device
id, or id — or shows a picker when given no argument. Only **active** controllers
can be selected, and selecting one pins its TLS certificate fingerprint so later
deploys verify they're talking to the right controller.

```bash
driverforge device select "Living Room Controller"
```

### driverforge device show

Print the active controller.

```bash
driverforge device show
```

See [Organizations & devices](/cli/context) for how the deploy target is resolved.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
