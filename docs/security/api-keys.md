---
sidebar_position: 1
description: How Anvil API keys work, why they're safe to commit in your driver, and how to manage them.
---

# API Keys

Every Anvil project has an **API key** that your driver uses to send telemetry — events, logs, and errors — to your project. It's the value you pass to `Anvil:Init()` in your driver. A new project is created with a **Default API Key** so you can start sending data right away.

## Safe to commit

**You can commit your API key directly in your driver source** — for example, in your `OnDriverInit` function:

```lua
Anvil:Init("dfp_…", C4:GetDriverFileName())
```

This is intentional and safe. An Anvil project key is a **publishable** credential. It's designed to be embedded in the driver you distribute to customers, so it already travels inside every copy of your driver. You **don't** need build-time secret injection, environment variables, or a secrets manager for it.

:::tip
Don't build a pipeline to keep your project key out of source control — it's not a secret. Commit it like any other configuration value.
:::

## What an API key can do

Anvil project keys are **publish-only ingestion keys**. A key can do exactly one thing: publish telemetry to the single project it belongs to. It **cannot**:

- read any of your events, logs, or errors,
- change project or organization settings,
- access any other project, or
- act on your account in any way.

That narrow scope is what makes the key safe to embed and distribute. The worst anyone could do with a copy of your key is send extra telemetry into your project — a nuisance, not a breach — and you can cut that off any time by revoking the key.

## Recognising a key

Project keys begin with a short prefix:

- `dfp_…` — a standard project key
- `dfm_…` — a key for a Monitor-mode project

Both are publishable ingestion keys; the prefix just tells you which kind of
project the key belongs to.

## Managing keys

Create, view, and revoke keys under **Settings → API Keys** in your Anvil project.

- **Create** a key at any time. Give it a descriptive name so you can tell keys
  apart later, and optionally set an **expiry date** — by default a new key is
  valid for 12 months. A key with no expiry stays valid indefinitely.
- **View** existing keys — project keys are publishable, so the full value stays
  available to copy whenever you need it. Each key shows when it was created, when
  it was last used, and when it expires.
- **Revoke** a key to cut it off — for example, if one is being abused to send
  junk telemetry. You'll confirm by typing the key's name. Revocation takes effect
  immediately and **cannot be undone**; create a replacement and update your
  driver. Expired and revoked keys are kept in a list for your reference.

:::tip
Use a separate key per driver (or per build configuration) and give each a clear name. If you ever need to revoke one, you only have to update that one driver — not every driver you ship.
:::
