---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# logs

Read your driver's log entries from the terminal, scoped to the controller
and the exact version you just deployed. No copying them out of the web app.

## Usage

```bash
driverforge logs [options]
```

`logs` prints the newest log entries your driver reported to Anvil, oldest
first. Inside a driver project it needs no flags: it reads the project from
`.driverforge/config.json` and the controller you chose with
[`driverforge device select`](/cli/device).

The usual loop after a change is to deploy, trigger the driver action, and
read what the driver logged for that deploy only:

```bash
driverforge deploy
driverforge logs --version 2026110502 --until-match '"data"' --timeout 30s
```

`driverforge errors` and `driverforge events` work the same way, with the same
options, for error occurrences and events.

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)
- Your driver uses the Anvil SDK and the [Anvil Agent](/agent/overview) is
  installed on the controller, so there is telemetry to read

## Choosing what to read

Each part of the scope is taken from the first place that sets it:

1. A flag: `--org`, `--project`, `--device`
2. An environment variable: `DRIVERFORGE_ORG`, `DRIVERFORGE_PROJECT`,
   `DRIVERFORGE_DEVICE`
3. The project's `.driverforge/config.json` (organization and project)
4. Your selected [organization and controller](/cli/context)

A flag only affects that one run; it never changes your selection. With
`--org`, `--project`, `--device` and `--version`, the command works anywhere,
with no project and no saved selection, which is what CI needs.

The CLI never prompts here. If no controller is selected and your organization
has more than one, the command stops and lists them so you can pass `--device`.

### Versions

| `--version`   | Reads                                           |
| ------------- | ----------------------------------------------- |
| _(not given)_ | Every version                                   |
| `<n>`         | That driver version                             |
| `latest`      | The highest version the controller has reported |

Pass the version `driverforge deploy` printed. `latest` may be another
developer's deploy on a shared controller.

Version filtering needs a driver built with an SDK that tags logs and events
with their version. Entries from older SDKs have no version and only appear
when you don't filter by one.

## Options

| Option                | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| `--org`               | Organization slug, name or id                                                 |
| `--project`           | Project slug, name or id                                                      |
| `--device`            | Controller name, hostname, hardware id or id                                  |
| `--version`           | A version number or `latest` (see above)                           |
| `--since`             | Start of the window: a duration (`30s`, `10m`, `2h`) or an RFC 3339 time      |
| `--until`             | End of the window, in the same forms                                          |
| `--tail`              | How many of the newest entries to return (default 100, at most 1000)          |
| `--before`            | Page back from the `next_cursor` of a previous response                       |
| `--level`             | Comma-separated levels, e.g. `warn,error`                                     |
| `--grep`              | Regular expression matched against the message                                |
| `--ignore-case`, `-i` | Make `--grep` case-insensitive                                                |
| `--correlation-id`    | Only entries from one event (its trace id)                                    |
| `--field`             | A `key=value` facet filter; repeatable. Keys: `controller`, `driver`, `level` |
| `--until-match`       | Wait until an entry matching this regular expression arrives                  |
| `--min-events`        | Wait until this many entries match                                            |
| `--timeout`           | Longest wait (default 30s when waiting, at most 10m)                          |
| `--follow`, `-f`      | Stream entries as they arrive, until interrupted or `--timeout`               |
| `--output`, `-o`      | `text`, `json` or `jsonl`                                                     |
| `--max-payload-bytes` | Cap each entry's message (default 65536; `0` for no cap)                      |

## Waiting for output

`--until-match` and `--min-events` turn a read into a wait: the command
returns as soon as the condition is met, including by entries that had already
arrived, and gives up after `--timeout`. It watches the same live stream the web
app does, falling back to polling if the stream is unavailable, and never shows
an entry twice.

`--follow` streams every new entry until you press Ctrl+C.

## Output

On a terminal the output is readable text, with the scope it used printed
first. Piped, or run by a [coding agent](/cli/agents), it is JSON: one document with a
`scope`, the `entries` and any `warnings`; with `--follow`, one JSON line per
entry. Data goes to stdout and everything else to stderr, so you can pipe
straight into `jq`.

Messages are printed exactly as the driver logged them. One longer than
`--max-payload-bytes` is cut, marked as truncated, and the command prints a
[`driverforge get`](/cli/get) command that fetches it in full.

### Example

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
scope: org=acme project=poolpump device=Living Room version=20261105.2

2026-11-05T03:12:44.218Z  INFO   v20261105.2  ExecuteCommand  playing episode 4812
```

</TabItem>
<TabItem value="structured" label="Structured">

The scope goes to stderr and the entries to stdout, so `jq` sees only the data. Structured, the scope is in the document itself; `count`, `has_more` and `next_cursor` page through larger results, and `wait` is added when the read waited on `--until-match` or `--min-events`.

stdout:

```json
{
  "scope": {
    "org": "acme",
    "project": "poolpump",
    "device": { "id": "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5", "name": "Living Room" },
    "version": "20261105.2",
    "since": null,
    "until": null
  },
  "entries": [
    {
      "id": "0d2f6b1a-7c4e-4a39-9b85-3e1f0c7d2a64",
      "type": "log",
      "timestamp": "2026-11-05T03:12:44.218Z",
      "level": "info",
      "name": "ExecuteCommand",
      "message": "playing episode 4812",
      "payload": null,
      "status": null,
      "duration_ms": null,
      "error_id": null,
      "driver": "poolpump.c4z",
      "driver_version": "20261105.2",
      "device": { "id": "000FFF1A2B3C", "name": "Living Room" },
      "correlation_id": "5b0e8c3a1f7d4e269a4c0b8d7e6f5a41",
      "truncated": null
    }
  ],
  "count": 1,
  "has_more": false,
  "next_cursor": null,
  "warnings": []
}
```

</TabItem>
</Tabs>


## Exit status

| Status | Meaning                                                                       |
| ------ | ----------------------------------------------------------------------------- |
| `0`    | Success, including a read that found nothing                                  |
| `1`    | Unexpected failure, or the connection dropped for over a minute               |
| `2`    | A bad flag or value                                                           |
| `3`    | A wait ended at `--timeout` without its condition being met                   |
| `4`    | Not signed in, or the session expired                                         |
| `5`    | The organization, project or device couldn't be resolved                      |
| `6`    | Rate limited                                                                  |
| `130`  | Interrupted                                                                   |

## Examples

Read what the last deploy logged:

```bash
driverforge logs --version 2026110502
```

Read from a specific controller and version, with no project or selection:

```bash
driverforge logs --org acme --project smart-tv --device bench-a --version 12 --tail 50
```

Warnings and errors from the last ten minutes:

```bash
driverforge logs --level warn,error --since 10m
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
