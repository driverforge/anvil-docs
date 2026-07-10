---
sidebar_position: 7
slug: /cli/upgrading
---

# Upgrade

`driverforge` keeps itself, the Anvil Agent, and your embedded SDK current. Here's how
the pieces fit.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Update notices

After a command runs, the CLI checks — at most once a day, cached — whether a
newer `driverforge` release is available, and prints a one-line notice if so. It's quiet
by design: the notice goes to stderr, never stdout, and never appears in CI or
non-interactive shells. Turn it off with `--no-update-check`.

## Upgrading the CLI

`driverforge` is installed by a package manager, which owns the binary — so you upgrade
it the same way you installed it:

```bash
brew upgrade driverforge      # macOS
scoop update driverforge      # Windows
# Linux / WSL: re-run the install script
```

[`driverforge upgrade`](/cli/upgrade) shows everything upgradable in one place — the CLI
(advisory: it prints the exact command for how you installed it) and the agent —
and applies them interactively.

## Upgrading the Anvil Agent

[`driverforge agent upgrade`](/cli/agent) updates the [Anvil Agent](/agent/overview) on
the selected controller to the latest release.

## Upgrading the SDK

The Anvil SDK is embedded in your driver. Re-run
[`driverforge init --sdk-version <x.y.z>`](/cli/init) to re-embed a different SDK build.
