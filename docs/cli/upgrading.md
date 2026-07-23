---
sidebar_position: 7
slug: /cli/upgrading
---

# Upgrade

`driverforge` keeps itself, the Anvil Agent, and your embedded SDK current. Here's how
the pieces fit.

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
(advisory: it prints the exact command for how you installed it), the agent, and
the embedded SDK — and applies them interactively.

## Upgrading the Anvil Agent

The [`driverforge upgrade`](/cli/upgrade) picker is how agents get upgraded: select
the **Anvil Agent** row and confirm, and the CLI updates the agent on the
[selected controller](/cli/device) to the latest release. Upgrades are
interactive-only — non-interactively, `driverforge upgrade` reports and never
mutates.

## Upgrading the SDK

The Anvil SDK is embedded in your driver, and the SDK row of the
[`driverforge upgrade`](/cli/upgrade) picker is the only way to update it. It
re-embeds the latest release; a clean git tree is required.
