---
sidebar_position: 4
---

# anvil build

Bundle your Lua source and produce a `.c4z` driver package. Building is entirely
local — no account or controller required.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

:::tip Fast by design
`anvil` is a self-contained native binary. It runs the whole build in one
process — bundling, encryption, and packaging — instead of orchestrating the
chain of separate scripts and tools typically needed to package Control4
drivers. Builds finish in a fraction of the time, and produce a standard `.c4z`
that Composer and your controllers install and run exactly like any other.
:::

## Usage

```bash
anvil build [options]
```

Run it from a driver project — a directory with `src/manifest.c4zproj` (the CLI
walks up from the current directory to find it). The driver name comes from the
manifest; `driver.xml` and the `squishy` build file live alongside it in `src/`.

## What it does

1. Reads `src/manifest.c4zproj` to determine the driver name and contents
2. Bundles the Lua modules described by your `squishy` file into a single
   `driver.lua`
3. Stamps `driver.xml` (version, modified time) and, when configured, encrypts
   the driver script
4. Packages everything into a `.c4z` in `dist/`
5. Optionally emits a source map and/or an unpacked copy

## Options

| Option | Description |
|--------|-------------|
| `--configuration`, `-c` | Build a named configuration — swaps `src/config.<name>.lua` in as `config.lua` for this build. Omit to build the default `config.lua` as-is |
| `--increment`, `-i` | Bump the version before building. Defaults to `patch`; use `-i=minor` or `-i=major` for the others |
| `--sourcemap`, `-s` | Also emit a Lua source map (`dist/<driver>.lua.map`) |
| `--unpack`, `-u` | Also leave an unpacked copy of the package in `dist/` |
| `--encrypt` | Force script encryption on for this build (`--encrypt=false` forces it off). Default follows `driver.xml` |
| `--deploy` | After a successful build, [deploy](/cli/deploy) to the selected controller |
| `--sync` | After a successful build, [hot-swap](/cli/sync) onto the selected controller |

`--deploy` and `--sync` are mutually exclusive.

## Output

A build writes to `dist/` (always — there is no output-directory flag):

```
dist/
├── my-driver.c4z         # packaged driver
├── driver.lua.map        # source map (with --sourcemap, when the driver is squished)
└── my-driver/            # unpacked copy (with --unpack)
```

### Build configurations

`anvil build` uses your committed `src/config.lua` as the driver's configuration.
Pass `--configuration <name>` (or `-c <name>`) to swap a committed
`src/config.<name>.lua` override in for the build instead — for example
`--configuration release`. It's an opt-in system; see
[Build configuration](/cli/build-configuration) for the full picture.

**Naming.** A plain build (the default configuration) keeps the driver's naked
name (`my-driver.c4z`). A named configuration is suffixed so builds coexist —
`anvil build --configuration release` produces `my-driver-release.c4z` and adds a
`(release)` suffix to the device name in Composer.

### Versioning

Versioning is opt-in. If `driver.xml` carries a `<semver>`, `anvil` manages the
Control4 integer `<version>` from it and `--increment` bumps the semver. A
driver without a `<semver>` is built exactly as authored; `--increment` then
bumps the integer `<version>` directly. No `package.json` is involved either way.

## Examples

Basic build:

```bash
anvil build
```

Release build (swaps in `config.release.lua`) with a patch bump and a source map:

```bash
anvil build --configuration release -i -s
```

Build the release configuration and hot-swap it onto the selected controller:

```bash
anvil build -c release --sync
```

## Source maps

Build with `--sourcemap` to emit a `.map` alongside the package so Anvil can map
error stack traces back to your original source files instead of the bundled
output. See [`anvil sourcemap`](/cli/source-maps) for the details.

```bash
anvil build --sourcemap
```

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
