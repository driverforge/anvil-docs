---
sidebar_position: 6
---

# API Reference

Complete reference for the Anvil SDK.

---

## `Anvil:Init()`

Initialize the SDK. Call this in `OnDriverInit` before anything else.

```lua
Anvil:Init(apiKey, driverFileName, opts?)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | string | Yes | Your Project Ingestion API key from Anvil |
| `driverFileName` | string | Yes | Usually `C4:GetDriverFileName()` |
| `opts` | table | No | Configuration options |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logger` | table | — | Your existing logger instance (see [Automatic Logs](/sdk/log-forwarding)) |
| `logMap` | table | — | Maps canonical levels to your logger's method names |

#### `logMap`

For each canonical level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`), Anvil probes your logger for a method matching common case variants in this order: lowercase → PascalCase → UPPERCASE. The first match is wrapped. So a logger with `info`/`Info`/`INFO` style methods works without any `logMap`.

`logMap` is only needed when a method has a **genuinely renamed** counterpart — typically when the canonical level word doesn't appear in the method name at all. For example, a logger that uses `Alert` for the fatal level:

```lua
Anvil:Init("proj_abc123", C4:GetDriverFileName(), {
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
    require('vendor.anvil_client')
    Anvil:Init("proj_abc123", C4:GetDriverFileName())
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

## `Anvil:captureError()`

Manually capture an error. Use this for URL callbacks and other async contexts.

```lua
Anvil:captureError(message, stacktrace?, context?)
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
Anvil:captureError("Connection failed")

-- With context
Anvil:captureError("Parse error", nil, {
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
        Anvil:captureError(e, nil, {
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
    require('vendor.anvil_client')
    Anvil:Init("proj_abc123", C4:GetDriverFileName())

    Anvil:OnDriverInit(function(strDIR)
        -- Your init code here
        C4:UpdateProperty("Version", C4:GetDriverConfigInfo("version"))
        InitializeDevice()
    end, strDIR)
end
```

---

## `Anvil:ForwardLog()`

Manually forward a log message to Anvil. Not needed if you're using the `logger` option in `Anvil:Init()` — see [Automatic Logs](/sdk/log-forwarding).

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

