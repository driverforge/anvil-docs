---
sidebar_position: 19
---

# anvil org

Manage the active organization — the workspace your projects, devices, and billing
belong to. The CLI remembers it so the deploy commands don't need it every time.
`anvil org` on its own does nothing; run one of its subcommands.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
anvil org <subcommand>
```

## Prerequisites

- You're [signed in](/cli/login) (`anvil login`)

## Subcommands

### anvil org list

List the organizations you can access; `*` marks the active one.

```bash
anvil org list
```

### anvil org select [name|slug|id]

Switch the active organization. Matches a slug, id, or exact name — or shows a
picker when given no argument.

```bash
anvil org select acme
```

### anvil org show

Print the active organization.

```bash
anvil org show
```

See [Organizations & devices](/cli/context) for how the active org and device fit
together.

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
