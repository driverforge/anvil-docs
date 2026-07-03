---
sidebar_position: 3
---

# Configuration

The agent works out of the box with sensible defaults. These settings are available for troubleshooting.

## Properties

View agent properties in Composer Pro by selecting the agent and opening the **Properties** tab.

### Status (Read-Only)

| Property | Description |
|----------|-------------|
| **Agent Version** | Current version of the installed agent |
| **Authentication status** | Login state (e.g., "Not logged in", "Logged in") |

### Authentication

| Property | Description |
|----------|-------------|
| **Authentication URL** | Click to open the browser and authenticate with your DriverForge account |

### Logging

| Property | Default | Description |
|----------|---------|-------------|
| **Log Mode** | Log | Where to output logs |
| **Log Level** | 2 - Warning | Verbosity of log output |

#### Log Mode Options

| Option | Description |
|--------|-------------|
| Off | No logging |
| Print | Output to Lua Output window |
| Log | Write to controller logs |
| Print and Log | Both |

#### Log Level Options

| Level | Description |
|-------|-------------|
| 0 - Fatal | Critical errors only |
| 1 - Error | Errors |
| 2 - Warning | Warnings and above (default) |
| 3 - Info | Informational messages |
| 4 - Debug | Detailed debug output |
| 5 - Trace | Maximum verbosity |

## Troubleshooting with Logs

To diagnose issues:

1. Select the Anvil Agent
2. Set **Log Mode** to "Print and Log"
3. Set **Log Level** to "4 - Debug" or "5 - Trace"
4. Check **Lua Output** in Composer

You'll see:
- Events received from drivers
- Connection status changes
- Any errors encountered

:::tip
If you set the log level to Debug or Trace, it will automatically revert to the previous setting after 30 minutes. This prevents accidentally leaving verbose logging enabled, which generates a lot of output.
:::

## Multiple Controllers

If you have multiple controllers in your dev setup:

- Install and authenticate the agent on each controller
- Each agent streams independently
- All events appear in the same project in Anvil
