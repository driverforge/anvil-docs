---
sidebar_position: 9
---

# doctor

Check that a driver project still has everything [`driverforge init`](/cli/init)
set up, and restore whatever is missing.

:::warning Experimental
`driverforge doctor` is experimental. Checking is read-only and safe to run any
time, but the repairs it offers **modify files in your driver project**: they
are the same transforms [`driverforge init`](/cli/init) applies. It shows you a
per-file diff for approval and backs up edited files before writing, but always
review the changes before committing.
:::

## Usage

```bash
driverforge doctor
```

Run it from inside a driver project that has already been set up. It reports
each part of the setup individually, then, if anything is missing, proposes
the repairs and asks before writing.

## When to reach for it

Two situations, both of which look like the project has quietly stopped
working:

- **It used to build or sync, and now it doesn't.** A file was moved, an edit
  was reverted, a merge dropped a hunk.
- **Someone cloned the repo and it doesn't build for them.** The vendored SDK
  or the entry wiring didn't survive the trip: a `.gitignore` rule, an
  export, a zip that skipped a directory.

`init` sets a project up exactly once and won't touch an initialised project
again, and [`driverforge upgrade`](/cli/upgrade) only swaps the embedded SDK
for a newer one. Neither notices a project that has lost a piece of its setup.
`doctor` is the command that does.

## What it checks

Each check is reported pass or fail on its own line, so a healthy run tells you
what it verified rather than printing nothing:

| Check                                                          | What it means                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| The driver entry requires the SDK and calls `Driverforge:Init` | The lines `init` inserts into your entry Lua are still there.       |
| `src/vendor/driverforge-sdk.lua` is present                    | The embedded SDK bundle exists and isn't empty.                     |
| `manifest.c4zproj` sets `squishLua="true"`                     | The project still squishes its Lua, which is what embeds the SDK.   |
| `manifest.c4zproj` ships the vendor dir                        | The vendored SDK is included in the built `.c4z`.                   |
| squishy declares the vendored SDK module                       | The squishy names the SDK module.                                   |
| squishy declares the config module                             | The same for `config.lua`, when the project has build configurations. |

The two squishy checks matter more than they look. The squisher only preloads
modules the squishy declares, so a missing declaration isn't a cosmetic
omission; it's a driver-load error on the controller. The config module is
only checked when the project has
[build configurations](/cli/build-configuration).

A healthy project finishes here:

```
Checking this driver's Driverforge setup:
  ✓ the driver entry requires the SDK and calls Driverforge:Init
  ✓ src/vendor/driverforge-sdk.lua is present
  ✓ manifest.c4zproj sets squishLua="true"
  ✓ manifest.c4zproj ships the vendor dir
  ✓ squishy declares the vendored SDK module

Everything init sets up is in place.
```

## Repairing

When a check fails, `doctor` works out the file changes that would fix it and
shows them to you before anything is written:

```
Checking this driver's Driverforge setup:
  ✓ the driver entry requires the SDK and calls Driverforge:Init
  ✗ src/vendor/driverforge-sdk.lua is present
  ✓ manifest.c4zproj sets squishLua="true"
  ✓ manifest.c4zproj ships the vendor dir
  ✗ squishy declares the vendored SDK module
```

The repairs are the same transforms `init` uses, re-planned against your
project, not a separate repair path that could drift out of step with how a
project is set up in the first place. They're idempotent, so the parts that
already pass are left alone and only the missing pieces are proposed.

The SDK it restores is the version recorded in `.driverforge/config.json`, so a
repair puts the project back to what it claimed to be. Moving to a newer SDK
stays [`driverforge upgrade`](/cli/upgrade)'s job.

You review a per-file diff and approve it, exactly as with `init`.

## Options

| Option        | Description                                                                            |
| ------------- | -------------------------------------------------------------------------------------- |
| `--yes`, `-y` | Apply the repairs without asking. For CI and scripts, where there's nobody to confirm. |

## Network and sign-in

**Diagnosis is entirely local.** No network, no sign-in: you can run
`driverforge doctor` on a plane and get a complete answer about what's missing.

Repairs are almost all local too. The one exception is rewriting the entry Lua:
that line carries the project's driver token, and `.driverforge/config.json`
deliberately holds no secrets, so the token is fetched from your project. That
one repair needs you to be [signed in](/cli/login). Every other repair
(restoring the bundle, fixing the manifest, fixing the squishy) works offline.

So a run that only needs the bundle put back never touches the network, and a
run that needs the entry rewired will ask you to sign in first.

## When it can't help

If the project has no `.driverforge/config.json` at all, there's nothing to
diagnose against: it was never set up. `doctor` says so and points you at
[`driverforge init`](/cli/init).

If checks fail but no file change would fix them, it tells you that too rather
than reporting a success the checks plainly contradict.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
