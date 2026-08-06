---
sidebar_position: 1
description: How Anvil ingestion tokens work, why they're safe to commit in your driver, and how to rotate them.
---

# API keys and ingestion tokens

Every Anvil project has an **ingestion token** that your driver uses to send telemetry (events, logs, and errors) to that project. It's the value you pass to `Anvil:Init()` in your driver. A new project is created with one already minted, so you can start sending data right away.

Anvil has two classes of credential, and they behave differently:

| Class | Where it lives | What it's for |
|-------|----------------|---------------|
| **Ingestion token** (publishable) | Each project's settings | Sending telemetry from a driver. Safe to embed and distribute. |
| **API key** (secret) | Organization settings | Server-side access to the Anvil API. A credential to protect. |

The rest of this page is about ingestion tokens, which is what you need to send telemetry. Organization-level secret API keys are still in development; you'll find the placeholder under **Settings → API Keys**.

## Safe to commit

**You can commit your ingestion token directly in your driver source**, for example in your `OnDriverInit` function:

```lua
Anvil:Init("dfp_…", C4:GetDriverFileName())
```

This is intentional and safe. An ingestion token is a **publishable** credential. It's designed to be embedded in the driver you distribute to customers, so it already travels inside every copy of your driver. You **don't** need build-time secret injection, environment variables, or a secrets manager for it.

:::tip
Don't build a pipeline to keep your ingestion token out of source control. It isn't a secret; commit it like any other configuration value.
:::

## What an ingestion token can do

Ingestion tokens are **write-only**. A token can do exactly one thing: publish telemetry to the single project it belongs to. It **cannot**:

- read any of your events, logs, or errors,
- change project or organization settings,
- access any other project, or
- act on your account in any way.

That narrow scope is what makes the token safe to embed and distribute. The worst anyone could do with a copy of your token is send extra telemetry into your project, which is a nuisance rather than a breach, and you can cut that off at any time by rotating.

## Recognising a token

Ingestion tokens begin with a short prefix:

- `dfp_…` for a standard project
- `dfm_…` for a Monitor-mode project

Both are publishable; the prefix just tells you which kind of project the token
belongs to. Secret organization API keys use `dfa_…` and `dfs_…` instead, and are
stored hashed and shown only once.

## Managing your ingestion token

A project has **one** current ingestion token, because one token gets baked into
each compiled driver. Managing it is therefore about rotation rather than keeping
a list of named keys.

Open **Settings → Projects**, click the **gear icon** on the project's row, and
find the **Ingestion Token** section in the drawer that opens.

- **Copy** the current token whenever you need it. Ingestion tokens are
  publishable, so the full value stays available (reveal it with the eye button,
  or copy it straight from the masked field).
- **Rotate** the token with the refresh button next to it. Rotating mints a
  replacement for your next driver build. Because drivers already installed on
  customer hardware keep sending with the old token, you choose what happens to
  it: keep it valid until you revoke it, or expire it in 7, 30, or 90 days.
- **Revoke** a previous token once you're confident nothing is still using it.
  Previous tokens stay listed, with their expiry status, until they're gone.
  You'll confirm by typing the token's last four characters. Revocation takes
  effect immediately, stops any installed driver still sending with it, and
  **cannot be undone**.

:::tip
Give a rotation enough grace to reach the field. Pick an expiry window long
enough for your updated driver to be deployed to every controller that matters,
then revoke the old token once telemetry stops arriving on it.
:::
