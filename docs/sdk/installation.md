---
sidebar_position: 2
description: Add the Anvil SDK to your Control4 driver and configure it to stream events.
---

import DownloadSDK from '@site/src/components/DownloadSDK';

# Installation

## Prerequisites

The Anvil SDK requires the Anvil Agent to be installed and authenticated on your controller. The agent is a one-time setup per controller — all drivers on the same controller share it. See the [Agent Installation](/agent/installation) guide for instructions.

## Download

Download the latest Anvil SDK and place the contents in your driver's `vendor/` directory:

<DownloadSDK />

```
your_driver/
├── src/
│   ├── driver.lua
│   ├── driver.xml
│   └── vendor/
│       └── anvil_client.lua
└── manifest.c4zproj
```

### Manifest configuration

Include the vendor directory in your `manifest.c4zproj`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Driver>
  <Items>
    <Item type="file" name="driver.lua" />
    <Item type="file" name="driver.xml" />
    <Item type="dir" name="vendor" recurse="true" />
  </Items>
</Driver>
```

### Squish configuration

If your project uses a squishy build file, add the SDK module:

```lua
Module "vendor.anvil_client" "vendor/anvil_client.lua"
```

When using squish, require with dot notation: `require('vendor.anvil_client')` instead of `require('vendor/anvil_client.lua')`.

### Initialization

Add the SDK initialization to your `OnDriverInit`, using your API key from **Settings > API Keys** in Anvil:

```lua
function OnDriverInit(strDIR)
    require('vendor/anvil_client.lua')

    Anvil:Init("YOUR_API_KEY", C4:GetDriverFileName())

    Anvil:OnDriverInit(function(strDIR)
        -- Your existing OnDriverInit code goes here
    end, strDIR)
end
```

### Why OnDriverInit needs wrapping

`OnDriverInit` is a special case in the Control4 lifecycle. It runs before the SDK has a chance to instrument your handler functions, so it can't be auto-captured like other methods.

The `Anvil:OnDriverInit(function(strDIR) ... end, strDIR)` wrapper ensures:
- Your init code is captured as an event with timing and error handling
- Any errors in your init code are reported with full stack traces
- The SDK is fully initialized before your code runs

**All other lifecycle methods are automatically instrumented.** You don't need to wrap `OnDriverLateInit`, `OnPropertyChanged`, `ExecuteCommand`, or any of the [100+ auto-captured handlers](/sdk/automatic-capture) — just write them normally and they'll appear in Anvil.

### Load order: define handlers first

When the SDK loads, it wraps every C4 event handler your driver has defined so far, taking ownership of the handler globals (`OnDriverLateInit`, `OnPropertyChanged`, and the rest) so their events can be observed. Requiring it from `OnDriverInit` satisfies this naturally: Control4 calls `OnDriverInit` after your whole file has executed, so every top-level handler already exists.

The contract to keep in mind: **every C4 handler must be defined before the SDK loads.** A handler defined afterwards replaces the SDK's wrapper for that event:

- Events for that handler stop appearing in Anvil.
- If the replaced handler is `OnDriverLateInit`, the SDK never finishes initialising: [agent discovery](/sdk/automatic-capture#agent-discovery) never runs and nothing streams at all.

The SDK detects the situation and prints a warning to the controller log naming the redefined handler. If events go missing, that warning is the first thing to look for.

### Advanced configuration

`Anvil:Init()` accepts an optional third argument for advanced options:

```lua
Anvil:Init("YOUR_API_KEY", C4:GetDriverFileName(), {
    -- Forward your existing logger to Anvil
    logger = myLogger,

    -- Custom log method mapping (if your logger uses non-standard method names)
    logMap = {
        fatal = "critical",
        error = "err",
    },
})
```

If your driver uses a logging library, passing it to `Anvil:Init()` enables automatic log forwarding. See [Log Forwarding](/sdk/log-forwarding) for details.

See the [API Reference](/sdk/api-reference) for the complete list of options.

## Shipping your driver

There's no need for a separate release build without Anvil. Ship the driver you developed, SDK and `Anvil:Init()` call included:

- **The agent is the switch.** The SDK only captures on controllers where the Anvil Agent is installed and authenticated. On any other controller it goes inert after [agent discovery](/sdk/automatic-capture#agent-discovery): no capture, no queuing, and nothing leaves the controller.
- **Your API key can ship too.** Anvil API keys are publishable: they identify your project to the agent but grant no access to your data.

## Troubleshooting

### SDK not loading

- Check the `require()` path matches your directory structure
- Verify the vendor directory is in `manifest.c4zproj`
- Look for Lua errors in controller logs

### Driver not connecting to agent

- Ensure `Anvil:Init()` is called in `OnDriverInit`
- Reload your driver (disable and re-enable in Composer)
- Check the API key is correct

### No events in Anvil

- Verify the agent's **Authentication status** property shows you're logged in
- Confirm API keys match
- Check the controller log for a warning about a redefined handler (see [load order](#load-order-define-handlers-first))
- Try triggering an action manually

See [Troubleshooting](/reference/troubleshooting) for more help.
