---
sidebar_position: 2
description: Real-time stream of every handler call in your driver with arguments, timing, and status.
---

import Screenshot from '@site/src/components/Screenshot';

# Events

The Events page shows every handler call in your drivers in real time. See exactly what Control4 is sending, what arguments are passed, how long each handler takes, and whether it succeeded or threw an error.

<Screenshot name="events" alt="Events page showing real-time event stream with histogram" />

The page covers every project in your organization. Use the **project filter** at the top to narrow it to one driver, or leave it as-is to watch them all at once. See [Managing projects](/platform/projects) for how the filter works.

## Real-Time Event Stream

Events stream in as they happen, each one a two-line row:

- A **status glyph** showing whether the event succeeded, errored, warned, or something else. The glyph's shape carries the status as well as its colour, so it stays readable without relying on colour alone.
- The **handler name** (for example `OnPropertyChanged`, `ExecuteCommand`) with its **duration** alongside.
- Underneath, the **last log output** from that handler, or the error message if it threw.
- Trailing the row, badges naming the **project** and **platform** the event came from, the **controller** it ran on, and the **time** it occurred (hover for the full timestamp).

New events appear at the top of the list with a brief pulse animation, tinted by status, so you can see what just arrived.

### Pause and Resume

Click the **pause button** next to the time filter to freeze the stream while you inspect something. While paused:
- Events continue to buffer in the background
- A badge shows how many events are waiting (red if any contain errors)
- Click play to flush the buffer and resume live streaming

### Jump to Live

If you scroll down through older events, a **Jump to live** button appears to snap you back to the latest events.

## Event Detail

Click any event row to open the detail drawer.

<Screenshot name="events-detail" alt="Event detail drawer showing arguments, logs, and timing" />

The drawer opens on the **Logs** tab, since what your code did during the handler is usually the reason you clicked. The tabs are:

- **Logs**, every log message captured during this event's execution, as a numbered console you can search
- **Arguments**, a full JSON view of the arguments Control4 passed
- **Error** if the event threw (the error type, value, and full stack trace), or **Return Value** if it didn't
- **Details**, the event's metadata (driver, controller, and the like) plus the raw event JSON

Events are shareable: use the link button in the drawer header to copy a URL that opens the same event for whoever you send it to.

## Histogram

Above the event list, a stacked bar chart shows event volume over time. Bars are coloured by status so you can quickly spot error spikes. Hover over any bar for a breakdown by status with counts.

The histogram automatically adjusts its bucket size based on the selected time range.

## Filtering

### Projects

The project filter narrows the stream (and the histogram and facet counts along with it) to the projects you tick. Your selection is held in the URL, so a filtered view is a link you can share.

### Time Range

Select a time range from the dropdown: 15 minutes, 1 hour, 4 hours, 1 day, 2 days, 7 days, 14 days, 30 days, 60 days, or 90 days. Available ranges are clamped to your plan's data retention period.

### Facets

Filter by multiple dimensions simultaneously:

- **Status** — Success, OK, Error, Fatal, Warning, Info, Debug, Trace
- **Event Name** — multi-select dropdown showing all captured handlers with counts
- **Controller** — filter by specific controller (shown as formatted MAC address)

Each facet shows the count of matching events, so you can see the distribution at a glance.

### Implementation Status

Toggle between showing all events, only implemented handlers, or only unimplemented handlers. Unimplemented events are shown at reduced opacity so they're visually distinct. See [Captured Handlers](/platform/captured-handlers) for what Anvil captures and how implementation coverage works.

:::note
Facet filtering (Status, Event Name, Controller) is available on paid plans. Implementation status filtering and basic event streaming are available on all plans.
:::

## Keyboard Navigation

Navigate the event list without leaving your keyboard:

- `j` / `k` (or `↓` / `↑`) to move down and up through events
- `Enter` to open the selected event's detail drawer, and `Esc` to close it

With the drawer open, `j` and `k` move it straight to the next or previous event. Press `?` for the full shortcut list, including time-range and pause shortcuts.

:::note
If every project in the current filter is a Monitor-mode project, Events disappears from the sidebar: production monitoring is concerned with logs and errors rather than the handler-by-handler stream. Selecting a project that isn't in Monitor mode brings it back.
:::
