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
explicitly trust it; this is standard for all non-official taps, not specific
to Driverforge. When brew asks, review the tap and trust it:

```bash
brew trust driverforge/tap
```

then re-run `brew install driverforge`. Trusting records your one-time consent
to install packages from our tap. What you're trusting is
[`driverforge/homebrew-tap`](https://github.com/driverforge/homebrew-tap): it
contains only the machine-generated cask, updated automatically on each
release, and the binaries it installs are downloaded from
`releases.driverforge.com`.

## Linux / WSL

```bash
sh -c "$(curl -fsSL https://go.driverforge.com/get)"
```

The installer names the release it found and the directory it will write to,
then asks before installing anything. It verifies the download against a signed
release manifest and stops if the signature or the checksum does not match, so a
failed check never leaves a partial install behind. It finishes by pointing you
at [`driverforge login`](/cli/login) and [`driverforge init`](/cli/init).

Note the shape of the command: `curl` runs inside `$(...)` so the whole script
is downloaded before a single line of it executes, and stdin stays attached to
your terminal so the installer's prompts have somewhere to read from. Piping
into `sh` gives up both. Keep `-f` as well, or curl hands an HTTP error page to
the shell to run.

Two variables change what gets installed and where. Both go before the command:

```bash
DRIVERFORGE_VERSION=0.5.1 sh -c "$(curl -fsSL https://go.driverforge.com/get)"
DRIVERFORGE_INSTALL_DIR=$HOME/.local/bin sh -c "$(curl -fsSL https://go.driverforge.com/get)"
```

Without a terminal, in CI or under a script driving the install, the prompts are
skipped and every default is taken. Set `DRIVERFORGE_NONINTERACTIVE=1` to force
that even when a terminal is present.

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
