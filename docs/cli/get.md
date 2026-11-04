---
sidebar_position: 7
---

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

## Examples

```bash
driverforge get 6f1c2f9e-6c1a-4c39-9a51-0d4b8e1f2a3b
driverforge get 0123456789abcdef0123456789abcdef --type event -o json
```

An id that isn't in the project, or is older than your plan's retention, exits
`1` with `entry_not_found`.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
