---
sidebar_position: 6
---

# API Reference

Complete reference for the Driverforge SDK.

---

## `Driverforge:Init()`

Initialize the SDK. Call this in `OnDriverInit` before anything else.

```lua
Driverforge:Init(token, opts?)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | Your project's [project token](/platform/project-tokens) (`drv_…`) |
| `opts` | table | No | Configuration options |

The driver's filename is not a parameter. The SDK reads it from
`C4:GetDriverFileName()` itself, so the name it reports always matches the file
actually running.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logger` | table | — | Your existing logger instance (see [Automatic Logs](/sdk/log-forwarding)) |
| `logMap` | table | — | Maps canonical levels to your logger's method names |

#### `logMap`

For each canonical level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`), Anvil probes your logger for a method matching common case variants in this order: lowercase → PascalCase → UPPERCASE. The first match is wrapped. So a logger with `info`/`Info`/`INFO` style methods works without any `logMap`.

`logMap` is only needed when a method has a **genuinely renamed** counterpart — typically when the canonical level word doesn't appear in the method name at all. For example, a logger that uses `Alert` for the fatal level:

```lua
Driverforge:Init("YOUR_API_KEY", {
    logger = Log,
    logMap = {
        fatal = "Alert",   -- only the semantic mismatch needs an entry
    }
})
```

The keys are Anvil's canonical levels (always lowercase), the values are the method names on your logger. Only include levels where the method name doesn't match any case variant of the canonical word.

### Example

```lua
function OnDriverInit(strDIR)
    require('vendor.driverforge-sdk')
    Driverforge:Init("YOUR_API_KEY")
end
```

---

## `Anvil:SetTimer()`

Create a timer with automatic error capture. Drop-in replacement for `C4:SetTimer`.

```lua
Anvil:SetTimer(duration, callback, ...)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `duration` | number | Yes | Milliseconds until callback fires |
| `callback` | function | Yes | Function to call |
| `...` | any | No | Additional args for `C4:SetTimer` |

### Returns

The timer object from `C4:SetTimer`.

### Example

```lua
-- One-shot timer
Anvil:SetTimer(5000, function(timer)
    RefreshStatus()
end)

-- Recurring timer
Anvil:SetTimer(30000, function(timer)
    PollDevice()
    timer:Start()
end)
```

---

## `Anvil:CaptureError()`

Manually capture an error. Use this for URL callbacks and other async contexts.

```lua
Anvil:CaptureError(message, stacktrace?, context?)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The error message |
| `stacktrace` | string/nil | No | Stack trace (auto-captured if nil) |
| `context` | table/nil | No | Additional context |

### Context Fields

| Field | Type | Description |
|-------|------|-------------|
| `eventName` | string | Name shown in Anvil, used for grouping |
| `args` | table | Key-value pairs displayed with the error |

### Examples

```lua
-- Basic
Anvil:CaptureError("Connection failed")

-- With context
Anvil:CaptureError("Parse error", nil, {
    eventName = "API_Response",
    args = {
        endpoint = "/devices",
        statusCode = 200
    }
})

-- In a URL callback
C4:url():OnDone(function(transfer, responses, errCode, errMsg)
    local ok, err = xpcall(function()
        ProcessResponse(responses)
    end, function(e)
        Anvil:CaptureError(e, nil, {
            eventName = "HTTP_Callback",
            args = { url = requestUrl }
        })
        return e
    end)
end):Get(requestUrl)
```

---

## `Anvil:OnDriverInit()`

Wrap your `OnDriverInit` code. Ensures the SDK is fully ready before your code runs.

```lua
Anvil:OnDriverInit(callback, ...)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `callback` | function | Yes | Your init function |
| `...` | any | No | Arguments to pass to callback |

### Example

```lua
function OnDriverInit(strDIR)
    require('vendor.driverforge-sdk')
    Driverforge:Init("YOUR_API_KEY")

    Anvil:OnDriverInit(function(strDIR)
        -- Your init code here
        C4:UpdateProperty("Version", C4:GetDriverConfigInfo("version"))
        InitializeDevice()
    end, strDIR)
end
```

---

## `Anvil:ForwardLog()`

Manually forward a log message to Anvil. Not needed if you're using the `logger` option in `Driverforge:Init()` — see [Automatic Logs](/sdk/log-forwarding).

```lua
Anvil:ForwardLog(level, message)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `level` | string | Yes | "DEBUG", "INFO", "WARN", "ERROR", "TRACE" |
| `message` | string | Yes | The log message |

### Example

```lua
Anvil:ForwardLog("INFO", "Device connected")
Anvil:ForwardLog("ERROR", "Failed to parse response")
```

---

