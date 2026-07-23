---
sidebar_position: 6
---

# sync

Build your driver and hot-swap its Lua into the running instance on a
controller: fast, with no full reload. Ideal for tight edit-test loops while
developing.

## Usage

```bash
driverforge sync [options]
```

`sync` builds first (respecting `-c/--configuration`, including the
configuration's [defaults](/cli/build-configuration#per-configuration-defaults)
from the project config), then ships the bundled
Lua to the [Anvil Agent](/agent/overview), which swaps it into the
already-loaded driver. What you sync is always your current source: there is no
stale artifact to forget about. Because it skips the install-and-reload cycle a
full [`deploy`](/cli/deploy) does, it's much faster, but it only applies when
the driver's structure hasn't changed. A sync never changes the driver's
[version](/cli/versioning).

## Prerequisites

- The project is [initialised](/cli/init) (`driverforge init`)
- You're [signed in](/cli/login) (`driverforge login`)
- A target controller is [selected](/cli/device) (`driverforge device select`)
- The [Anvil Agent](/agent/overview) is installed and running on the controller
- The driver is already installed on the controller — [`deploy`](/cli/deploy) it
  once first so there's a running instance to hot-swap into

## When sync applies — and when it doesn't

Sync only hot-swaps when `driver.xml` is **structurally unchanged** since the
running build (same actions, properties, commands, connections, etc.). If you've
changed any of that, a full reload is required and `sync` will offer to run a
[`deploy`](/cli/deploy) for you (or do it directly with `--deploy`). The
escalation runs the full deploy flow, rebuild and
[version bump](/cli/versioning) included.

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

| Option                  | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| `--device`              | Controller to sync to (name, hostname, or id) — overrides the selected one |
| `--select`              | Re-select the target controller first                                      |
| `--configuration`, `-c` | Build configuration to build and sync                                      |
| `--deploy`              | Do a full [deploy](/cli/deploy) instead of a hot-swap                      |

## Examples

Build and hot-swap onto the selected controller:

```bash
driverforge sync
```

Build and sync the `release` configuration:

```bash
driverforge sync -c release
```

Force a full deploy instead:

```bash
driverforge sync --deploy
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
