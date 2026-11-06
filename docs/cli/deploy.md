---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# deploy

Build and deploy your driver to a controller without leaving the terminal or
switching contexts.

## Usage

```bash
driverforge deploy [options]
```

`deploy` builds your driver (respecting `-c/--configuration`, including the
configuration's [defaults](/cli/build-configuration#per-configuration-defaults)
from the project config), then sends the
`.c4z` to the [Anvil Agent](/agent/overview) on the controller over a secure
connection. The agent installs it and reloads the running driver for you. What
you deploy is always your current source: there is no stale artifact to forget
about.

Every deploy **bumps the driver's version** per the project's
[versioning scheme](/cli/versioning): Director only reloads a driver when it
sees a higher `<version>`, so each deploy consumes a version slot. The bump is
persisted back to your `driver.xml` after the build succeeds.

The command prints the version it deployed. Pass it to
[`driverforge logs --version`](/cli/logs#versions) (and `errors` and `events`)
to read back exactly what that deploy reported.

## Prerequisites

- The project is [initialised](/cli/init) (`driverforge init`)
- You're [signed in](/cli/login) (`driverforge login`)
- A target controller is [selected](/cli/device) (`driverforge device select`)
- The [Anvil Agent](/agent/overview) is installed and running on the controller

## Options

| Option                  | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `--device`              | Controller to deploy to (name, hostname, or id); overrides the selected one |
| `--select`              | Re-select the target controller before deploying                             |
| `--configuration`, `-c` | Build configuration to build and deploy                                      |

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
┃ ✓ Deployed version 20261105.2
┃
┃ driver     poolpump
┃ version    20261105.2
┃ artifact   dist/poolpump.c4z
┃ controller Living Room
```

</TabItem>
<TabItem value="structured" label="Structured">

Progress is abbreviated: the build's own steps come first. `state` is `confirmed` once the driver restarts; `confirmed_with_errors` when its init handler threw (`report_url` links to the error); `unconfirmed` when the controller didn't report back in time.

stdout:

```json
{
  "action": "deploy",
  "reason": null,
  "build": {
    "driver": "poolpump",
    "configuration": "default",
    "version": "20261105.2",
    "artifact": "dist/poolpump.c4z",
    "encrypted": false,
    "unpacked": null,
    "sourcemap": null,
    "warnings": []
  },
  "device": {
    "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
    "name": "Living Room"
  },
  "state": "confirmed",
  "version": "20261105.2",
  "report_url": null,
  "warnings": []
}
```

stderr:

```json
{"progress": {"status": "running", "message": "Deploying to Living Room"}}
{"progress": {"status": "ok", "message": "Build complete"}}
{"progress": {"status": "running", "message": "Connecting to Living Room"}}
{"progress": {"status": "ok", "message": "Connected to Living Room (Anvil Agent 1.0.0)"}}
{"progress": {"status": "running", "message": "Uploading the driver"}}
{"progress": {"status": "running", "message": "Waiting for Director"}}
{"progress": {"status": "running", "message": "Restarting the driver"}}
{"progress": {"status": "ok", "message": "Deployed version 20261105.2"}}
```

</TabItem>
</Tabs>


## Examples

Build and deploy to the selected controller:

```bash
driverforge deploy
```

Build and deploy the `release` configuration to a specific controller:

```bash
driverforge deploy --configuration release --device "Plant Room"
```

## First deploy

The first time you deploy a new driver, it doesn't exist in the controller's
project yet, so the CLI walks you through adding it. It guides you through
choosing where in the project to create the device, naming it, and setting any
property values the driver needs, then finishes the deploy. Every deploy after
that updates the driver in place automatically.

Prefer to set it up by hand? Add the driver to a room once in Composer Pro and
run `driverforge deploy` again; the CLI picks up from there.

Once it's deployed, read what the driver reports, using the version it printed:

```bash
driverforge logs --version 2026110502
```

## Troubleshooting

- **Agent unreachable**: the Anvil Agent isn't installed, isn't running, or
  can't be reached at the controller's address. See the
  [agent docs](/agent/overview).
- **Agent out of date**: the agent on the controller is too old to accept a
  deploy. Update it with the [`driverforge upgrade`](/cli/upgrade) picker.
- **Deploy failed**: the controller rejected the driver or it errored on init.
  When the agent captures an Anvil error report, the CLI prints a link to it.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
