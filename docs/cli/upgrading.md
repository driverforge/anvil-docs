---
sidebar_position: 7
slug: /cli/upgrading
---

# Upgrade

`driverforge` keeps itself, the Anvil Agent, and your embedded SDK current. Here's how
the pieces fit.

## Update notices

After a command runs, the CLI checks (at most once a day, cached) whether a
newer `driverforge` release is available, and prints a one-line notice if so. It's quiet
by design: the notice goes to stderr, never stdout, and never appears in CI or
non-interactive shells. Turn it off with `--no-update-check`.

## Upgrading the CLI

Select **driverforge CLI** in [`driverforge upgrade`](/cli/upgrade) to verify and
replace the installed binary. This requires a writable installation location;
the new version runs on your next command. You can also update it through your
original installation method:

```bash
brew upgrade driverforge      # macOS
scoop update driverforge      # Windows

# Linux / WSL: re-run the install script
sh -c "$(curl -fsSL https://go.driverforge.com/get)"
```

[`driverforge upgrade`](/cli/upgrade) shows everything upgradable in one place: the CLI
itself, the agent, and the embedded SDK. It applies selected upgrades
interactively. If the CLI cannot update itself, it provides the command for your
installation method.

## Upgrading the Anvil Agent

The [`driverforge upgrade`](/cli/upgrade) picker is how agents get upgraded: select
the **Anvil Agent** row and confirm, and the CLI updates the agent on the
[selected controller](/cli/device) to the latest release. Upgrades are
interactive-only: non-interactively, `driverforge upgrade` reports and never
mutates.

## Upgrading the SDK

The Driverforge SDK is embedded in your driver, and the SDK row of the
[`driverforge upgrade`](/cli/upgrade) picker is the only way to update it. It
re-embeds the latest release. With a dirty git tree, the update is visible but
cannot be selected; commit or stash your changes first.

In a git repository with an existing commit, the SDK upgrade offers two optional
steps, just like `init`: create a branch (default `driverforge-sdk-<version>`,
such as `driverforge-sdk-0.9.2`), then supply a commit message. The suggested
message is `chore: update Driverforge SDK to <version>`; clear it to leave the
changes uncommitted. Declining the branch keeps the update on your current branch
without committing it.

An upgrade that would make no file changes skips both prompts. See the
[branch and commit prompts](/cli/upgrade#sdk-branch-and-commit-prompts) for details.
