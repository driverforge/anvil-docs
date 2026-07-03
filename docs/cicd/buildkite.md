---
sidebar_position: 3
description: Build and ship Control4 drivers from a Buildkite pipeline with the anvil Buildkite plugin.
---

# Buildkite plugin

Run `anvil` in a Buildkite pipeline with **`driverforge/anvil-buildkite-plugin`**.
Buildkite lets you reference it with the short `driverforge/anvil` form.

:::info Preview
The `anvil` Buildkite plugin is in **preview**. This page documents the planned
interface — the shapes here may change before release. Follow along or vote on
our [roadmap](https://driverforge.canny.io).
:::

## Set up the environment

Add the plugin to a step with no `command` and it installs `anvil` onto `PATH`
before the step's own command runs:

```yaml
steps:
  - command: anvil build -c release
    plugins:
      - driverforge/anvil#v1.0.0:
          version: '1.4.0' # pinned, or 'latest'
```

## Run a target directly

Give it a `command` and the plugin runs that target for you:

```yaml
steps:
  - plugins:
      - driverforge/anvil#v1.0.0:
          command: build
          configuration: release
          increment: patch
```

## Configuration

| Property        | Description                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `version`       | The `anvil` release to install — a pinned version (e.g. `1.4.0`) or `latest` (the default). Pin it for reproducible builds. |
| `command`       | The `anvil` command to run (e.g. `build`). Omit to only install the CLI onto `PATH` for the step's own command.             |
| `project-dir`   | Driver project directory. Defaults to the checkout root; `anvil` walks up to find `src/manifest.c4zproj`.                   |
| `configuration` | Build configuration to apply — swaps in `config.<name>.lua` (e.g. `release`, `debug`).                                      |
| `increment`     | Bump the driver version before building: `patch`, `minor`, or `major`.                                                      |
| `encrypt`       | Encrypt the driver script for this build. Defaults to the driver's `driver.xml`; set `false` to force it off.               |
| `sourcemap`     | Emit a Lua source map alongside the `.c4z`.                                                                                 |
| `unpack`        | Also leave an unpacked copy of the driver in `dist/`.                                                                       |
| `deploy`        | Deploy the driver to a controller after building. Mutually exclusive with `sync`.                                           |
| `sync`          | Hot-sync the driver into the running instance after building. Mutually exclusive with `deploy`.                             |
| `args`          | Additional raw flags passed straight through to `anvil`.                                                                    |
| `cache-dir`     | Per-agent download cache directory (default `~/.cache/anvil-buildkite`).                                                    |

## How it works

The plugin's `environment` hook detects the agent's OS and architecture,
downloads the pinned `anvil` release, verifies its checksum, and adds it to
`PATH` — so `anvil` is available whether or not you set `command`. Downloads are
cached per agent under `cache-dir` (default `~/.cache/anvil-buildkite`), keyed by
version, so a persistent agent doesn't re-download on every build.

The built `.c4z` lands in your project's `dist/` directory; collect it as a
build artifact in a later step.

:::tip Pin to a tag
Reference a released tag (e.g. `#v1.0.0`) rather than a branch so your pipeline
is reproducible and a plugin update can't change your build unexpectedly.
:::
