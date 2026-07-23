---
sidebar_position: 3
---

# Organizations & devices

The deploy commands act on a specific controller inside a specific organization.
The CLI remembers both so you don't have to pass them every time: pick an
**organization** with [`driverforge org`](/cli/org), then a target **device**
(controller) with [`driverforge device`](/cli/device). Both require you to be
[signed in](/cli/authentication).

## How the target is chosen

When you run a controller-scoped command ([`deploy`](/cli/deploy),
[`sync`](/cli/sync), [`upgrade`](/cli/upgrade)), the CLI resolves the controller
in this order:

1. An explicit `--device <name|id>` flag
2. The remembered controller for the active organization
3. An interactive picker (when nothing is remembered)

Pass `--select` to any deploy command to force the picker and re-choose. The CLI
never silently picks a default — deploying to the wrong controller is risky, so
the choice is always explicit.

## Why the IP, not the hostname

A Control4 controller's hostname (e.g. `core1-000FFF…`) is an identifier, not a
resolvable DNS name, so the CLI connects by IP address. Selecting a controller
also pins its TLS certificate fingerprint, so the CLI can verify it's talking to
the right one on later deploys.

## Commands

- [`driverforge org`](/cli/org) — choose the active organization (`list` / `select` / `show`)
- [`driverforge device`](/cli/device) — choose the target controller (`list` / `select` / `show`)

## In your prompt

Using the [Spaceship prompt](/cli/spaceship)? A small zsh section can show the
active org and controller right in your shell prompt, so you always know what
a deploy will target.
