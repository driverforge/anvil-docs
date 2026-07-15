---
sidebar_position: 3
description: Build and ship Control4 drivers from a Buildkite pipeline with the driverforge Buildkite plugin.
---

# Buildkite plugin

Run `driverforge` in a Buildkite pipeline with **`driverforge/anvil-buildkite-plugin`**.
Buildkite lets you reference it with the short `driverforge/anvil` form.

:::info Preview
The `driverforge` Buildkite plugin is available today and in **preview**: while the
CLI is pre-1.0, properties may still evolve between releases. Pin your versions,
and follow along or vote on our [roadmap](https://driverforge.canny.io).
:::

## Set up the environment

Add the plugin to a step with no `command` and it installs `driverforge` onto `PATH`
before the step's own command runs:

```yaml
steps:
  - command: driverforge build -c release
    plugins:
      - driverforge/anvil#v1.0.0:
          version: '0.1.0' # pinned, or 'latest'
```

## Run a target directly

Give it a `command` and the plugin runs that target for you:

```yaml
steps:
  - plugins:
      - driverforge/anvil#v1.0.0:
          command: build
          configuration: release
          increment: true
```

## Configuration

| Property        | Description                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `version`       | The `driverforge` release to install — a pinned version (e.g. `0.1.0`) or `latest` (the default). Pin it for reproducible builds.       |
| `command`       | The `driverforge` command to run (e.g. `build`). Omit to only install the CLI onto `PATH` for the step's own command.                   |
| `project-dir`   | Driver project directory. Defaults to the checkout root; `driverforge` walks up to find `src/manifest.c4zproj`.                         |
| `configuration` | Build configuration to apply — swaps in `config.<name>.lua` (e.g. `release`, `debug`).                                            |
| `increment`     | Bump the driver version before building, per the project's [versioning scheme](/cli/versioning). Requires an initialised project. |
| `driver-version` | Stamp an exact driver `<version>` for this build — the value your release pipeline owns. Works without init; mutually exclusive with `increment`. |
| `encrypt`       | Encrypt the driver script for this build. Defaults to the configuration's entry in the [project config](/cli/build-configuration#per-configuration-defaults), then the driver's `driver.xml`; set `false` to force it off. |
| `no-suffix`     | Build a named configuration under the naked driver name — no `-<name>` artifact or `(name)` device-name suffix. Set `false` to force suffixing back on. |
| `sourcemap`     | Emit a Lua source map alongside the `.c4z`.                                                                                       |
| `unpack`        | Also leave an unpacked copy of the driver in `dist/`.                                                                             |
| `args`          | Additional raw flags passed straight through to `driverforge`.                                                                          |
| `cache-dir`     | Per-agent download cache directory (default `~/.cache/driverforge-buildkite`).                                                    |

To ship after building, set `command: deploy` or `command: sync` instead of
`build` — [`driverforge deploy`](/cli/deploy) and [`driverforge sync`](/cli/sync) are their
own commands that build first, so there is no `deploy`/`sync` property on a
`build`.

## How it works

The plugin's `environment` hook detects the agent's OS and architecture,
downloads the pinned `driverforge` release, verifies its checksum, and adds it to
`PATH` — so `driverforge` is available whether or not you set `command`. Downloads are
cached per agent under `cache-dir` (default `~/.cache/driverforge-buildkite`), keyed
by version, so a persistent agent doesn't re-download on every build.

The built `.c4z` lands in your project's `dist/` directory; collect it as a
build artifact in a later step.

:::tip Pin to a tag
Reference a released tag (e.g. `#v1.0.0`) rather than a branch so your pipeline
is reproducible and a plugin update can't change your build unexpectedly.
:::
