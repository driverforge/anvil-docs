---
sidebar_position: 1
---

# Overview

The Anvil SDK is a Lua library that instruments your Control4 driver. It captures every event the system sends to your handlers and streams them to Anvil.

## What It Does

When you add the SDK to your driver:

1. **Every event is captured** - See what Control4 actually passes to your handlers
2. **Errors are caught** - Get full stack traces instead of silent failures
3. **Timing is recorded** - Know how long each handler takes to execute

## The Anvil Global

After loading the SDK, you get access to the `Anvil` global:

```lua
require('vendor.anvil_client')
Anvil:Init("your-api-key", C4:GetDriverFileName())
```

| Method                 | Purpose                           |
| ---------------------- | --------------------------------- |
| `Anvil:Init()`         | Initialize the SDK                |
| `Anvil:SetTimer()`     | Create a timer with error capture |
| `Anvil:captureError()` | Manually report an error          |

## Automatic vs Manual Capture

### Automatic

The SDK automatically instruments all standard C4 event handlers. You don't need to change your code - just add the SDK and your existing handlers are captured:

```lua
-- This just works - events stream to Anvil
function OnPropertyChanged(sProperty)
    local value = Properties[sProperty]
    ProcessProperty(sProperty, value)
end
```

See [Automatic Capture](/sdk/automatic-capture) for the full list of 100+ instrumented handlers.

### Manual

Some contexts can't be automatically instrumented because `C4` is a protected userdata object. Timer callbacks and URL responses need explicit wrapping:

```lua
-- Use Anvil:SetTimer instead of C4:SetTimer
Anvil:SetTimer(5000, function(timer)
    -- Errors here are captured
end)
```

See [Manual Capture](/sdk/manual-capture) for details.

## What Gets Streamed

Each event includes:

| Field              | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| **Event name**     | Which handler was called (`OnPropertyChanged`, `ExecuteCommand`, etc.) |
| **Arguments**      | The exact data Control4 passed to your handler                         |
| **Duration**       | How long your handler took to execute                                  |
| **Error**          | Stack trace if something threw                                         |
| **Timestamp**      | When the event occurred                                                |
| **Driver version** | From your `driver.xml` `<version>`                                     |

## Next Steps

- See the [full list of auto-captured handlers](/sdk/automatic-capture)
- Learn to [capture timer and URL errors](/sdk/manual-capture)
- Check the [API reference](/sdk/api-reference)
