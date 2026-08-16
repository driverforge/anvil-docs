---
sidebar_position: 1
---

# Troubleshooting

Common issues and how to fix them.

## No Events Appearing

### Check the Controller's OS Version

Anvil requires **Control4 OS 3.3.1 or newer**. Below that the SDK switches itself off at load, so a correctly-installed driver produces no telemetry at all — which looks identical to a broken setup.

Check the controller's logs for this line when the driver loads:

```
Anvil: this controller is running Control4 OS older than 3.3.1 - the SDK has
disabled itself and the driver will run uninstrumented.
```

Or ask the SDK directly — `Anvil:TelemetryStatus()` returns `unsupported-runtime` on a controller below the floor. If you see either, nothing else on this page will help: the controller needs upgrading.

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

### Check Your Driver Token

The token passed to `Anvil:Init()` must be the driver token of the project you're expecting data in. In Anvil, open **Settings > Projects**, click the gear icon on your project, and copy the token directly from **Driver Token** to avoid typos.

A driver token doesn't expire and can't be revoked, so there's no status to check — if it's the right value for the right project, it works. The usual causes are a typo, or a token copied from a different project than the one you're watching. Confirm the token in your driver matches the project whose Events page you have open.

See [Driver tokens and API keys](/security/api-keys) for how tokens work.

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
