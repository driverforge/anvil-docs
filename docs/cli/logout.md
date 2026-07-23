---
sidebar_position: 18
---

# logout

Log out and remove your stored Driverforge credentials.

## Usage

```bash
driverforge logout
```

## What it does

Revokes the stored credentials and clears your saved [organization](/cli/org) and
[device](/cli/device) context. It's safe to run when you're already signed out.

## Examples

```bash
driverforge logout
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
