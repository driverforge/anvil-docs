---
sidebar_position: 1
---

# Installation

The Driverforge CLI (`driverforge`) is a single, dependency-free binary. Install
it with your platform's package manager, or with the install script on Linux.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## macOS

```bash
brew install driverforge/tap/driverforge
```

## Linux / WSL

```bash
curl -sSL https://releases.driverforge.com/install.sh | sh
```

## Windows

```bash
scoop bucket add driverforge https://github.com/driverforge/scoop-bucket
scoop install driverforge
```

## Verify the install

Check the install worked and see the version:

```bash
driverforge version
```

## Staying current

The CLI is owned by the package manager that installed it, so upgrades happen
the same way: `brew upgrade driverforge`, `scoop update driverforge`, or re-run
the install script. See [Upgrading](/cli/upgrading) for how the CLI, the Anvil
Agent, and the embedded SDK each stay up to date.
