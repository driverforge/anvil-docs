---
sidebar_position: 10
---

# agent

Manage the [Anvil Agent](/agent/overview) running on a controller. `driverforge agent`
on its own does nothing; run its subcommand.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
driverforge agent <subcommand>
```

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`) with a controller
  [selected](/cli/device) (`driverforge device select`), or named with `--device`
- The [Anvil Agent](/agent/overview) is installed and reachable on the controller

## Subcommands

### driverforge agent upgrade

Upgrade the Anvil Agent on the controller to the latest release. The CLI checks
the installed version against the latest, and — if a newer one is available —
downloads it, verifies its checksum, and deploys it. The agent restarts onto the
new build, and the CLI confirms it came back up.

:::warning
An upgrade restarts the agent. If the new build fails to start, the deploy channel
goes down with it and you'll need to reinstall the agent in Composer Pro to
recover — so the CLI asks for confirmation unless you pass `--yes`.
:::

| Option | Description |
|--------|-------------|
| `--device` | Controller to upgrade (name, hostname, or id) |
| `--select` | Re-select the target controller first |
| `--yes`, `-y` | Skip the confirmation prompt |

```bash
driverforge agent upgrade
driverforge agent upgrade --device "Plant Room" --yes
```

To update the CLI and the agent together, see [`driverforge upgrade`](/cli/upgrade).

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
