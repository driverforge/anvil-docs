---
sidebar_position: 0
---

# Overview

The Driverforge CLI (`driverforge`) is a single, dependency-free binary for Control4 driver
development. It builds and packages drivers locally, and — once you're signed in
— deploys them straight to a controller through the Anvil Agent, no manual
Composer import required.

## What it does

- **Build drivers** — Bundle Lua source with squish and produce a `.c4z`
  package, with optional script encryption and source maps
- **Deploy** — Build your driver and push it to a controller through the Anvil
  Agent, watching it reload, without switching to Composer
- **Sync** — Build and hot-swap a driver's Lua into the running instance for
  fast iteration, skipping the full reload
- **Manage context** — Sign in once, then choose the organization and the target
  controller the deploy commands act on
- **Upgrade the agent** — Update the Anvil Agent running on a controller to the
  latest release

## Quick Start

First, [install the CLI](/cli/installation) if you haven't already.

Building is entirely local and needs no account. Deploying does — it acts on a
real controller, so you sign in and pick a target first.

```bash
# 1. Build a .c4z from the current project
driverforge build

# 2. Sign in (opens your browser) and choose an organization
driverforge login

# 3. Set up the project for Anvil (SDK, project link, versioning scheme)
driverforge init

# 4. Pick the controller to deploy to
driverforge device select

# 5. Build and deploy in one step
driverforge deploy
```

## Commands

**Set up**

- [`driverforge init`](/cli/init) — Add Anvil to an existing driver project

**Build & package**

- [`driverforge build`](/cli/build) — Bundle and package your driver
- [Source maps](/cli/source-maps) — Generate source maps for readable stack traces (`driverforge build -s`)

**Deploy**

- [`driverforge deploy`](/cli/deploy) — Build and deploy your driver to a controller (full reload)
- [`driverforge sync`](/cli/sync) — Build and hot-swap your driver's Lua without a full reload

**Account & context**

- [`driverforge login`](/cli/login) — Sign in to Driverforge
- [`driverforge logout`](/cli/logout) — Sign out and remove stored credentials
- [`driverforge whoami`](/cli/whoami) — Show the signed-in user
- [`driverforge org`](/cli/org) — Choose the active organization
- [`driverforge device`](/cli/device) — Choose the target controller

**Maintenance**

- [`driverforge upgrade`](/cli/upgrade) — Show and apply available upgrades (CLI, agent, SDK)
- [`driverforge version`](/cli/version) — Print the CLI version (and the selected controller's versions)
- [`driverforge completion`](/cli/completion) — Generate a shell autocompletion script

**Coming soon**

- [`driverforge debug`](/cli/debug) — Live debugging with IDE support

Run `driverforge <command> --help` (or `driverforge help <command>`) for the full flags and
usage of any command.

## Global Flags

These apply to every command:

| Flag                | Description                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `--verbose`, `-v`   | Verbose output                                                                                           |
| `--project-dir`     | Driver project directory (default: current directory)                                                    |
| `--no-tui`          | Disable the interactive TUI and print plain output (also applied automatically when piped or under `CI`) |
| `--no-update-check` | Don't check for a newer `driverforge` release after the command runs                                           |
| `--help`, `-h`      | Show help for the command                                                                                |

`driverforge --version` (on the bare command) prints the CLI version and exits — see
[`driverforge version`](/cli/version) for the richer report that includes the
selected controller.
