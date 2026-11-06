---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# get

Fetch one log, error or event by its id, with its full, untruncated payload.

## Usage

```bash
driverforge get <id> [options]
```

[`logs`](/cli/logs), [`errors`](/cli/errors) and [`events`](/cli/events)
cut any entry larger than `--max-payload-bytes` and print a ready-to-run
`get` command for each one they cut. Run it to read that entry in full.

Logs and errors have a UUID id; an event's id is its 32-character trace id.
`get` works out which from the id, or you can say with `--type`.

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)

## Options

| Option                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `--org`               | Organization slug, name or id                     |
| `--project`           | Project slug, name or id                          |
| `--type`              | `log`, `error` or `event`, to skip working it out |
| `--output`, `-o`      | `text` or `json`                                  |
| `--max-payload-bytes` | Cap the payload (default `0`: no cap)             |

The organization and project are chosen the
[same way as for `logs`](/cli/logs#choosing-what-to-read). No controller is
needed: an id is unique within the project.

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
scope: org=acme project=poolpump device=Living Room
2026-11-05T03:12:44.201Z  EVENT  v20261105.2  ExecuteCommand  ok
    {
      "args": ["PLAY", {}],
      "result": null
    }
```

</TabItem>
<TabItem value="structured" label="Structured">

`get` returns one entry, untruncated, under `entry` rather than `entries`.

stdout:

```json
{
  "scope": {
    "org": "acme",
    "project": "poolpump",
    "device": { "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5", "name": "Living Room" },
    "version": null,
    "since": null,
    "until": null
  },
  "entry":
  {
    "id": "5b0e8c3a1f7d4e269a4c0b8d7e6f5a41",
    "type": "event",
    "timestamp": "2026-11-05T03:12:44.201Z",
    "level": null,
    "name": "ExecuteCommand",
    "message": null,
    "payload": {
      "args": ["PLAY", {}],
      "result": null
    },
    "status": "ok",
    "duration_ms": 31.4,
    "error_id": null,
    "driver": "poolpump.c4z",
    "driver_version": "20261105.2",
    "device": { "id": "000FFF1A2B3C", "name": "Living Room" },
    "correlation_id": "5b0e8c3a1f7d4e269a4c0b8d7e6f5a41",
    "truncated": null
  },
  "warnings": []
}
```

</TabItem>
</Tabs>


## Examples

```bash
driverforge get 6f1c2f9e-6c1a-4c39-9a51-0d4b8e1f2a3b
driverforge get 0123456789abcdef0123456789abcdef --type event -o json
```

An id that isn't in the project, or is older than your plan's retention, exits
`1` with `entry_not_found`.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
