---
sidebar_position: 12
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# version

Print the `driverforge` CLI version and, when a controller is selected, the Director
and Anvil Agent versions running on it.

## Usage

```bash
driverforge version
```

With no controller selected, it prints just the CLI version.

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
Driverforge
  CLI              1.0.0 (commit 4f2a9c1, built 2026-11-05T02:14:09Z)
  Cloud            2026.11.05

poolpump
  Driverforge SDK  1.0.0

Living Room
  Anvil Agent      1.0.0
  Director         4.0.0.1234
```

</TabItem>
<TabItem value="structured" label="Structured">

`cloud` is `null` when the service doesn't answer, and `driver` and `controller` are `null` outside a driver project or with no controller selected. A controller's `status` is `ok`, `unreachable` or `certificate_mismatch`; its versions are `null` unless it's `ok`.

stdout:

```json
{
  "cli": {
    "version": "1.0.0",
    "commit": "4f2a9c1",
    "date": "2026-11-05T02:14:09Z"
  },
  "cloud": "2026.11.05",
  "driver": {
    "name": "poolpump",
    "sdk_version": "1.0.0"
  },
  "controller": {
    "device": {
      "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
      "name": "Living Room"
    },
    "status": "ok",
    "agent_version": "1.0.0",
    "director_version": "4.0.0.1234"
  }
}
```

</TabItem>
</Tabs>


## `--version`

The conventional flag works too, printing the same CLI version line and
nothing else:

```bash
driverforge --version
```

Unlike the subcommand, the flag never reaches out to a controller and skips
the CLI's first-run prompts and update check entirely, so it is safe for scripts and
shell prompts. Once you've
[selected a controller](/cli/context) (`driverforge device select`), `version` also
reaches that controller's [Anvil Agent](/agent/overview) (best-effort) and reports:

- **Controller**: the controller's name
- **Director**: the Control4 Director (OS) version
- **Anvil Agent**: the agent version installed on the controller
- **MAC**: the controller's MAC address

If the controller can't be reached, that line reads `unreachable`; the CLI
version is always printed regardless.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
