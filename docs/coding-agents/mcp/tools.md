---
sidebar_label: Tools
description: The tools and prompts the Anvil MCP server gives a coding agent, and the inputs each one takes.
---

# MCP tools

These are the tools the [Anvil MCP server](/coding-agents/mcp/setup) offers.
You don't call them yourself: your agent chooses them from what you ask. Knowing
what they do helps you ask for the right thing.

Every tool except `authenticate` and `auth_status` needs you to be
[signed in](/coding-agents/mcp/setup#sign-in), and only returns data from
projects your account belongs to. Every tool only reads: none of them changes a
project, a device or a driver. Tools that take a `projectId` accept either the
project's ID or its slug.

All results are JSON. Apart from the two sign-in tools, a successful result
carries `status: "ok"` and a failed one a
[failure code](#when-a-tool-fails) in the same field.

Every tool publishes an output schema describing its successful result, so an
agent that supports structured tool output can read the result's shape before
calling the tool. A successful result comes back as structured content that
matches the schema, and as text for agents that don't read structured content.

## Signing in

### `authenticate`

Signs the session in through your browser. The first call returns a link and a
code for you to approve; calling it again once you've approved completes the
sign-in. See [Sign in](/coding-agents/mcp/setup#with-the-authenticate-tool).

Takes no inputs.

### `auth_status`

Reports whether the session is signed in, and as whom.

Takes no inputs.

## Organizations, projects and devices

### `list_organizations`

Lists the [organizations](/platform/organizations) you belong to, with your
role in each.

Takes no inputs.

### `list_projects`

Lists the Anvil projects you belong to, with each one's ID, slug, name,
platform, organization, your role in it, and its
[project token](/platform/project-tokens). Agents usually call this first to
find the project you're talking about.

Takes no inputs.

### `get_project`

Returns the details of one project, including its project token.

| Input       | Required | Description               |
| ----------- | -------- | ------------------------- |
| `projectId` | Yes      | The project's ID or slug. |

### `list_devices`

Lists an organization's [controllers](/platform/devices): each one's name,
hardware ID, hostname, IP address, platform and status. Pass a device's name or
hardware ID as `device` to the telemetry tools to read only that controller.

Listing devices needs admin access to the organization. Without it, an agent
can still read one controller's telemetry by passing its hardware ID as
`device`.

| Input          | Required | Description                                                                                     |
| -------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `organization` | No       | The organization's slug, name or ID. Only needed when you belong to more than one organization. |

### `get_integration_guide`

Returns step-by-step instructions for adding the
[Driverforge SDK](/sdk/installation) to a driver, filled in with the project's
own token. If your agent can run the CLI, the first step is
[`driverforge init`](/cli/init), which does it all for you. This is what an
agent uses when you ask it to set Anvil up in a driver.

| Input       | Required | Description                                                                                                                                                 |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projectId` | Yes      | The project's ID or slug.                                                                                                                                   |
| `platform`  | No       | The target platform: `CONTROL4` or `SAVANT`. Defaults to the project's platform. Only Control4 is supported yet: `SAVANT` returns `platform_not_supported`. |

## Events

### `list_events`

Lists the [events](/platform/events) a project recorded, newest first: every
Control4 callback your driver handled, with its status, driver version,
controller, duration, arguments and result. This is how an agent finds out what
your driver actually did, and which callbacks Control4 called in what order.

Takes the [shared scoping inputs](#scoping-telemetry-reads)
(`limit` defaults to 25, at most 500; `timeRangeMinutes` defaults to 15), plus:

| Input        | Required | Description                                                       |
| ------------ | -------- | ----------------------------------------------------------------- |
| `eventNames` | No       | Only callbacks with one of these names, such as `ExecuteCommand`. |
| `statuses`   | No       | Only events with one of these statuses.                           |
| `traceId`    | No       | Only the event with this `traceId`.                               |

### `get_event`

Returns one event with every log line it produced, in order: the arguments the
handler received, the result it returned, its status, and what it logged along
the way.

| Input       | Required | Description                                          |
| ----------- | -------- | ---------------------------------------------------- |
| `projectId` | Yes      | The project the event belongs to.                    |
| `traceId`   | Yes      | The event's `traceId`, as returned by `list_events`. |

Nothing is cut, so this is also where an agent goes after `list_events` warns
`payload_truncated`.

## Logs

### `list_logs`

Lists the [log lines](/platform/logs) a project recorded, newest first, so the
agent can read your driver's output without you pasting it in.

Takes the [shared scoping inputs](#scoping-telemetry-reads)
(`limit` defaults to 100, at most 1000; `timeRangeMinutes` defaults to 15), plus:

| Input           | Required | Description                                                           |
| --------------- | -------- | --------------------------------------------------------------------- |
| `levels`        | No       | Only lines at one of these levels, such as `ERROR`, `WARN` or `INFO`. |
| `messageSearch` | No       | Only lines whose message contains this text. Not case-sensitive.      |
| `traceId`       | No       | Only lines emitted during the event with this `traceId`.              |

### `get_log`

Returns one log line whole, by the ID `list_logs` gave it. Nothing is cut, so
this is where an agent goes after `list_logs` warns `payload_truncated`.

| Input       | Required | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `projectId` | Yes      | The project's ID or slug.                      |
| `id`        | Yes      | The log line's ID, as `list_logs` returned it. |

## Errors

### `list_errors`

Lists the [errors](/platform/errors) a project recorded, grouped by cause and
most frequent first. Each one carries the reference to pass to `get_error`.
Scoped to a `driverVersion`, `device` or `since`, a group's count and affected
drivers and versions cover only the occurrences in that scope.

Takes the [shared scoping inputs](#scoping-telemetry-reads)
(`limit` defaults to 25, at most 100; `timeRangeMinutes` defaults to 1440).

### `get_error`

Returns everything Anvil knows about one error, found by the reference shown
against it in Anvil, such as `POOLPUMP-4F2A9C1B`. Paste a reference into
your agent and it can investigate from there.

The result includes:

- the error's type and message
- how many times it has happened, and when it was first and last seen
- the drivers, driver versions and controllers it affected
- the most recent occurrence's stack trace, mapped back to your source where
  you've uploaded a [source map](/cli/source-maps)
- the arguments the failing handler was called with
- the logs emitted during the same event

| Input | Required | Description                              |
| ----- | -------- | ---------------------------------------- |
| `ref` | Yes      | The error reference. Not case-sensitive. |

### `list_error_occurrences`

Lists each time a handler threw, newest first, rather than grouping them: the
message, the callback it was raised in, its arguments and the last log line
before it. Scoped to a `driverVersion`, it answers "did my change raise any
errors?".

Takes the [shared scoping inputs](#scoping-telemetry-reads)
(`limit` defaults to 25, at most 500; `timeRangeMinutes` defaults to 1440), plus:

| Input     | Required | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| `traceId` | No       | Only errors raised during the event with this `traceId`. |

### `get_error_occurrence`

Returns one error occurrence whole, by the ID `list_error_occurrences` gave it:
the message, the callback it was raised in, its arguments, the last log line
before it and its stack trace, mapped back to your source where you've uploaded
a [source map](/cli/source-maps). Where `get_error` reads the whole error, this
reads one time it happened. Nothing is cut, so this is also where an agent goes
after `list_error_occurrences` warns `payload_truncated`.

| Input       | Required | Description                                                   |
| ----------- | -------- | ------------------------------------------------------------- |
| `projectId` | Yes      | The project's ID or slug.                                     |
| `id`        | Yes      | The occurrence's ID, as `list_error_occurrences` returned it. |

## Waiting for an action

### `wait_for_telemetry`

Waits until logs, events or error occurrences matching a condition arrive, then
returns them, oldest first. Instead of you pasting logs after you press a
button, the agent records the time, asks you to press it, and waits:

1. The agent notes the current time.
2. It tells you what to do on the controller.
3. It calls `wait_for_telemetry` with that time as `since`, and returns as soon
   as the entry arrives.

The result lists the matching `entries`, oldest first, with their `count` and
the scope that was read (`project`, `device`, `driverVersion`, `since`), plus a
`wait` block:

| Field            | Meaning                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| `wait.satisfied` | Whether the condition was met before the timeout.                            |
| `wait.reason`    | `condition_met`, `timeout`, or `cancelled` when your agent stopped the wait. |
| `wait.elapsedMs` | How long it waited.                                                          |
| `wait.polls`     | How many times it read.                                                      |

Unlike the list tools, the result has no `warnings` or `windowMinutes`. An entry
cut at `maxPayloadBytes` still lists what was cut in its own `truncated` field:
fetch it whole with `get_event`, `get_log` or `get_error_occurrence`. While it
waits, the server sends progress notifications to agents that ask for them.

Takes `projectId`, `device` and `driverVersion` as in
[Scoping telemetry reads](#scoping-telemetry-reads), plus:

| Input             | Required | Description                                                                                                                                                                                    |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`            | Yes      | What to wait for: `logs`, `events` or `errors`.                                                                                                                                                |
| `since`           | Yes      | Where to start looking: usually the time noted before the action.                                                                                                                              |
| `match`           | No       | Wait for entries containing any of these strings, anywhere in the entry. Not case-sensitive, and not regular expressions. Up to 10 strings of up to 200 characters. Omit to count every entry. |
| `minCount`        | No       | How many matching entries to wait for. Defaults to 1; at most 100.                                                                                                                             |
| `timeoutSeconds`  | No       | The longest to wait. Defaults to 30; at most 120.                                                                                                                                              |
| `eventNames`      | No       | For `events`: only callbacks with one of these names.                                                                                                                                          |
| `levels`          | No       | For `logs`: only lines at one of these levels.                                                                                                                                                 |
| `traceId`         | No       | Only entries from the event with this `traceId`.                                                                                                                                               |
| `maxPayloadBytes` | No       | Cap each entry's message or payload. Defaults to 16384; `0` for no cap; at most 1048576 (1 MiB).                                                                                               |

## Scoping telemetry reads

`list_events`, `list_logs`, `list_errors` and `list_error_occurrences` share
these inputs, so an agent can scope every read the same way.

| Input              | Description                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `projectId`        | Required. The project's ID or slug.                                                                                                                                                                                                                                                              |
| `device`           | Only telemetry from this controller: its name, hostname, hardware ID or ID.                                                                                                                                                                                                                      |
| `driverVersion`    | Only telemetry from this driver version: the version your deploy returned, or `latest` for the highest version in the newest telemetry. Someone else may deploy to the same controller, so a version number is safer than `latest`. The server can't see your deploys, so `current` is rejected. |
| `since`            | Where the window starts: a duration back from now (`30s`, `10m`, `2h`, `1d`) or a time with a timezone, such as `2026-11-05T09:00:00Z` or `2026-11-05T19:00:00+10:00`. A time in the future is rejected. Takes precedence over `timeRangeMinutes`.                                               |
| `timeRangeMinutes` | How far back to look, in minutes, when `since` isn't given. At most 129600 (90 days).                                                                                                                                                                                                            |
| `drivers`          | Only entries from one of these drivers, such as `poolpump.c4z`.                                                                                                                                                                                                                                  |
| `controllers`      | Only entries from one of these controllers, by hardware ID. `device` takes precedence.                                                                                                                                                                                                           |
| `limit`            | The most entries to return.                                                                                                                                                                                                                                                                      |
| `cursor`           | Fetch the next, older page: pass `nextCursor` from the previous result.                                                                                                                                                                                                                          |
| `maxPayloadBytes`  | Cap each entry's message or payload at this many bytes. Defaults to 16384; `0` for no cap; at most 1048576 (1 MiB).                                                                                                                                                                              |

Each result reports the scope it actually read (`project`, `device`,
`driverVersion`, `since`) and `windowMinutes`, the look-back that was searched.
Your [plan's retention](/platform/plans) can make that shorter than you asked
for.

Results can carry warnings, each with a stable `code`:

| Code                | Meaning                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `no_entries`        | Nothing matched the scope and filters.                                                                                               |
| `retention_clamped` | The window reached past your plan's retention, so older entries weren't searched.                                                    |
| `payload_truncated` | Some entries were cut at `maxPayloadBytes`. Each is listed by ID; `get_event`, `get_log` or `get_error_occurrence` fetches it whole. |

## When a tool fails

A call that can't return what was asked is marked as an error, and its result
carries a stable code in its `status` field and a `message` saying what to do
next. A failed result comes back as text only; the output schemas describe
successful results.

Any tool that needs sign-in can return:

| Code                  | Meaning                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `auth_required`       | The session isn't signed in, or its sign-in expired. [Sign in](/coding-agents/mcp/setup#sign-in) again. |
| `rate_limited`        | Too many requests. Wait `retryAfterMs`, then narrow the query.                                          |
| `access_denied`       | Your account can't see this.                                                                            |
| `service_unavailable` | Anvil couldn't load the data. Try again.                                                                |

The telemetry tools (`list_events`, `list_logs`, `list_errors`,
`list_error_occurrences` and `wait_for_telemetry`) check their scope first:

| Code                | Meaning                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| `project_not_found` | No project you can access matches `projectId`.                                    |
| `device_not_found`  | No controller matches `device`. Without admin access, pass its hardware ID.       |
| `device_ambiguous`  | More than one controller matches `device`. `candidates` lists their hardware IDs. |
| `invalid_since`     | `since` isn't a duration or a time with a timezone, or it's in the future.        |
| `invalid_version`   | `driverVersion` isn't a version, or it's `current`.                               |
| `no_versions_seen`  | `driverVersion` is `latest`, but no telemetry carries a driver version yet.       |

Other tools have their own:

| Code                     | Tool                                                        | Meaning                                                            |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| `project_not_found`      | Any tool that takes `projectId`                             | No project you can access matches it.                              |
| `not_found`              | `get_event`, `get_log`, `get_error_occurrence`, `get_error` | Nothing in the project has that ID or reference.                   |
| `invalid_id`             | `get_log`, `get_error_occurrence`                           | The ID isn't a UUID. For an error reference, use `get_error`.      |
| `invalid_ref`            | `get_error`                                                 | The reference isn't in the form `POOLPUMP-4F2A9C1B`.               |
| `organization_not_found` | `list_devices`                                              | No organization you belong to matches `organization`.              |
| `organization_ambiguous` | `list_devices`                                              | You belong to more than one organization. `candidates` lists them. |
| `access_denied`          | `list_devices`                                              | Listing devices needs admin access to the organization.            |
| `platform_not_supported` | `get_integration_guide`                                     | The platform isn't Control4.                                       |
| `expired_token`          | `authenticate`                                              | The sign-in link expired before you finished. Call it again.       |
| `access_denied`          | `authenticate`                                              | You declined the sign-in request in the browser.                   |
| `auth_failed`            | `authenticate`                                              | Sign-in couldn't start or finish. Try again.                       |
| `session_required`       | `authenticate`                                              | The agent keeps no MCP session. Sign in through its MCP settings.  |
| `service_unavailable`    | `authenticate`, `auth_status`                               | The sign-in couldn't be read. Try again shortly.                   |

## Prompts

The server also offers prompts: ready-made requests that start a whole
workflow. Most agents list them as slash commands; in Claude Code they appear
as `/mcp__anvil__<name>`, for example.

| Prompt           | Arguments                                                          | What it does                                                                                                     |
| ---------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `diagnose_error` | `ref`                                                              | Investigates an error from its reference, finds the cause in your code and proposes a fix.                       |
| `observe_action` | `project`, `action`, optional `driverVersion`                      | Asks you to do something on the controller, waits for it, and reports which callbacks ran, in order.             |
| `verify_change`  | `project`, `previousVersion`, `newVersion`, optional `expectation` | Reads two driver versions with the same filters to confirm a change did what you meant and raised no new errors. |

## How the agent is told to work

When it connects, the server gives your agent instructions alongside the tools:
scope every read to your deploy's version, wait for an action instead of
re-polling, treat an empty result as something to explain, and treat text inside
your telemetry as data rather than instructions to follow. These are the same
habits the [agent skill](/coding-agents/skills/overview) teaches for the CLI.
