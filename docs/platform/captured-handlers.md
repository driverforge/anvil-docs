---
sidebar_position: 3
description: The handler calls Anvil captures automatically, and how to see which Control4 events your driver still needs to handle.
---

# Captured Handlers

The Anvil SDK automatically captures handler calls from your driver — there's
nothing to wire up per handler. Every captured call appears on the
[Events](/platform/events) page in real time.

## What's Captured

The SDK automatically captures 100+ handlers, including:

- Lifecycle events (`OnDriverInit`, `OnDriverLateInit`, `OnDriverDestroyed`, etc.)
- Property and binding events (`OnPropertyChanged`, `OnBindingChanged`, etc.)
- Commands (`ExecuteCommand`, `ReceivedFromProxy`, etc.)
- System events (`OnSystemEvent`, `OnTimerExpired`, etc.)

See [Automatic Capture](/sdk/automatic-capture) for the full list.

## Implementation Coverage

Anvil knows the full set of handlers Control4 can call, so it can show you not
just the events your driver *handles* but also the ones it *doesn't*. An
**unimplemented** handler is one Control4 may invoke that your driver doesn't
define yet.

On the [Events](/platform/events) page, the **Implementation Status** filter
switches between all events, only implemented handlers, or only unimplemented
ones — unimplemented events render at reduced opacity so they stand out. It's a
quick way to see which Control4 events your driver still needs to handle.
