---
sidebar_position: 2
---

# Authentication

The Driverforge CLI authenticates you with Driverforge so it can act on your behalf —
listing your organizations, talking to your controllers, and deploying drivers.
You sign in once with [`driverforge login`](/cli/login); the CLI stores the credentials
locally and refreshes them automatically, so you rarely think about it again until
you [`driverforge logout`](/cli/logout).

## Do I have to log in?

No — the core of the CLI works anonymously. You can author, [build](/cli/build),
package, encrypt, and [source-map](/cli/source-maps) a driver entirely offline,
with no account and nothing to sign up for. That's the whole local development
loop, available the moment you install `driverforge`.

Signing in unlocks the parts that go through the Anvil cloud — anything that needs
Driverforge to know who you are and which controllers are yours:
[`deploy`](/cli/deploy) and [`sync`](/cli/sync) to push a build to a controller,
[`upgrade`](/cli/upgrade) to update its agent, and [`org`](/cli/org) /
[`device`](/cli/device) to choose where those act.

## How it works

`driverforge login` uses the OAuth 2.0 device authorization grant: it shows a short
code, opens your browser to confirm it, and waits while you authorize — your
password is never entered into or seen by the CLI. Credentials are stored locally
and refreshed automatically.

## Commands

- [`driverforge login`](/cli/login) — sign in to Driverforge
- [`driverforge logout`](/cli/logout) — sign out and remove stored credentials
- [`driverforge whoami`](/cli/whoami) — show the currently signed-in user
