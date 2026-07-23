---
sidebar_position: 4
---

# build

Bundle your Lua source and produce a `.c4z` driver package. Building is entirely
local — no account or controller required.

:::tip Fast by design
`driverforge` is a self-contained native binary. It runs the whole build in one
process — bundling, encryption, and packaging — instead of orchestrating the
chain of separate scripts and tools typically needed to package Control4
drivers. Builds finish in a fraction of the time, and produce a standard `.c4z`
that Composer and your controllers install and run exactly like any other.
:::

## Usage

```bash
driverforge build [options]
```

Run it from a driver project — a directory with `src/manifest.c4zproj` (the CLI
walks up from the current directory to find it, or point `--c4zproj` at a
manifest elsewhere). The driver name comes from the manifest; `driver.xml` and
the `squishy` build file live alongside it in `src/`.

## What it does

1. Reads `src/manifest.c4zproj` to determine the driver name and contents
2. Bundles the Lua modules described by your `squishy` file into a single
   `driver.lua`
3. Stamps `driver.xml` (modified time, plus the version when you ask for a
   bump) and, when configured, encrypts the driver script
4. Packages everything into a `.c4z` in `dist/`
5. Optionally emits a source map and/or an unpacked copy

## Options

| Option                  | Description                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--configuration`, `-c` | Build a named configuration — swaps `src/config.<name>.lua` in as `config.lua` for this build. Omit to build the default `config.lua` as-is                                 |
| `--increment`, `-i`     | Bump the version per the project's [versioning scheme](/cli/versioning) before building. Requires an [initialised](/cli/init) project                                       |
| `--version`             | Stamp an exact `<version>` for this build, persisted to `driver.xml` on success. Works without init; mutually exclusive with `--increment`                                  |
| `--c4zproj`             | Path to the `.c4zproj` manifest (default `src/manifest.c4zproj`)                                                                                                            |
| `--output-dir`, `-o`    | Directory for the built `.c4z` (default `dist/`)                                                                                                                            |
| `--sourcemap`, `-s`     | Also emit a Lua source map (`dist/<driver>.lua.map`)                                                                                                                        |
| `--unpack`, `-u`        | Also leave an unpacked copy of the package in `dist/`                                                                                                                       |
| `--encrypt`             | Force script encryption on for this build (`--encrypt=false` forces it off). Default follows the configuration's entry in the project config, then `driver.xml`             |
| `--no-suffix`           | Build a named configuration under the naked driver name — no `-<name>` artifact or `(name)` device-name suffix (`--no-suffix=false` forces suffixing back on)               |
| `--allow-execute`       | Development build: append `C4:AllowExecute(true)` to the built driver script, enabling Director's Lua command window. Applied to the artifact only, never written to source |

Shipping is its own command now: [`driverforge sync`](/cli/sync) and [`driverforge deploy`](/cli/deploy) each build first, so there is no `build --sync` or `build --deploy`.

## Output

A build writes to `dist/` (or the directory you pass with `-o/--output-dir`):

```
dist/
├── my-driver.c4z         # packaged driver
├── driver.lua.map        # source map (with --sourcemap, when the driver is squished)
└── my-driver/            # unpacked copy (with --unpack)
```

### Build configurations

`driverforge build` uses your committed `src/config.lua` as the driver's configuration.
Pass `--configuration <name>` (or `-c <name>`) to swap a committed
`src/config.<name>.lua` override in for the build instead — for example
`--configuration release`. It's an opt-in system; see
[Build configuration](/cli/build-configuration) for the full picture.

**Naming.** A plain build (the default configuration) keeps the driver's naked
name (`my-driver.c4z`). A named configuration is suffixed so builds coexist —
`driverforge build --configuration release` produces `my-driver-release.c4z` and adds a
`(release)` suffix to the device name in Composer. A release configuration can
opt out of the suffixes — `--no-suffix`, or `"suffix": false` in the project
config — to ship under the naked name; see
[Per-configuration defaults](/cli/build-configuration#per-configuration-defaults).

**Per-configuration defaults.** An [initialised](/cli/init) project can set
encryption and naming defaults per configuration in `.driverforge/config.json`,
so `driverforge build -c release` alone produces the final release artifact. Flags
always override the config. See
[Per-configuration defaults](/cli/build-configuration#per-configuration-defaults).

### Versioning

A plain build never touches the driver's `<version>`: what's authored is what
ships. Pass `--increment` to bump it per the project's versioning scheme, or
`--version` to stamp an exact value. See [Versioning](/cli/versioning) for the
schemes and the full picture of when versions change.

## Examples

Basic build:

```bash
driverforge build
```

Release build (swaps in `config.release.lua`) with a version bump and a source map:

```bash
driverforge build --configuration release -i -s
```

Full release artifact — encrypted, naked name — with no config file, using
flags alone (or set these once per configuration in the
[project config](/cli/build-configuration#per-configuration-defaults) and drop
the flags):

```bash
driverforge build -c release --encrypt --no-suffix
```

Build with the manifest and output directory somewhere non-standard:

```bash
driverforge build --c4zproj packaging/manifest.c4zproj -o build/out
```

## Source maps

Build with `--sourcemap` to emit a `.map` alongside the package so Anvil can map
error stack traces back to your original source files instead of the bundled
output. See [`driverforge sourcemap`](/cli/source-maps) for the details.

```bash
driverforge build --sourcemap
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
