---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# get

Fetch one log, error or event by its id, with its full, untruncated payload,
or an error group by its reference.

## Usage

```bash
driverforge get <id> [options]
driverforge get <ref> [options]
```

[`logs`](/cli/logs), [`errors`](/cli/errors) and [`events`](/cli/events)
cut any entry larger than `--max-payload-bytes` and print a ready-to-run
`get` command for each one they cut. Run it to read that entry in full.

Logs and errors have a UUID id; an event's id is its 32-character trace id.
`get` works out which from the id, or you can say with `--type`.

An error group is every occurrence of one error in a project, the same grouping
the web app's errors view shows. Its reference is
`<PROJECT-SLUG>-<FINGERPRINT>`, for example `POOL-PUMP-4F2A9C1B`: the label the
web app shows and people quote, and the `ref` every error entry carries. A
reference can't be confused with an id, so `get` recognises it in any casing
without `--type`. The group is found however long ago it last occurred, as long
as that's within your plan's retention.

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)

## Options

| Option                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `--org`               | Organization slug, name or id                                     |
| `--project`           | Project slug, name or id                                          |
| `--type`              | `log`, `error`, `event` or `error_group`, to skip working it out  |
| `--output`, `-o`      | `text` or `json`                                                  |
| `--max-payload-bytes` | Cap an entry's payload (default `0`: no cap). Entries only        |

The organization and project are chosen the
[same way as for `logs`](/cli/logs#choosing-what-to-read). No controller is
needed: an id is unique within the project.

A reference names its project, so fetching a group needs no `--project` and
works from any directory. A `--project` naming a different project, or
`--max-payload-bytes` with a reference, is a usage error (`usage_error`).

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
    "ref": null,
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

### Error groups

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

A short summary: the reference, type and count, then the message, when it was
first and last seen, the versions and controllers it occurred on, the callback
of the newest occurrence, and the command that fetches that occurrence.

```text
scope: org=acme project=pool-pump
POOL-PUMP-4F2A9C1B  lua:runtime_error  37 occurrences
  driver.lua:212: attempt to index a nil value (field 'pump')
  first seen 2026-11-05T08:12:03.441Z, last seen 2026-11-07T21:47:55.018Z
  versions: 2026110501, 2026110502
  devices: Living Room
  latest in: ReceivedFromProxy
  latest occurrence: driverforge get 6f1c2f9e-6c1a-4c39-9a51-0d4b8e1f2a3b --type error --org acme --project pool-pump
```

</TabItem>
<TabItem value="structured" label="Structured">

A group comes back under `error_group`.

stdout:

```json
{
  "scope": {
    "org": "acme",
    "project": "pool-pump",
    "device": null,
    "version": null,
    "since": null,
    "until": null
  },
  "error_group": {
    "ref": "POOL-PUMP-4F2A9C1B",
    "fingerprint": "4f2a9c1b",
    "type": "lua:runtime_error",
    "message": "driver.lua:212: attempt to index a nil value (field 'pump')",
    "count": 37,
    "first_seen": "2026-11-05T08:12:03.441Z",
    "last_seen": "2026-11-07T21:47:55.018Z",
    "driver_versions": ["2026110501", "2026110502"],
    "drivers": ["poolpump.c4z"],
    "devices": [{ "id": "000FFF1A2B3C", "name": "Living Room" }],
    "latest_event": "ReceivedFromProxy",
    "latest_stacktrace": { "frames": ["…"] },
    "latest_occurrence": {
      "id": "6f1c2f9e-6c1a-4c39-9a51-0d4b8e1f2a3b",
      "command": "driverforge get 6f1c2f9e-6c1a-4c39-9a51-0d4b8e1f2a3b --type error --org acme --project pool-pump"
    }
  },
  "warnings": []
}
```

</TabItem>
</Tabs>

| Field                                    | Meaning                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ref`, `fingerprint`                     | The group's reference, and its fingerprint (the 8 hex characters)                                                        |
| `type`, `message`                        | The error's type and message                                                                                             |
| `count`                                  | How many occurrences are still retained                                                                                  |
| `first_seen`, `last_seen`                | RFC 3339, UTC                                                                                                            |
| `driver_versions`, `drivers`, `devices`  | Where it occurred. Each device is `{"id", "name"}`; `name` is `null` if the controller isn't registered to the organization |
| `latest_event`                           | The callback the newest occurrence was raised in, or `null`                                                              |
| `latest_stacktrace`                      | The newest occurrence's stack trace, as stored                                                                           |
| `latest_occurrence`                      | `{"id", "command"}`: a ready `get` command for the newest occurrence, with its arguments and last log. `null` when unknown |

## Examples

```bash
driverforge get 6f1c2f9e-6c1a-4c39-9a51-0d4b8e1f2a3b
driverforge get 0123456789abcdef0123456789abcdef --type event -o json
driverforge get POOL-PUMP-4F2A9C1B
```

An id or reference that isn't in the project, or is older than your plan's
retention, exits `1` with `entry_not_found`.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
