---
sidebar_position: 6
---

# anvil sync

Hot-swap a driver's Lua into the running instance on a controller — fast, with
no full reload. Ideal for tight edit-build-test loops while developing.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
anvil sync [options]
```

`sync` ships just the bundled Lua to the [Anvil Agent](/agent/overview), which
swaps it into the already-loaded driver. Because it skips the install-and-reload
cycle a full [`deploy`](/cli/deploy) does, it's much faster — but it only applies
when the driver's structure hasn't changed.

## Prerequisites

- You're [signed in](/cli/login) (`anvil login`)
- A target controller is [selected](/cli/device) (`anvil device select`)
- The driver has been built (`anvil build`) — or use `anvil build --sync` to do
  both at once
- The [Anvil Agent](/agent/overview) is installed and running on the controller
- The driver is already installed on the controller — [`deploy`](/cli/deploy) it
  once first so there's a running instance to hot-swap into

## When sync applies — and when it doesn't

Sync only hot-swaps when `driver.xml` is **structurally unchanged** since the
running build (same actions, properties, commands, connections, etc.). If you've
changed any of that, a full reload is required and `sync` will offer to run a
[`deploy`](/cli/deploy) for you (or do it directly with `--deploy`).

Keep these in mind:

- **Load-time init doesn't re-run.** Sync re-runs top-level Lua but not
  `OnDriverInit` / `OnDriverLateInit`, so keep load-time initialization
  idempotent if you rely on it during development.
- **Encrypted drivers can't be hot-swapped.** The Anvil Agent can't update an
  encrypted driver's contents in place. Build unencrypted during development to
  take advantage of hot reloading with `sync`; to update an encrypted driver,
  use [`deploy`](/cli/deploy), which installs the new version and reloads it in
  full. (An encrypted build passed to `sync` falls back to a deploy
  automatically.)

## Options

| Option | Description |
|--------|-------------|
| `--device` | Controller to sync to (name, hostname, or id) — overrides the selected one |
| `--select` | Re-select the target controller first |
| `--configuration`, `-c` | Build configuration of the artifact to sync (the `anvil build --configuration` you used) |
| `--deploy` | Do a full [deploy](/cli/deploy) instead of a hot-swap |

## Examples

Hot-swap the latest build onto the selected controller:

```bash
anvil sync
```

Build and sync in one step:

```bash
anvil build --sync
```

Force a full deploy instead:

```bash
anvil sync --deploy
```

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
