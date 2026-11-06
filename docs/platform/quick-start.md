---
description: Add Anvil to your Control4 driver with the driverforge CLI and start seeing real-time event data.
---

# Quick start

Install the agent on your controller, let the `driverforge` CLI set up your
driver, and deploy it. Events start streaming to Anvil as soon as the driver
loads.

## Prerequisites

- **Control4 OS 3.3.1 or newer** on the controller running your driver
- An existing driver project: a directory with `src/manifest.c4zproj`
- An [Anvil](https://dev.driverforge.com) account

:::info[Older controllers]
On anything below OS 3.3.1 the SDK disables itself at load and your driver runs exactly as it would with no SDK vendored at all. Nothing breaks; you just get no telemetry. See [SDK installation](/sdk/installation#control4-os-331-or-newer) for what that looks like.
:::

## 1. Install the Anvil Agent

The agent is a system driver on your controller that streams your driver's
telemetry to Anvil. Install it and sign it in with the
[agent installation guide](/agent/installation).

## 2. Install the CLI

On macOS:

```bash
brew tap driverforge/tap
brew install driverforge
```

On Linux:

```bash
sh -c "$(curl -fsSL https://go.driverforge.com/get)"
```

See [CLI installation](/cli/installation) for Windows and the details of each
method.

## 3. Sign in

```bash
driverforge login
```

## 4. Set up your driver

From your driver project's directory, run:

```bash
driverforge init
```

[`init`](/cli/init) embeds the Driverforge SDK, wraps your `OnDriverInit` so
Anvil initializes when the driver loads, and links your driver to an Anvil
project, creating one if you need it. It shows you a diff of every change
before it writes anything.

## 5. Deploy

Choose the controller to deploy to, then deploy:

```bash
driverforge device select
driverforge deploy
```

[`deploy`](/cli/deploy) builds your driver, sends it to the agent on the
controller, and reloads it. Events start streaming to Anvil immediately.

## 6. View your data in Anvil

Open your project in [Anvil](https://dev.driverforge.com) to see data flowing in real time. The [Events](/platform/events) page shows every handler call as it happens, [Logs](/platform/logs) shows your driver's log output, and [Errors](/platform/errors) surfaces any exceptions with full stack traces. Interact with your driver in a navigator or Composer to see events appear instantly.

You can read the same data from the terminal with
[`driverforge events`](/cli/events), [`driverforge logs`](/cli/logs) and
[`driverforge errors`](/cli/errors).

## Setting up without the CLI

To add the SDK to your driver by hand instead, follow
[SDK installation](/sdk/installation).

## Next steps

- Learn about [automatic event capture](/sdk/automatic-capture)
- See how to [capture timer and URL callback errors](/sdk/manual-capture)
- Review the [API reference](/sdk/api-reference)
- Let a [coding agent](/coding-agents/overview) read your telemetry and work on the driver with you
