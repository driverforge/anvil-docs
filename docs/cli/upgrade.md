---
sidebar_position: 21
---

# upgrade

Show — and, interactively, apply — everything upgradable in the current context:
the `driverforge` CLI itself and the [Anvil Agent](/cli/agent) on the selected
controller.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
driverforge upgrade
```

## What it does

A convenience aggregator over the individual upgrade actions. It checks the CLI's
own version (advisory only — your package manager owns the binary) and the agent
on the [selected controller](/cli/device), then:

- **Interactively**, it lets you pick which available upgrades to apply and runs
  them.
- **Non-interactively** (piped, or under `CI`), it only reports what's available
  and the exact command to run, and changes nothing.

To upgrade only a controller's agent, use [`driverforge agent upgrade`](/cli/agent).

## Examples

```bash
driverforge upgrade
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
