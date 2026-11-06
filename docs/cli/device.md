---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# device

Manage the active deploy target: the Control4 controller that [`deploy`](/cli/deploy),
[`sync`](/cli/sync), and [`upgrade`](/cli/upgrade) act on, and that [`logs`](/cli/logs),
[`errors`](/cli/errors) and [`events`](/cli/events) read from. The CLI remembers it so you
don't pass it every time. `driverforge device` on its own does nothing; run one of its
subcommands.

## Usage

```bash
driverforge device <subcommand>
```

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`) with an [organization](/cli/org)
  selected (`driverforge org select`)

## Subcommands

### driverforge device list

List the controllers registered to your active organization; `*` marks the
selected one. A controller registers itself when the [Anvil Agent](/agent/overview)
is installed on it.

```bash
driverforge device list
```

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
   NAME         HOST          STATUS
*  Living Room  192.168.1.40  ACTIVE
   Bench A      192.168.1.52  ACTIVE
```

</TabItem>
<TabItem value="structured" label="Structured">

stdout:

```json
{
  "devices": [
    {
      "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
      "name": "Living Room",
      "hardware_id": "000FFF1A2B3C",
      "hostname": "control4-ea3-000fff1a2b3c",
      "ip": "192.168.1.40",
      "status": "ACTIVE",
      "current": true
    },
    {
      "id": "4c3b2a19-0f8e-4d7c-b6a5-948372615f0e",
      "name": "Bench A",
      "hardware_id": "000FFF4D5E6F",
      "hostname": "control4-ea1-000fff4d5e6f",
      "ip": "192.168.1.52",
      "status": "ACTIVE",
      "current": false
    }
  ]
}
```

</TabItem>
</Tabs>

### driverforge device select [name|id]

Choose the active controller. Matches its friendly name, hostname, Control4 device
id, or id. It shows a picker when given no argument. Only **active** controllers
can be selected, and selecting one pins its TLS certificate fingerprint so later
deploys verify they're talking to the right controller.

```bash
driverforge device select "Living Room Controller"
```

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
Using device: Living Room
```

</TabItem>
<TabItem value="structured" label="Structured">

With no argument, there's no picker: it stops with `input_required`. Pass the controller to select.

stdout:

```json
{
  "device": {
    "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
    "name": "Living Room",
    "hardware_id": "000FFF1A2B3C",
    "hostname": "control4-ea3-000fff1a2b3c",
    "ip": "192.168.1.40",
    "current": true
  }
}
```

</TabItem>
</Tabs>

### driverforge device show

Print the active controller.

```bash
driverforge device show
```

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
Living Room
```

</TabItem>
<TabItem value="structured" label="Structured">

stdout:

```json
{
  "device": {
    "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
    "name": "Living Room",
    "hardware_id": "000FFF1A2B3C",
    "hostname": "control4-ea3-000fff1a2b3c",
    "ip": "192.168.1.40",
    "current": true
  }
}
```

</TabItem>
</Tabs>

See [Organizations & devices](/cli/context) for how the deploy target is resolved.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
