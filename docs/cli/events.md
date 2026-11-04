---
sidebar_position: 7
---

# events

Read the events your driver handled, with their arguments and results, from
the terminal, scoped to the controller and the exact version you just deployed.

## Usage

```bash
driverforge events [options]
```

`events` lists the Control4 callbacks your driver handled (`ReceivedFromProxy`,
`OnPropertyChanged`, `OnTimerExpired`, …), oldest first, each with the
arguments it was called with, what it returned, its status and how long it took.

It works exactly like [`driverforge logs`](/cli/logs): the same
[scope rules](/cli/logs#choosing-what-to-read), [versions](/cli/logs#versions),
[waiting and following](/cli/logs#waiting-for-output),
[output](/cli/logs#output) and [exit statuses](/cli/logs#exit-status).

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)
- Your driver uses the Anvil SDK and the [Anvil Agent](/agent/overview) is
  installed on the controller

## Options

| Option                | Description                                                                            |
| --------------------- | -------------------------------------------------------------------------------------- |
| `--org`               | Organization slug, name or id                                                          |
| `--project`           | Project slug, name or id                                                               |
| `--device`            | Controller name, hostname, hardware id or id                                           |
| `--version`           | A version number, `current` or `latest`                                                |
| `--since`             | Start of the window: a duration (`30s`, `10m`, `2h`) or an RFC 3339 time               |
| `--until`             | End of the window, in the same forms                                                   |
| `--tail`              | How many of the newest events to return (default 100, at most 1000)                    |
| `--before`            | Page back from the `next_cursor` of a previous response                                |
| `--name`              | Only events with this name, e.g. `ReceivedFromProxy`                                   |
| `--grep`              | Regular expression matched against the event's arguments and result                    |
| `--ignore-case`, `-i` | Make `--grep` case-insensitive                                                         |
| `--correlation-id`    | Only the event with this trace id                                                      |
| `--field`             | A `key=value` facet filter; repeatable. Keys: `controller`, `driver`, `name`, `status` |
| `--until-match`       | Wait until an event matching this regular expression arrives                           |
| `--min-events`        | Wait until this many events match                                                      |
| `--timeout`           | Longest wait (default 30s when waiting, at most 10m)                                   |
| `--follow`, `-f`      | Stream events as they arrive, until interrupted or `--timeout`                         |
| `--output`, `-o`      | `text`, `json` or `jsonl`                                                              |
| `--max-payload-bytes` | Cap each event's arguments and result (default 65536; `0` for no cap)                  |

## What each event carries

An event's `payload` is `{"args": …, "result": …}`, exactly as recorded:
structured values stay nested JSON, in the order the driver produced them. Its
`id` is the event's trace id, which the logs and errors raised while handling
it carry as their `correlation_id`:

```bash
driverforge logs --correlation-id <event id>
```

## Examples

What the driver received from its proxy since the last deploy:

```bash
driverforge events --version current --name ReceivedFromProxy
```

Wait for the next property change:

```bash
driverforge events --name OnPropertyChanged --min-events 1 --timeout 2m
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
