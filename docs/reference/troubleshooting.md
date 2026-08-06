---
sidebar_position: 1
---

# Troubleshooting

Common issues and how to fix them.

## No Events Appearing

### Check the Agent

1. Open Composer Pro
2. Select the Anvil Agent
3. Check the **Authentication status** property — it should show `Logged in as you@youremail.com`

If not logged in:
- Re-authenticate via **Actions** > **Get authentication link**
- Check the controller has internet access
- Verify outbound access to `ingest.driverforge.dev:8883` is not blocked by a firewall

### Check Your Driver

Make sure `Anvil:Init()` is called:

```lua
function OnDriverInit(strDIR)
    require('vendor.anvil-sdk')
    Anvil:Init(apiKey, C4:GetDriverFileName())
    -- ...
end
```

### Check Your Ingestion Token

The token passed to `Anvil:Init()` must be an active ingestion token for your Anvil project. In Anvil, open **Settings > Projects**, click the gear icon on your project, and copy the token directly from **Ingestion Token** to avoid typos. Check it hasn't expired or been revoked: a token you rotated away from will still be listed under **Previous tokens** with its status. See [API keys and ingestion tokens](/security/api-keys) for how tokens work and how to rotate.

### Trigger an Event

Try changing a property or executing a command in Composer. If basic events don't appear, something is wrong with the setup.

## SDK Not Loading

### Check the Path

Your `require()` path must match your directory structure:

```lua
-- If file is at src/vendor/anvil-sdk.lua
require('vendor.anvil-sdk')
```

### Check the Manifest

The SDK file must be in your `manifest.c4zproj`:

```xml
<Item type="dir" name="vendor" recurse="true" />
```

### Check Controller Logs

Look for Lua errors when the driver loads. Common issues:
- File not found
- Syntax errors in the SDK
- Missing dependencies

## Timer/URL Errors Not Showing

The SDK can't automatically capture errors in `C4:SetTimer` or `C4:url()` callbacks because `C4` is a protected userdata object. These need to be instrumented manually. See [Manual Capture](/sdk/manual-capture) for how to handle timers and URL callbacks.


## Events Delayed or Missing

### Check Network

Events stream over the network. High latency or packet loss can cause delays.

### Check Agent Debug Mode

Enable debug mode on the agent to see what it's receiving:
1. Select Anvil Agent in Composer
2. Set **Debug Mode** to "On"
3. Check Lua Output

## Still Stuck?

If nothing here helps:

1. Enable agent debug mode
2. Add debug prints to your driver
3. Check controller logs for errors
4. Verify network connectivity

## Need Help?

We're here to help. Reach out to our support team at [support@driverforge.com](mailto:support@driverforge.com) and we'll get you sorted.
