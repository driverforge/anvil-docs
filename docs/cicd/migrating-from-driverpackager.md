---
sidebar_position: 4
description: Map your existing driverpackager build step to the anvil GitHub Action or Buildkite plugin.
---

# Migrating from driverpackager

If you package drivers with the `snap-one/drivers-driverpackager` action, the
`anvil` integrations replace it. `anvil build` covers most of what
driverpackager did, with a few intentional differences noted below.

:::info Preview
The `anvil` GitHub Action and Buildkite plugin are in **preview**. This page
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

# After — anvil GitHub Action
- uses: driverforge/anvil-github-action@v1
  with:
    command: build
    project-dir: ./driver
```

## Input mapping

| driverpackager input | anvil equivalent | Notes                                                                                                 |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `projectDir`         | `project-dir`    | `anvil` walks up from this directory to find `src/manifest.c4zproj`. Defaults to the checkout root.   |
| `version`            | `increment`      | Bumps the driver version (`patch` / `minor` / `major`) instead of setting an absolute version string. |
| `updateModified`     | _(automatic)_    | `anvil` always updates the driver's modified timestamp on build — there's no flag to turn it off.     |
| `c4zproj`            | _(none)_         | The manifest is always `src/manifest.c4zproj`; its path isn't configurable.                           |
| `outputDir`          | _(none)_         | The `.c4z` is always written to the project's `dist/` directory.                                      |
| `allowexecute`       | _(none)_         | There's no equivalent for enabling the Lua command window / DevLog.                                   |

## Differences to know about

`anvil` is opinionated about driver project layout, which removes a few of
driverpackager's knobs:

- **Manifest location** — `anvil` expects `src/manifest.c4zproj`. Point
  `project-dir` at the directory containing `src/` and it finds the manifest
  automatically.
- **Output location** — the `.c4z` always lands in `dist/`. Collect it from
  there as a build artifact instead of choosing an output directory.
- **`allowexecute`** — there is no equivalent today. `anvil` supports script
  **encryption** (`encrypt`), which is a different capability. If your workflow
  depends on `allowexecute`, let us know on the
  [roadmap](https://driverforge.canny.io) so we can scope it.

{/* TODO: if the CLI grows c4zproj / outputDir / allowexecute flags, update this table and drop the "none" rows. */}
