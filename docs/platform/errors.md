---
sidebar_position: 6
description: View grouped error exceptions from your driver with stack traces, occurrences, and trend sparklines.
---

import Screenshot from '@site/src/components/Screenshot';

# Errors

The Errors page groups exceptions thrown by your driver so you can focus on unique issues rather than wading through duplicates. Each error group shows how often it occurs, when it was last seen, and a trend sparkline.

<Screenshot name="errors" alt="Errors page showing grouped errors with counts and sparklines" />

## Error Groups

Errors are automatically grouped by their fingerprint (see [Error Grouping](/platform/error-grouping) for details). The error list shows:

- **Type and Value** — the error type (e.g. `LuaError`) and the error message
- **Count** — total number of occurrences
- **Last Seen** — when the error last occurred (hover for full timestamp)
- **Age** — how long ago the error was first seen
- **Trend** — a sparkline showing occurrence frequency over the last 24 hours

This lets you quickly see which errors are frequent, which are new, and which are trending up or down.

## Error Detail

Click an error group to open the detail page.

<Screenshot name="errors-detail" alt="Error detail page showing stack trace, occurrences, and metadata" />

This gives you everything you need to diagnose the issue:

### Stack Trace

A formatted, syntax-highlighted view of the call stack showing file names, line numbers, and function names. If you've uploaded [source maps](/cli/source-maps), the stack trace maps back to your original source files rather than the bundled output.

### Occurrences

A table of every individual occurrence of this error, showing:

- **Error ID** — unique identifier (click to view that specific occurrence)
- **Timestamp** — when it happened
- **Message** — the error message for this occurrence
- **Version** — the driver version that produced it

Navigate between occurrences using the **Previous** / **Next** buttons, or jump to the first or last occurrence.

### Info

Metadata about the error group:

- **Affected versions** — which driver versions have produced this error
- **Affected controllers** — which controllers it's occurred on
- **Affected drivers** — which drivers it's appeared in
- **Event name** — the handler that was executing when the error occurred

### Context

Expandable sections showing:

- **Tags** — key-value pairs attached to the error
- **Context data** — full JSON payload from the error context
- **Grouping info** — the fingerprint strategy, hash, and raw grouping data used to identify this error group

## Histogram

A bar chart above the error list shows error volume over time. Hover for counts at each time bucket. The histogram adjusts automatically based on the selected time range.

## Real-Time Streaming

New errors stream in via WebSocket. When a new occurrence of an existing error arrives, the group's count, last seen, and sparkline update in place. New error groups appear at the top of the list.

The same pause/resume controls from Events and Logs are available — pause the stream to inspect, and a badge shows how many errors are buffered.

## Automatic Capture

Errors in event handlers are captured automatically. You don't need to add any error handling code — just add the Anvil SDK and errors appear in Anvil.

Note that errors in `C4:SetTimer` and `C4:url()` callbacks need manual instrumentation because `C4` is a protected userdata object. See [Manual Capture](/sdk/manual-capture) for details.

## Keyboard Navigation

- `j` / `k` — move down / up through error groups
- `Enter` — open the selected error's detail page
