---
sidebar_position: 2
---

# FAQ

## General

### What is Anvil?

Anvil is a developer platform for Control4. It streams events from your driver so you can see every handler call, the arguments Control4 passed, and any errors that occurred.

### Why do I need this?

Control4 driver development can be opaque. You don't always know what data the system is sending you, and errors get silently swallowed. Anvil gives you visibility into what's actually happening.

### What events are captured?

All standard C4 event handlers - over 100 of them. `OnPropertyChanged`, `ExecuteCommand`, `ReceivedFromProxy`, lifecycle events, binding events, and more.

## Setup

### Do I need to modify my existing handlers?

No. Just add the SDK and call `Anvil:Init()`. Your existing handler code works unchanged.

### What's the minimum code I need to add?

Two lines in `OnDriverInit`:

```lua
require('vendor.anvil-sdk')
Anvil:Init(apiKey, C4:GetDriverFileName())
```

### Does it work with existing drivers?

Yes. Add the SDK file and the two init lines. Your driver continues working as before, with events now streaming to Anvil.

## Technical

### Why can't timer callbacks be auto-captured?

`C4` is a protected userdata object in Lua. We can't monkey-patch its methods like `SetTimer`. Use `Anvil:SetTimer()` instead for the same functionality with error capture.

### What's the performance impact?

Minimal. Each handler call adds roughly 1ms of overhead for the instrumentation wrapper. Events are streamed asynchronously.

### Does my driver still work without the agent?

Yes. If the agent isn't installed, the SDK operates in a no-op mode. Your driver works normally, events just don't stream anywhere. It's safe to leave the Anvil SDK and `Anvil:Init()` call in your release builds — in no-op mode it adds virtually zero overhead to your driver.

### What data is sent?

- Handler names
- Arguments passed to handlers (property names, command params, etc.)
- Execution timing
- Error messages and stack traces
- Driver version

:::note
Anvil captures the actual argument values passed to your handlers and the content of log messages. If your driver handles sensitive data (e.g. access codes, user credentials, PII), that data may be included in what's streamed to Anvil. Anvil is designed for use during development, so in practice this is limited to test data on your development controller rather than real customer data.
:::

## Using Anvil

### Can I filter the event stream?

Yes. Basic filtering — by handler name, type, and severity — is available on all plans. Advanced filtering, including free text search, is available on paid plans.

### Can I have multiple projects?

Free plans include a single project. Paid plans support unlimited projects.

### How far back can I see events?

Data retention varies by plan. Check the [pricing page](https://driverforge.dev/pricing) for details on each plan's retention period.

Having issues? See the [Troubleshooting](/reference/troubleshooting) page.
