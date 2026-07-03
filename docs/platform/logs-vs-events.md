---
sidebar_position: 5
description: How logs and events complement each other, and how each log links back to the handler that produced it.
---

# Logs vs Events

Logs and events complement each other:

- **Events** show you what Control4 sends to your driver — handler calls,
  arguments, timing
- **Logs** show you what your code does with it — your own messages, state, flow

Each log captured during an event handler is linked to that event. On the
[Events](/platform/events) page, you can open an event's detail drawer and switch
to the **Logs** tab to see exactly what your code logged during that handler's
execution.

It works the other way too: on the [Logs](/platform/logs) page, each log row
shows its linked event name — click through to jump to the event that was
executing when the log was recorded.
