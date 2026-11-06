---
sidebar_label: Tools
description: The tools the Anvil MCP server gives a coding agent, and the inputs each one takes.
---

# MCP tools

These are the tools the [Anvil MCP server](/coding-agents/mcp/setup) offers.
You don't call them yourself: your agent chooses them from what you ask. Knowing
what they do helps you ask for the right thing.

Every tool except `authenticate` and `auth_status` needs you to be
[signed in](/coding-agents/mcp/setup#sign-in), and only returns data from
projects your account belongs to. Tools that take a `projectId` accept either
the project's ID or its slug.

All results are JSON.

## Signing in

### `authenticate`

Signs the session in through your browser. The first call returns a link and a
code for you to approve; calling it again once you've approved completes the
sign-in. See [Sign in](/coding-agents/mcp/setup#with-the-authenticate-tool).

Takes no inputs.

### `auth_status`

Reports whether the session is signed in, and as whom.

Takes no inputs.

## Projects

### `list_projects`

Lists the Anvil projects you belong to, with each one's ID, slug, name,
platform and your role in it. Agents usually call this first to find the
project you're talking about.

Takes no inputs.

### `get_project`

Returns the details of one project.

| Input       | Required | Description               |
| ----------- | -------- | ------------------------- |
| `projectId` | Yes      | The project's ID or slug. |

### `get_integration_guide`

Returns step-by-step instructions for adding Anvil to a driver, filled in with
the project's own key and code examples. This is what an agent uses when you
ask it to set Anvil up in a driver.

| Input       | Required | Description                                              |
| ----------- | -------- | -------------------------------------------------------- |
| `projectId` | Yes      | The project's ID or slug.                                |
| `platform`  | No       | The target platform. Defaults to the project's platform. |

## Errors

### `list_errors`

Lists the [errors](/platform/errors) a project recorded in a time window, most
frequent first. Each one carries the reference to pass to `get_error`.

| Input              | Required | Description                                                                             |
| ------------------ | -------- | --------------------------------------------------------------------------------------- |
| `projectId`        | Yes      | The project's ID or slug.                                                               |
| `timeRangeMinutes` | No       | How far back to look, in minutes. Defaults to 1440 (24 hours); at most 43200 (30 days). |
| `limit`            | No       | The most errors to return. Defaults to 25; at most 100.                                 |

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

## Events

### `list_events`

Lists the [events](/platform/events) a project recorded in a time window,
newest first, each with its status, driver, controller, duration, arguments and
result. This is how an agent confirms what your driver actually did: ask it to
check the recent events after you trigger something on the controller.

| Input              | Required | Description                                                                |
| ------------------ | -------- | -------------------------------------------------------------------------- |
| `projectId`        | Yes      | The project's ID or slug.                                                  |
| `timeRangeMinutes` | No       | How far back to look, in minutes. Defaults to 15; at most 43200 (30 days). |
| `limit`            | No       | The most events to return. Defaults to 25; at most 500.                    |
| `eventNames`       | No       | Only events with one of these names, such as `PlayEpisode`.                |
| `drivers`          | No       | Only events from one of these drivers, such as `poolpump.c4z`.          |
| `controllers`      | No       | Only events from one of these controllers, by MAC address.                 |
| `statuses`         | No       | Only events with one of these statuses, such as `ok` or `error`.           |

### `get_event`

Returns one event with every log line it produced, in order: the arguments the
handler received, the result it returned, its status, and what it logged along
the way.

| Input       | Required | Description                                          |
| ----------- | -------- | ---------------------------------------------------- |
| `projectId` | Yes      | The project the event belongs to.                    |
| `traceId`   | Yes      | The event's `traceId`, as returned by `list_events`. |

## Logs

### `list_logs`

Lists the [log lines](/platform/logs) a project recorded in a time window,
newest first, so the agent can read your driver's output without you pasting
it in.

| Input              | Required | Description                                                                |
| ------------------ | -------- | -------------------------------------------------------------------------- |
| `projectId`        | Yes      | The project's ID or slug.                                                  |
| `timeRangeMinutes` | No       | How far back to look, in minutes. Defaults to 15; at most 43200 (30 days). |
| `limit`            | No       | The most log lines to return. Defaults to 100; at most 1000.               |
| `levels`           | No       | Only lines at one of these levels, such as `ERROR`, `WARN` or `INFO`.      |
| `drivers`          | No       | Only lines from one of these drivers.                                      |
| `controllers`      | No       | Only lines from one of these controllers, by MAC address.                  |
| `messageSearch`    | No       | Only lines whose message contains this text. Not case-sensitive.           |
| `traceId`          | No       | Only lines emitted during the event with this `traceId`.                   |
