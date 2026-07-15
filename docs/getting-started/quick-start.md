---
sidebar_position: 2
description: Add Anvil to your Control4 driver in under 5 minutes and start seeing real-time event data.
---

import DownloadSDK from '@site/src/components/DownloadSDK';

# Quick Start

Anvil is easy to add to your driver. Install the agent, add the client library and configure your driver in under 5 minutes to start seeing real time information about your driver.

## Prerequisites

- The Anvil Agent installed and authenticated on your controller ([setup guide](/agent/installation))
- A project created in [Anvil](https://app.driverforge.dev)

## 1. Download the Anvil SDK

Download the latest Anvil SDK and place the contents in your driver's `vendor/` directory.

<DownloadSDK />

## 2. Add vendor directory to your .c4zproj manifest

Make sure the vendor directory is included in your manifest:

```xml
<Item type="dir" c4zDir="vendor" name="vendor" recurse="true" exclude="false"/>
```

:::tip Using Squish?
If your project uses a squishy file, you can bundle the SDK into your squished
driver instead of shipping the vendor directory:

```lua
Module "vendor.anvil-sdk" "vendor/anvil-sdk.lua"
```

The `require('vendor.anvil-sdk')` call in the next step is the same either
way — squish satisfies it from the bundle; otherwise Director resolves the
vendored file from your packaged driver.
:::

## 3. Initialize Anvil in OnDriverInit

Update your `OnDriverInit` function to load the SDK and initialize it with your API key (from **Settings > API Keys** in Anvil):

```lua
function OnDriverInit(strDIR)
    require('vendor.anvil-sdk')

    Anvil:Init("YOUR_API_KEY", C4:GetDriverFileName())

    Anvil:OnDriverInit(function(strDIR)
        -- Your existing OnDriverInit code goes here
    end, strDIR)
end
```

:::info
`OnDriverInit` is a special case — it runs before the SDK can auto-instrument, so it needs the explicit `Anvil:OnDriverInit` wrapper. All other lifecycle methods (`OnDriverLateInit`, `OnPropertyChanged`, etc.) are automatically instrumented — just write them normally.
:::

## 4. Build and deploy

Build your driver and load it onto your controller. Events will start streaming to Anvil immediately.

## 5. View your data in Anvil

Open your project in [Anvil](https://app.driverforge.dev) to see data flowing in real time. The [Events](/platform/events) page shows every handler call as it happens, [Logs](/platform/logs) shows your driver's log output, and [Errors](/platform/errors) surfaces any exceptions with full stack traces. Interact with your driver in a navigator or Composer to see events appear instantly.

## Next Steps

- Learn about [automatic event capture](/sdk/automatic-capture)
- See how to [capture timer and URL callback errors](/sdk/manual-capture)
- Review the [API reference](/sdk/api-reference)
- Read the detailed [Installation guide](/sdk/installation) for advanced configuration
