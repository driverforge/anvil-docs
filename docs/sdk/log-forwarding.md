---
sidebar_position: 5
---

# Log Forwarding

The Anvil SDK can forward your driver's log messages to Anvil in real time, so they appear on the [Logs](/platform/logs) page alongside your events and errors. No changes to your existing logging code required.

## Automatic Forwarding (Recommended)

Pass your logger to `Anvil:Init()` and all log calls are automatically intercepted and forwarded:

```lua
Anvil:Init("YOUR_API_KEY", C4:GetDriverFileName(), {
    logger = myLogger
})
```

That's it. Calls to `myLogger:info()`, `myLogger:error()`, etc. now appear in Anvil automatically. Your logger continues to work exactly as before — same methods, same output.

### Custom Method Names

For each canonical level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`), Anvil probes your logger for a method matching common case variants in this order: lowercase → PascalCase → UPPERCASE. The first match is wrapped automatically.

In practice this means **most loggers work with no `logMap` at all**:

- A Pino-style logger with `info`/`error`/etc. — picked by the lowercase variant
- Snap One's standard `c4_log`, with `Info`/`Error`/etc. — picked by the PascalCase variant
- A logger using `INFO`/`ERROR` — picked by the UPPERCASE variant

`logMap` is only needed when a method has a **genuinely renamed** counterpart — typically when the canonical level word doesn't appear in the method name at all. For example, a logger that uses `Alert` for the fatal level:

```lua
Anvil:Init("YOUR_API_KEY", C4:GetDriverFileName(), {
    logger = Log,
    logMap = {
        fatal = "Alert",   -- only the semantic mismatch needs an entry
    }
})
```

The keys are Anvil's canonical levels (always lowercase), the values are the method names on your logger. Only include levels where the method name doesn't match any case variant of the canonical word.

See the [API Reference](/sdk/api-reference#logmap) for full details.

## Manual Forwarding

If you don't have a logging library, or prefer to control exactly which messages are forwarded, use `Anvil:ForwardLog()` directly:

```lua
Anvil:ForwardLog("INFO", "Device connected successfully")
Anvil:ForwardLog("DEBUG", "Received response: " .. response)
Anvil:ForwardLog("WARN", "Retrying connection...")
```

## Log Levels

| Level | Purpose |
|-------|---------|
| `FATAL` | Critical failures |
| `ERROR` | Error conditions |
| `WARN` | Warning conditions |
| `INFO` | General informational messages |
| `DEBUG` | Debug messages for development |
| `TRACE` | Detailed diagnostic information |

