---
sidebar_position: 4
---

# Manual Capture

Some contexts can't be automatically instrumented. `C4` is a protected userdata object in Lua, so we can't wrap its methods. Timer callbacks and URL responses need explicit handling.

:::tip
This page covers **error** capture in async contexts. For **log** forwarding, see [Log Forwarding](/sdk/log-forwarding) — Anvil can wrap your existing logger so log messages are forwarded automatically.
:::

## Why This Matters

Without manual capture, errors in these contexts are printed to the Lua output but **not captured by Anvil**:

```lua
-- This error appears in Lua output but Anvil can't capture it
C4:SetTimer(5000, function(timer)
    error("This won't show up in Anvil!")
end)
```

Control4 logs the error to the Lua output, but it's easy to miss — buried in log output that gets lost between Composer refreshes and driver reloads. Anvil can't instrument `C4:SetTimer` callbacks automatically because `C4` is a protected userdata object.

## Timers: Use `Anvil:SetTimer()`

Instead of `C4:SetTimer`, use `Anvil:SetTimer`:

```lua
-- Before: errors only appear in Lua output, not captured by Anvil
C4:SetTimer(5000, function(timer)
    DoSomething()  -- if this throws, it's logged but not in Anvil
end)

-- After: errors captured by Anvil with full context
Anvil:SetTimer(5000, function(timer)
    DoSomething()  -- errors are captured with full stack trace
end)
```

It's a drop-in replacement with the same signature:

```lua
Anvil:SetTimer(duration, callback, ...)
```

### Recurring Timers

Works the same way:

```lua
Anvil:SetTimer(30000, function(timer)
    PollDevice()
    timer:Start()  -- restart for next poll
end)
```

## URL Callbacks: Use `Anvil:captureError()`

URL callbacks need a bit more work. Wrap your code with `xpcall`:

```lua
C4:url():OnDone(function(transfer, responses, errCode, errMsg)
    local ok, err = xpcall(function()
        -- Your code here
        local data = JSON:decode(responses[transfer].body)
        ProcessResponse(data)
    end, function(e)
        Anvil:captureError(e)
        return e
    end)
end):Get("https://api.example.com/status")
```

### Helper Pattern

If you make lots of HTTP calls, create a helper:

```lua
local function safeCallback(fn)
    return function(...)
        local args = {...}
        local ok, err = xpcall(function()
            fn(table.unpack(args))
        end, function(e)
            Anvil:captureError(e)
            return e
        end)
    end
end

-- Then use it everywhere
C4:url():OnDone(safeCallback(function(transfer, responses, errCode, errMsg)
    -- Your code - errors automatically captured
    ProcessResponse(responses[transfer])
end)):Get(url)
```

### Adding Context

Include context to make errors easier to understand:

```lua
Anvil:captureError(err, nil, {
    eventName = "API_Request",
    args = {
        url = "https://api.example.com/status",
        method = "GET"
    }
})
```

This shows up in Anvil:

```
✗ API_Request
  url: "https://api.example.com/status"
  method: "GET"

  ERROR: unexpected response format
    driver.lua:156: in function 'parseResponse'
```

## `Anvil:captureError()` Reference

```lua
Anvil:captureError(message, stacktrace?, context?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | string | The error message |
| `stacktrace` | string or nil | Stack trace (auto-captured if nil) |
| `context` | table or nil | Additional context |

### Context Fields

| Field | Purpose |
|-------|---------|
| `eventName` | Groups errors in Anvil |
| `args` | Key-value pairs shown with the error |

## Quick Reference

**Timers:**
```lua
-- Just swap C4:SetTimer for Anvil:SetTimer
Anvil:SetTimer(5000, function(timer)
    -- errors captured automatically
end)
```

**URL callbacks:**
```lua
C4:url():OnDone(function(...)
    local ok, err = xpcall(function()
        -- your code
    end, function(e)
        Anvil:captureError(e)
        return e
    end)
end):Get(url)
```

**Manual errors:**
```lua
Anvil:captureError("Something went wrong", nil, {
    eventName = "CustomOperation",
    args = { detail = "value" }
})
```
