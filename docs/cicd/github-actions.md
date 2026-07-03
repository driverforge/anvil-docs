---
sidebar_position: 2
description: Build and ship Control4 drivers from a GitHub Actions workflow with the anvil GitHub Action.
---

# GitHub Action

Run `anvil` in a GitHub Actions workflow with **`driverforge/anvil-github-action`**.

:::info Preview
The `anvil` GitHub Action is in **preview**. This page documents the planned
interface — the shapes here may change before release. Follow along or vote on
our [roadmap](https://driverforge.canny.io).
:::

## Set up the environment

Reference the action with no `command` to install `anvil` and leave it on
`PATH` for the rest of the job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: driverforge/anvil-github-action@v1
        with:
          version: '1.4.0' # pinned, or 'latest'
      - run: anvil build -c release
```

## Run a target directly

Pass a `command` and the action runs it for you in one step — a drop-in for a
dedicated packaging action:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: driverforge/anvil-github-action@v1
    with:
      command: build
      project-dir: ./driver
      configuration: release
      increment: patch
```

## Inputs

| Input           | Description                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `version`       | The `anvil` release to install — a pinned version (e.g. `1.4.0`) or `latest` (the default). Pin it for reproducible builds. |
| `command`       | The `anvil` command to run (e.g. `build`). Omit to only install the CLI onto `PATH`.                                        |
| `project-dir`   | Driver project directory. Defaults to the workspace root; `anvil` walks up to find `src/manifest.c4zproj`.                  |
| `configuration` | Build configuration to apply — swaps in `config.<name>.lua` (e.g. `release`, `debug`).                                      |
| `increment`     | Bump the driver version before building: `patch`, `minor`, or `major`.                                                      |
| `encrypt`       | Encrypt the driver script for this build. Defaults to the driver's `driver.xml`; set `false` to force it off.               |
| `sourcemap`     | Emit a Lua source map alongside the `.c4z`.                                                                                 |
| `unpack`        | Also leave an unpacked copy of the driver in `dist/`.                                                                       |
| `deploy`        | Deploy the driver to a controller after building. Mutually exclusive with `sync`.                                           |
| `sync`          | Hot-sync the driver into the running instance after building. Mutually exclusive with `deploy`.                             |
| `args`          | Additional raw flags passed straight through to `anvil`, for anything not covered above.                                    |
| `github-token`  | Reserved for future use. Release binaries download from public storage, so no token is required today.                      |

## Outputs

| Output       | Description                                      |
| ------------ | ------------------------------------------------ |
| `version`    | The resolved `anvil` version that was installed. |
| `anvil-path` | Absolute path to the installed `anvil` binary.   |

## How it works

The action detects the runner's OS and architecture, downloads the pinned
`anvil` release, verifies its checksum, and adds it to `PATH`. It caches the
binary in the runner's tool-cache directory (`anvil/<version>/<arch>`), so
repeat runs on the same version don't re-download. If you set `command`, it
then runs `anvil <command>` with the inputs above.

The built `.c4z` lands in your project's `dist/` directory — upload it with
`actions/upload-artifact` or attach it to a release as a later step.
