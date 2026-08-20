---
sidebar_position: 2
description: Add the Driverforge SDK to your Control4 driver and configure it to stream events.
---

import DownloadSDK from '@site/src/components/DownloadSDK';

# Installation

## Prerequisites

### Control4 OS 3.3.1 or newer {#control4-os-331-or-newer}

Anvil requires **Control4 OS 3.3.1 or newer** on the controller running your driver.

Telemetry needs the Anvil Agent alongside your driver, and the agent needs 3.3.1. Below that the SDK disables itself at load and your driver runs exactly as it would with no SDK vendored at all — same return values, same errors, nothing captured, nothing retained. It says so once on the console rather than failing quietly:

```
Anvil: this controller is running Control4 OS older than 3.3.1 - the SDK has
disabled itself and the driver will run uninstrumented.
```

So a driver that ships with the SDK is safe to install anywhere; it simply produces no telemetry on a controller too old to deliver it. Ask the SDK what it is doing with `Anvil:TelemetryStatus()`, which reports `unsupported-runtime` in that case.

### The Anvil Agent

The Driverforge SDK requires the Anvil Agent to be installed and authenticated on your controller. The agent is a one-time setup per controller — all drivers on the same controller share it. See the [Agent Installation](/agent/installation) guide for instructions.

## Download

Download the latest Driverforge SDK and place the contents in your driver's `vendor/` directory:

<DownloadSDK />

```
your_driver/
├── src/
│   ├── driver.lua
│   ├── driver.xml
│   └── vendor/
│       └── driverforge-sdk.lua
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

If your project uses a squishy build file, you can bundle the SDK into your
squished driver instead of shipping the vendor directory:

```lua
Module "vendor.driverforge-sdk" "vendor/driverforge-sdk.lua"
```

The `require('vendor.driverforge-sdk')` call is identical either way — squish
satisfies it from the bundle, otherwise Director resolves the vendored file
from the packaged driver (which is how the worked example driver ships).

### Initialization

Add the SDK initialization to your `OnDriverInit`, using your project's project token (in Anvil, open **Settings > Projects**, click the gear icon on your project, and copy the token from **Project Token**):

```lua
function OnDriverInit(strDIR)
    require('vendor.driverforge-sdk')

    Driverforge:Init("YOUR_API_KEY")

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

`Driverforge:Init()` accepts an optional second argument for advanced options:

```lua
Driverforge:Init("YOUR_API_KEY", {
    -- Forward your existing logger to Anvil
    logger = myLogger,

    -- Custom log method mapping (if your logger uses non-standard method names)
    logMap = {
        fatal = "critical",
        error = "err",
    },
})
```

If your driver uses a logging library, passing it to `Driverforge:Init()` enables automatic log forwarding. See [Log Forwarding](/sdk/log-forwarding) for details.

See the [API Reference](/sdk/api-reference) for the complete list of options.

## Shipping your driver

There's no need for a separate release build without Anvil. Ship the driver you developed, SDK and `Driverforge:Init()` call included:

- **The agent is the switch.** The SDK only captures on controllers where the Anvil Agent is installed and authenticated. On any other controller it goes inert after [agent discovery](/sdk/automatic-capture#agent-discovery): no capture, no queuing, and nothing leaves the controller.
- **Your project token can ship too.** A project token is publishable: it identifies your project to the agent but grants no access to your data.
- **Your telemetry can't be lured away.** Before a driver sends anything, the SDK cryptographically verifies that the device it discovered is the genuine Anvil Agent; an impostor posing as the agent gets nothing. See [Agent Verification](/sdk/trust).

## Troubleshooting

### SDK not loading

- Check the `require()` path matches your directory structure
- Verify the vendor directory is in `manifest.c4zproj`
- Look for Lua errors in controller logs

### Driver not connecting to agent

- Ensure `Driverforge:Init()` is called in `OnDriverInit`
- Reload your driver (disable and re-enable in Composer)
- Check the project token is correct

### No events in Anvil

- Verify the agent's **Authentication status** property shows you're logged in
- Confirm the project token matches the project you are watching
- Check the controller log for a warning about a redefined handler (see [load order](#load-order-define-handlers-first))
- Try triggering an action manually

See [Troubleshooting](/reference/troubleshooting) for more help.
