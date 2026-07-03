---
sidebar_position: 4
description: Real-time log output from your driver, persisted across reloads with level filtering and search.
---

import Screenshot from '@site/src/components/Screenshot';

# Logs

The Logs page shows all log output from your driver in real time. Filter by level, search by message content, and pick up right where you left off — logs persist across driver reloads, so there's no need to keep Composer Pro's Lua tab open.

To learn how to forward logs from your driver to Anvil, see [Log Forwarding](/sdk/log-forwarding) in the SDK section.

<Screenshot name="logs" alt="Logs page showing real-time log stream with level filtering" />

## Real-Time Log Stream

Logs stream in as they happen. Each row shows:

- **Level** — coloured indicator (red for error, amber for warn, blue for info, green for debug, gray for trace)
- **Time** — when the log was recorded (hover for full timestamp)
- **Controller** — which controller the log came from
- **Event** — the linked event name, if the log was captured during an event handler
- **Message** — the full log message

### Pause and Resume

Click the **pause button** to freeze the stream while you read through logs. Events continue buffering in the background, and a badge shows how many are waiting. Click play to flush the buffer and resume.

## Log Detail

Click any log row to open the detail drawer.

<Screenshot name="logs-detail" alt="Log detail drawer showing full message and context" />

The detail drawer shows:

- Full timestamp
- Level badge
- Complete message text (selectable for copying)
- Tags (if present)
- JSON context data
- Linked event (if the log was captured during an event handler — click to jump to that event; see [Logs vs Events](/platform/logs-vs-events))

## Histogram

A bar chart above the log list shows log volume over time. Hover for a breakdown by level with counts. The histogram adjusts its bucket size based on the selected time range.

## Filtering

### Time Range

Select from preset ranges: 15 minutes through to 90 days, clamped to your plan's retention period.

### Message Search

Search for logs containing specific text. The search is a substring match with a short debounce, so results update as you type. Message search is available on all plans.

### Facets

Filter by multiple dimensions:

- **Levels** — Error, Fatal, Warn, Warning, Info, Debug, Trace (with counts)
- **Controllers** — filter by specific controller
- **Drivers** — filter by specific driver (with counts)

:::note
Facet filtering (Level, Controller, Driver) is available on paid plans. Message search and basic log streaming are available on all plans.
:::

## Keyboard Navigation

- `j` / `k` — move down / up through logs
- `Enter` — open the selected log's detail drawer
