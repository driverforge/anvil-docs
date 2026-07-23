---
sidebar_position: 1
---

# Installation

The Driverforge CLI (`driverforge`) is a single, dependency-free binary. Install
it with your platform's package manager, or with the install script on Linux.

## macOS

```bash
brew tap driverforge/tap
brew install driverforge
```

Homebrew (6.0 and later) refuses to install from a third-party tap until you
explicitly trust it — this is standard for all non-official taps, not specific
to Driverforge. When brew asks, review the tap and trust it:

```bash
brew trust driverforge/tap
```

then re-run `brew install driverforge`. Trusting records your one-time consent
to install packages from our tap. What you're trusting is
[`driverforge/homebrew-tap`](https://github.com/driverforge/homebrew-tap) — it
contains only the machine-generated cask, updated automatically on each
release, and the binaries it installs are downloaded from
`releases.driverforge.com`.

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
