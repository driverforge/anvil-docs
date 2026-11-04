---
sidebar_position: 7
---

# errors

Read your driver's error occurrences from the terminal, scoped to the
controller and the exact version you just deployed.

## Usage

```bash
driverforge errors [options]
```

`errors` lists individual error occurrences, oldest first, each with its
message, error type, stack trace and the arguments of the event it was raised
in. Occurrences are listed one by one, not grouped the way the web app's errors
view groups them, so you see every time it happened.

It works exactly like [`driverforge logs`](/cli/logs): the same
[scope rules](/cli/logs#choosing-what-to-read), [versions](/cli/logs#versions),
[waiting and following](/cli/logs#waiting-for-output),
[output](/cli/logs#output) and [exit statuses](/cli/logs#exit-status).

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)
- Your driver uses the Anvil SDK and the [Anvil Agent](/agent/overview) is
  installed on the controller

## Options

| Option                | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `--org`               | Organization slug, name or id                                            |
| `--project`           | Project slug, name or id                                                 |
| `--device`            | Controller name, hostname, hardware id or id                             |
| `--version`           | A version number, `current` or `latest`                                  |
| `--since`             | Start of the window: a duration (`30s`, `10m`, `2h`) or an RFC 3339 time |
| `--until`             | End of the window, in the same forms                                     |
| `--tail`              | How many of the newest occurrences to return (default 100, at most 1000) |
| `--before`            | Page back from the `next_cursor` of a previous response                  |
| `--grep`              | Regular expression matched against the message and the error's details   |
| `--ignore-case`, `-i` | Make `--grep` case-insensitive                                           |
| `--correlation-id`    | Only errors raised in one event (its trace id)                           |
| `--field`             | A `key=value` facet filter; repeatable. Keys: `controller`, `driver`     |
| `--until-match`       | Wait until an error matching this regular expression arrives             |
| `--min-events`        | Wait until this many errors match                                        |
| `--timeout`           | Longest wait (default 30s when waiting, at most 10m)                     |
| `--follow`, `-f`      | Stream errors as they arrive, until interrupted or `--timeout`           |
| `--output`, `-o`      | `text`, `json` or `jsonl`                                                |
| `--max-payload-bytes` | Cap each error's details (default 65536; `0` for no cap)                 |

## What each error carries

The error's message is the entry's `message`. Its `payload` holds the
details as recorded: the error `type`, the `stacktrace`, the `args` of the
event it was raised in, and the `lastLog` line the driver logged before it.
The `correlation_id` is the trace id of that event, so you can pull everything
around an error:

```bash
driverforge logs --correlation-id <id>
```

## Examples

Errors from the last deploy:

```bash
driverforge errors --version current
```

Errors from the last ten minutes on one controller:

```bash
driverforge errors --device bench-a --since 10m
```

Wait for an error after triggering an action, and fail if none arrives:

```bash
driverforge errors --version current --min-events 1 --timeout 60s
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
