---
sidebar_position: 0
---

# Overview

The Anvil CLI (`anvil`) is a single, dependency-free binary for Control4 driver
development. It builds and packages drivers locally, and — once you're signed in
— deploys them straight to a controller through the Anvil Agent, no manual
Composer import required.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## What it does

- **Build drivers** — Bundle Lua source with squish and produce a `.c4z`
  package, with optional script encryption and source maps
- **Deploy** — Push a built driver to a controller through the Anvil Agent and
  watch it reload, without switching to Composer
- **Sync** — Hot-swap a driver's Lua into the running instance for fast
  iteration, skipping the full reload
- **Manage context** — Sign in once, then choose the organization and the target
  controller the deploy commands act on
- **Upgrade the agent** — Update the Anvil Agent running on a controller to the
  latest release

## Installation

```bash
# macOS
brew install driverforge/tap/anvil

# Linux / WSL
curl -sSL https://releases.driverforge.com/install.sh | sh

# Windows
scoop bucket add driverforge https://github.com/driverforge/scoop-bucket
scoop install anvil
```

Verify the install and see the version:

```bash
anvil version
```

## Quick Start

Building is entirely local and needs no account. Deploying does — it acts on a
real controller, so you sign in and pick a target first.

```bash
# 1. Build a .c4z from the current project
anvil build

# 2. Sign in (opens your browser) and choose an organization
anvil login

# 3. Pick the controller to deploy to
anvil device select

# 4. Build and deploy in one step
anvil build --deploy
```

## Commands

**Set up**

- [`anvil init`](/cli/init) — Add Anvil to an existing driver project

**Build & package**

- [`anvil build`](/cli/build) — Bundle and package your driver
- [Source maps](/cli/source-maps) — Generate source maps for readable stack traces (`anvil build -s`)

**Deploy**

- [`anvil deploy`](/cli/deploy) — Deploy a built driver to a controller (full reload)
- [`anvil sync`](/cli/sync) — Hot-swap a driver's Lua without a full reload

**Account & context**

- [`anvil login`](/cli/login) — Sign in to Driverforge
- [`anvil logout`](/cli/logout) — Sign out and remove stored credentials
- [`anvil whoami`](/cli/whoami) — Show the signed-in user
- [`anvil org`](/cli/org) — Choose the active organization
- [`anvil device`](/cli/device) — Choose the target controller

**Maintenance**

- [`anvil agent`](/cli/agent) — Upgrade the Anvil Agent on a controller
- [`anvil upgrade`](/cli/upgrade) — Show and apply available upgrades (CLI, agent)
- [`anvil version`](/cli/version) — Print the CLI version (and the selected controller's versions)
- [`anvil completion`](/cli/completion) — Generate a shell autocompletion script

**Coming soon**

- [`anvil debug`](/cli/debug) — Live debugging with IDE support

Run `anvil <command> --help` (or `anvil help <command>`) for the full flags and
usage of any command.

## Global Flags

These apply to every command:

| Flag | Description |
|------|-------------|
| `--verbose`, `-v` | Verbose output |
| `--project-dir` | Driver project directory (default: current directory) |
| `--no-tui` | Disable the interactive TUI and print plain output (also applied automatically when piped or under `CI`) |
| `--no-update-check` | Don't check for a newer `anvil` release after the command runs |
| `--help`, `-h` | Show help for the command |
