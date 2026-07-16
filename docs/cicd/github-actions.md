---
sidebar_position: 2
description: Build and ship Control4 drivers from a GitHub Actions workflow with the driverforge GitHub Action.
---

# GitHub Action

Run `driverforge` in a GitHub Actions workflow with **`driverforge/driverforge-github-action`**.

:::info Preview
The `driverforge` GitHub Action is available today and in **preview**: while the
CLI is pre-1.0, inputs may still evolve between releases. Pin your versions, and
follow along or vote on our [roadmap](https://driverforge.canny.io).
:::

## Set up the environment

Reference the action with no `command` to install `driverforge` and leave it on
`PATH` for the rest of the job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: driverforge/driverforge-github-action@v1
        with:
          version: '%%CLI_VERSION%%' # pinned, or 'latest'
      - run: driverforge build -c release
```

## Run a target directly

Pass a `command` and the action runs it for you in one step — a drop-in for a
dedicated packaging action:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: driverforge/driverforge-github-action@v1
    with:
      command: build
      project-dir: ./driver
      configuration: release
      increment: true
```

## Release builds

A release pipeline usually owns the exact version and ships the artifact under
the plain driver name. `driver-version` stamps the `<version>` your release
computed, `encrypt` turns script encryption on, and `no-suffix` drops the
`-<configuration>` artifact suffix and the `(configuration)` device-name
decoration:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: driverforge/driverforge-github-action@v1
    with:
      command: build
      project-dir: ./driver
      configuration: release
      driver-version: '2026071501'
      encrypt: true
      no-suffix: true
```

## Inputs

| Input           | Description                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `version`       | The `driverforge` release to install — a pinned version (e.g. `%%CLI_VERSION%%`) or `latest` (the default). Pin it for reproducible builds.       |
| `command`       | The `driverforge` command to run (e.g. `build`). Omit to only install the CLI onto `PATH`.                                              |
| `project-dir`   | Driver project directory. Defaults to the workspace root; `driverforge` walks up to find `src/manifest.c4zproj`.                        |
| `configuration` | Build configuration to apply — swaps in `config.<name>.lua` (e.g. `release`, `debug`).                                            |
| `increment`     | Bump the driver version before building, per the project's [versioning scheme](/cli/versioning). Requires an initialised project. |
| `driver-version` | Stamp an exact driver `<version>` for this build — the value your release pipeline owns. Works without init; mutually exclusive with `increment`. |
| `encrypt`       | Encrypt the driver script for this build. Defaults to the configuration's entry in the [project config](/cli/build-configuration#per-configuration-defaults), then the driver's `driver.xml`; set `false` to force it off. |
| `no-suffix`     | Build a named configuration under the naked driver name — no `-<name>` artifact or `(name)` device-name suffix. Set `false` to force suffixing back on. |
| `sourcemap`     | Emit a Lua source map alongside the `.c4z`.                                                                                       |
| `unpack`        | Also leave an unpacked copy of the driver in `dist/`.                                                                             |
| `args`          | Additional raw flags passed straight through to `driverforge`, for anything not covered above.                                          |
| `github-token`  | Reserved for future use. Release binaries download from public storage, so no token is required today.                            |

To ship after building, set `command: deploy` or `command: sync` instead of
`build` — [`driverforge deploy`](/cli/deploy) and [`driverforge sync`](/cli/sync) are their
own commands that build first, so there is no `deploy`/`sync` input on a
`build`.

## Outputs

| Output             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `version`          | The resolved `driverforge` version that was installed. |
| `driverforge-path` | Absolute path to the installed `driverforge` binary.   |

## How it works

The action detects the runner's OS and architecture, downloads the pinned
`driverforge` release, verifies its checksum, and adds it to `PATH`. It caches the
binary in the runner's tool-cache directory (`driverforge/<version>/<arch>`), so
repeat runs on the same version don't re-download. If you set `command`, it
then runs `driverforge <command>` with the inputs above.

The built `.c4z` lands in your project's `dist/` directory — upload it with
`actions/upload-artifact` or attach it to a release as a later step.
