---
sidebar_position: 4
description: Map your existing driverpackager build step to the driverforge GitHub Action or Buildkite plugin.
---

# Migrating from driverpackager

If you package drivers with the `snap-one/drivers-driverpackager` action, the
`driverforge` integrations replace it. Every driverpackager input has a `driverforge`
equivalent; the mapping is below.

:::info Preview
The `driverforge` GitHub Action and Buildkite plugin are in **preview**. This page
documents the planned migration — the details here may change before release.
:::

## Before and after

```yaml
# Before — driverpackager
- uses: snap-one/drivers-driverpackager@v1
  with:
    projectDir: ./driver
    c4zproj: manifest.c4zproj
    outputDir: ./dist

# After — driverforge GitHub Action
- uses: driverforge/anvil-github-action@v1
  with:
    command: build
    project-dir: ./driver
```

## Input mapping

| driverpackager input | driverforge equivalent               | Notes                                                                                                                                                                                                           |
| -------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projectDir`         | `project-dir`                  | `driverforge` walks up from this directory to find `src/manifest.c4zproj`. Defaults to the checkout root.                                                                                                             |
| `version`            | `--version` (via `args`)       | Stamps the exact `<version>` you give, persisted to `driver.xml` on success. Or use `increment: true` to bump per the project's [versioning scheme](/cli/versioning) instead of managing version strings in CI. |
| `updateModified`     | _(automatic)_                  | `driverforge` always updates the driver's modified timestamp on build — there's no flag to turn it off.                                                                                                               |
| `c4zproj`            | `--c4zproj` (via `args`)       | Path to the manifest. Defaults to `src/manifest.c4zproj`.                                                                                                                                                       |
| `outputDir`          | `--output-dir` (via `args`)    | Directory for the built `.c4z`. Defaults to the project's `dist/`.                                                                                                                                              |
| `allowexecute`       | `--allow-execute` (via `args`) | Development builds: appends `C4:AllowExecute(true)` to the built driver script, enabling Director's Lua command window. Applied to the artifact only, never written to source.                                  |

CLI flags without a dedicated action input are passed through `args`:

```yaml
- uses: driverforge/anvil-github-action@v1
  with:
    command: build
    project-dir: ./driver
    args: --c4zproj packaging/manifest.c4zproj --output-dir ./out
```

## Differences to know about

`driverforge` defaults to a conventional layout instead of requiring configuration:
the manifest at `src/manifest.c4zproj` and output in `dist/`. A project laid
out that way needs no flags at all; one that isn't can point `--c4zproj` and
`--output-dir` wherever it likes.

Two of driverpackager's inputs deserve a closer look:

- **`version`**: driverpackager set an absolute version string on every build,
  which meant your CI owned the version. `driverforge build --version` reproduces
  that exactly, but `increment: true` is usually the better migration: the
  version lives in `driver.xml`, and each release build bumps it per the
  project's [versioning scheme](/cli/versioning).
- **`allowexecute`**: `--allow-execute` enables Director's Lua command window
  in the built artifact without touching your source. Script **encryption**
  (`encrypt`) is a separate capability and unchanged.
