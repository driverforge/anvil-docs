---
sidebar_position: 1
---

# Overview

The Anvil Agent is a driver that runs on a Control4 controller and is used by the Anvil SDK included with your drivers. It handles all the networking and authentication so your driver doesn't have to.

## Why Use an Agent?

The agent keeps Anvil's footprint in your driver minimal:

- **Fire and forget** - Your driver hands off events to the agent and moves on. No waiting for network responses.
- **Handles authentication** - The agent manages your Anvil session. Your driver just needs a project ID.
- **Handles delivery** - Retries, buffering, and connection management happen in the agent, not your driver.

This design means adding Anvil to your driver has virtually no performance impact.

## Requirements

- Control4 OS 3.1.0 or later
- At least one driver with the Anvil SDK
- Outbound network access from the controller:

| Host | Port | Protocol |
|------|------|----------|
| ingest.driverforge.dev | 8883 | MQTTS (MQTT over TLS) |

Most networks allow outbound connections by default. If you're behind a restrictive firewall, ensure this endpoint is permitted.

## Next Steps

- [Install the agent](/agent/installation)
- [Configure agent settings](/agent/configuration)
