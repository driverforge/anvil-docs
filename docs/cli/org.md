---
sidebar_position: 19
---

# org

Manage the active organization — the workspace your projects, devices, and billing
belong to. The CLI remembers it so the deploy commands don't need it every time.
`driverforge org` on its own does nothing; run one of its subcommands.

## Usage

```bash
driverforge org <subcommand>
```

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)

## Subcommands

### driverforge org list

List the organizations you can access; `*` marks the active one.

```bash
driverforge org list
```

### driverforge org select [name|slug|id]

Switch the active organization. Matches a slug, id, or exact name — or shows a
picker when given no argument.

```bash
driverforge org select acme
```

### driverforge org show

Print the active organization.

```bash
driverforge org show
```

See [Organizations & devices](/cli/context) for how the active org and device fit
together.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
