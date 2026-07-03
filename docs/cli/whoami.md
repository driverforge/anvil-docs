---
sidebar_position: 23
---

# anvil whoami

Show the currently signed-in user.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
anvil whoami
```

## What it does

Prints the user you're signed in as, refreshing the access token first if it has
expired. If you're not signed in, it tells you to run [`anvil login`](/cli/login).

## Examples

```bash
anvil whoami
```

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
