---
sidebar_position: 8
---

# init

Set up Anvil in an existing Control4 driver project — embed the SDK, wrap
`OnDriverInit`, link an Anvil project, and (optionally) add a build config.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

:::warning Experimental
`driverforge init` is experimental, and it **modifies files in your driver project** —
that's the point: it embeds the SDK, wraps `OnDriverInit`, and writes config. It
shows you a per-file diff for approval and backs up edited files before writing,
but always review the changes before committing.
:::

## Usage

```bash
driverforge init [--sdk-version <x.y.z>]
```

Run it from inside an existing driver project — a directory with
`src/manifest.c4zproj`. It's interactive, so run it in a real terminal.

## Prerequisites

- An existing Control4 driver project
- You're [signed in](/cli/login) (`driverforge login`) with an
  [organization selected](/cli/org) (`driverforge org select`)

## What it does

`driverforge init` retrofits your driver for Anvil, walking you through:

1. **Embedding the Anvil SDK** into your project (under `src/vendor/`), at the
   latest version or the one you pass to `--sdk-version`.
2. **Wrapping your driver's `OnDriverInit`** so Anvil initializes when the driver
   loads.
3. **Linking an Anvil project** — pick an existing one or create a new one — and
   provisioning an [API key](/security/api-keys).
4. **Choosing a [versioning scheme](/cli/versioning)** — date-based for new
   drivers; for an existing driver the wizard inspects the current `<version>`,
   proposes the matching scheme (date-shaped stays date, anything else becomes
   an incrementing integer), and states the choice before writing it. The
   scheme is what `--increment` and the ship commands bump with.
5. **Optionally setting up a [build config](/cli/build-configuration)** — a
   committed `src/config.lua` (your default configuration) plus a
   `src/config.release.lua` override, loaded by your driver via `require('config')`
   and swapped per build with [`driverforge build --configuration`](/cli/build). These
   are committed and hold no secrets (your Anvil key is inlined in the driver, not
   in config).
6. **Detecting a logger** in your entry file to forward log output from.
7. **Writing `.driverforge/config`** — a committed record of the integration
   (including your versioning scheme), with no secrets in it.

Initialising is also what unlocks version management and the ship commands:
[`sync`](/cli/sync) and [`deploy`](/cli/deploy) require an initialised project,
and `build --increment` needs the versioning scheme recorded here.

## Review before anything is written

Before changing a single file, `driverforge init` shows you a **per-file diff of every
proposed change** and asks for approval. If your project is a git repository, it
offers to create a branch first. Edited files are backed up to `<file>.bak` while writing,
and the changes are applied atomically — if anything fails, it rolls back.

## Options

| Option          | Description                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| `--project`     | Link a specific Anvil project without prompting — `<org-slug>/<project-slug>` (or just a project slug). |
| `--sdk-version` | The Anvil SDK version to embed (e.g. `1.0.0`). Defaults to the latest.                                  |

## Updating the SDK

Run `driverforge init` again in an already-initialized project to see its current
setup, or `driverforge init --sdk-version <x.y.z>` to re-embed a different SDK build.

## After setup

```bash
driverforge deploy
```

If you set up a build config, review the committed `src/config.lua` (and any
`src/config.<name>.lua` override), and build a named configuration with
[`driverforge build --configuration release`](/cli/build). It's also worth reviewing the
wrapped `OnDriverInit` in your driver's entry file.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
