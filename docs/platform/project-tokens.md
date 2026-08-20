---
sidebar_position: 5
description: How your project token works, why it's safe to commit, and how it differs from a secret API key.
---

# Project tokens

Every Anvil project has a **project token** that your driver uses to send telemetry (events, logs, and errors) to that project. It's the value you pass to `Driverforge:Init()` in your driver. The token is created with the project, so you can start sending data the moment the project exists.

Anvil has two classes of credential, and they behave differently:

| Class                          | Where it lives                                          | What it's for                                                            |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Static token** (publishable) | On the thing it identifies — a project, an installation | Naming which project telemetry belongs to. Safe to embed and distribute. |
| **API key** (secret)           | Organization settings                                   | Server-side access to the Anvil API. A credential to protect.            |

The rest of this page is about your project token, which is what you need to send telemetry. Organization-level secret API keys are still in development; you'll find the placeholder under **Settings → API Keys**.

## Safe to commit

**You can commit your project token directly in your driver source**, for example in your `OnDriverInit` function:

```lua
Driverforge:Init("drv_3HipSk6nrxTCGGDvhDB8hXpmmEK")
```

This is intentional and safe, and it's worth knowing _why_ rather than taking it on trust.

A project token **identifies**; it doesn't authenticate or authorise. It answers "which project is this telemetry for?", the same job an `{id}` segment does in a URL. Something else proves who is sending: the agent holds a signed token from Anvil's identity server, the broker verifies it on connect, and Anvil then checks that the sender has permission on the project's organisation. Your project token is not what gets you in.

So a copy of your token doesn't let anyone in. It's designed to be embedded in the driver you distribute to customers, so it already travels inside every copy you ship. You **don't** need build-time secret injection, environment variables, or a secrets manager for it.

:::tip
Don't build a pipeline to keep your project token out of source control. It isn't a secret; commit it like any other configuration value.
:::

## What a project token can do

Project tokens are **write-only**. A token names exactly one project, and telemetry sent with it lands in that project. It **cannot**:

- read any of your events, logs, or errors,
- change project or organization settings,
- access any other project, or
- act on your account in any way.

That narrow scope is what makes the token safe to embed and distribute.

## Recognising a token

Project tokens begin with `drv_`, followed by 27 characters:

```
drv_3HipSk6nrxTCGGDvhDB8hXpmmEK
```

Other prefixes you may come across:

- `inst_…` identifies an installation — a specific site where a dealer installed your driver.
- `dfa_…` and `dfs_…` are secret organization API keys. Anything starting `df` is a secret, always. These are stored hashed and shown only once, so they behave nothing like a project token.

## Your project token doesn't expire

A project has **one** project token, for its whole life. There's nothing to rotate, expire or revoke, and no list of old tokens to keep track of.

Open **Settings → Projects**, click the **gear icon** on the project's row, and find the **Project Token** section in the drawer that opens. Copy it whenever you need it — the full value stays available, because it isn't a secret.

This is deliberate. Your token ships inside compiled drivers installed on controllers in customers' homes, and those aren't updated in place. A token that could be revoked would mean an action in Anvil could stop every installed copy of your driver reporting, without stopping anyone who had already taken a copy of the value. Since the token grants nothing on its own, there's nothing worth that trade.

If you need telemetry to stop arriving for a project entirely, delete the project.
