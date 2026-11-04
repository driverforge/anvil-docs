---
sidebar_position: 7
---

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
driverforge logs --version current --until-match '"data"' --timeout 30s
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

| `--version`   | Reads                                                                   |
| ------------- | ----------------------------------------------------------------------- |
| _(not given)_ | Every version                                                           |
| `<n>`         | That driver version                                                     |
| `current`     | The version this machine last [deployed](/cli/deploy) to the controller |
| `latest`      | The highest version the controller has reported                         |

`current` relies on the record `driverforge deploy` keeps on your machine, so a
fresh CI runner has none: pass the version number there instead.

Version filtering needs a driver built with an SDK that tags logs and events
with their version. Entries from older SDKs have no version and only appear
when you don't filter by one.

## Options

| Option                | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| `--org`               | Organization slug, name or id                                                 |
| `--project`           | Project slug, name or id                                                      |
| `--device`            | Controller name, hostname, hardware id or id                                  |
| `--version`           | A version number, `current` or `latest` (see above)                           |
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

## Exit status

| Status | Meaning                                                                       |
| ------ | ----------------------------------------------------------------------------- |
| `0`    | Success, including a read that found nothing                                  |
| `1`    | Unexpected failure, or the connection dropped for over a minute               |
| `2`    | A bad flag or value                                                           |
| `3`    | A wait ended at `--timeout` without its condition being met                   |
| `4`    | Not signed in, or the session expired                                         |
| `5`    | The organization, project, device or `--version current` couldn't be resolved |
| `6`    | Rate limited                                                                  |
| `130`  | Interrupted                                                                   |

## Examples

Read what the last deploy logged:

```bash
driverforge logs --version current
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
