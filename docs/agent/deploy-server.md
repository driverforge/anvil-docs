---
sidebar_position: 4
---

# Deploy Server

The deploy server is the part of the agent that receives drivers from the
[Driverforge CLI](/cli/overview). When you run `driverforge deploy` or
`driverforge sync`, the CLI connects to it directly over your local network,
and the agent installs the driver and reloads it on the controller.

It's on by default and needs no setup beyond signing the agent in.

## Requirements

- The agent is [signed in](/agent/installation#authenticate) with the **same Driverforge
  account** you use for `driverforge login`. The deploy server only accepts
  drivers from the account the agent is signed in with.
- The agent has connected to Driverforge at least once since it was signed in.
  That's when the controller is issued the certificate the deploy server uses
  for its secure connection.
- Your computer can reach the controller on the deploy server port:

| Direction                  | Port | Protocol |
| -------------------------- | ---- | -------- |
| Your computer → controller | 9443 | HTTPS    |

## Properties

The deploy server settings are under **Deploy Server Settings** on the agent's
**Properties** tab in Composer Pro.

| Property                  | Default | Description                                                               |
| ------------------------- | ------- | ------------------------------------------------------------------------- |
| **Documentation**         |         | Opens this page                                                           |
| **Deploy Server Enabled** | On      | Set to Off to stop the deploy server. The rest of the agent keeps running |
| **Deploy Server Port**    | 9443    | The port the deploy server listens on                                     |

Changing either property restarts the deploy server straight away.

### Using a different port

If another driver on the controller already uses port 9443, set
**Deploy Server Port** to a free port, then tell the CLI to use it:

```bash
export DRIVERFORGE_AGENT_PORT=9444
driverforge deploy
```

## Actions

| Action                    | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Restart Deploy Server** | Stops and starts the deploy server again, picking up a newly issued certificate |

Find it on the agent's **Actions** tab in Composer Pro.

## Security

Installing a driver runs code on the controller, so the deploy server is
locked down:

- **Encrypted.** Connections use TLS with a certificate issued to that
  controller. The CLI checks the certificate, so it can't be sent to anything
  pretending to be your controller.
- **Signed in.** Every request carries your Driverforge sign-in, and the agent
  checks it belongs to the account the agent is signed in with. Anyone else on
  the network is refused.
- **Can be switched off.** On a development controller you don't deploy to
  from the CLI, set **Deploy Server Enabled** to Off.

## Troubleshooting

To see what the deploy server is doing, turn on
[debug logging](/agent/configuration#troubleshooting-with-logs) and look for
lines starting `DeployServer:` in Lua Output.

- **The CLI can't reach the agent**: check **Deploy Server Enabled** is On,
  that your computer and the controller are on networks that can reach each
  other on the deploy server port, and that `DRIVERFORGE_AGENT_PORT` matches
  **Deploy Server Port** if you changed it.
- **Deploys are refused as not authorized**: the agent is signed in with a
  different account to the CLI, or isn't signed in. Check
  **Authentication status**, and sign in again if needed.
- **`no certificate has been issued yet` in Lua Output**: the controller hasn't
  received its certificate yet. Check the agent is signed in and the controller
  can reach the internet, then run **Restart Deploy Server**.
