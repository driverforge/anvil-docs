---
sidebar_position: 3
---

# Source maps

Source maps let Anvil translate stack traces from a bundled Lua driver back to
your original source files, so error reports point at real file names and line
numbers instead of the squished output.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Why source maps

When a driver is bundled with squish, many source files collapse into a single
`driver.lua`, so a runtime error like `driver.lua:1234: attempt to index a nil
value` no longer points anywhere meaningful in your code. A source map records
which bundled line came from which original file and line, so Anvil can show the
true location in your [error reports](/platform/errors).

## Generating a source map

Pass `--sourcemap` (or `-s`) to [`driverforge build`](/cli/build):

```bash
driverforge build --sourcemap
```

This writes the map next to the bundled output as `dist/<driver>.lua.map`. It
works for any squished driver — a driver that isn't squished has nothing to map,
and the step is skipped.

```bash
# A production build with a version bump and a source map
driverforge build --configuration release -i --sourcemap
```

:::info Uploading to Anvil
Generating the map is built in today. Automatic upload to Anvil — so stack
traces are translated for you — isn't part of the CLI yet; reach out to
[support@driverforge.com](mailto:support@driverforge.com) if you need it for your
workflow.
:::

## Prerequisites

Source map generation reads your `squishy` file to find the module boundaries.
This is the same file [`driverforge build`](/cli/build) uses to bundle the driver:

```lua
Module "utils.logging" "src/utils/logging.lua"
Module "utils.helpers" "src/utils/helpers.lua"
Module "driver.init"   "src/driver/init.lua"
Main "src/main.lua"
```

## Source map format

The map is a JSON document mapping bundled line numbers to original source
locations:

```json
{
  "version": 1,
  "file": "driver.lua",
  "contentHash": "…",
  "generatedAt": "…",
  "sources": [
    "src/utils/logging.lua",
    "src/utils/helpers.lua"
  ],
  "mappings": {
    "1234": { "source": 0, "line": 45 }
  }
}
```

| Field | Description |
|-------|-------------|
| `version` | Source map format version |
| `file` | Name of the bundled output file |
| `contentHash` | Hash of the bundle the map was generated against |
| `generatedAt` | When the map was generated |
| `sources` | The original source files, in bundle order |
| `mappings` | Bundled line number → `{ source index, original line }` |
