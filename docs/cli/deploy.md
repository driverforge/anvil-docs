---
sidebar_position: 5
---

# anvil deploy

Build and deploy your driver to a controller without leaving the terminal or
switching contexts.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
anvil deploy [options]
```

`deploy` builds your driver (respecting `-c/--configuration`), then sends the
`.c4z` to the [Anvil Agent](/agent/overview) on the controller over a secure
connection. The agent installs it and reloads the running driver for you. What
you deploy is always your current source: there is no stale artifact to forget
about.

Every deploy **bumps the driver's version** per the project's
[versioning scheme](/cli/versioning): Director only reloads a driver when it
sees a higher `<version>`, so each deploy consumes a version slot. The bump is
persisted back to your `driver.xml` after the build succeeds.

## Prerequisites

- The project is [initialised](/cli/init) (`anvil init`)
- You're [signed in](/cli/login) (`anvil login`)
- A target controller is [selected](/cli/device) (`anvil device select`)
- The [Anvil Agent](/agent/overview) is installed and running on the controller

## Options

| Option                  | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `--device`              | Controller to deploy to (name, hostname, or id) — overrides the selected one |
| `--select`              | Re-select the target controller before deploying                             |
| `--configuration`, `-c` | Build configuration to build and deploy                                      |

## Examples

Build and deploy to the selected controller:

```bash
anvil deploy
```

Build and deploy the `release` configuration to a specific controller:

```bash
anvil deploy --configuration release --device "Plant Room"
```

## First deploy

The first time you deploy a new driver, it doesn't exist in the controller's
project yet — so the CLI walks you through adding it. It guides you through
choosing where in the project to create the device, naming it, and setting any
property values the driver needs, then finishes the deploy. Every deploy after
that updates the driver in place automatically.

Prefer to set it up by hand? Add the driver to a room once in Composer Pro and
run `anvil deploy` again — the CLI picks up from there.

## Troubleshooting

- **Agent unreachable** — the Anvil Agent isn't installed, isn't running, or
  can't be reached at the controller's address. See the
  [agent docs](/agent/overview).
- **Agent out of date** — the agent on the controller is too old to accept a
  deploy. Update it with [`anvil agent upgrade`](/cli/agent).
- **Deploy failed** — the controller rejected the driver or it errored on init.
  When the agent captures an Anvil error report, the CLI prints a link to it.

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
