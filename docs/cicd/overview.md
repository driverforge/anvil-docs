---
sidebar_position: 1
description: Run the driverforge CLI in your CI/CD pipeline with the GitHub Action or Buildkite plugin.
---

# Overview

Run `driverforge` in your pipeline to build and ship your Control4 drivers automatically
— on every push, tag, or release. Two integrations wrap the same CLI:

- **[GitHub Action](/cicd/github-actions)** — `driverforge/anvil-github-action`, for GitHub Actions workflows.
- **[Buildkite plugin](/cicd/buildkite)** — `driverforge/anvil-buildkite-plugin`, for Buildkite pipelines.

:::info Preview
The `driverforge` GitHub Action and Buildkite plugin are in **preview**. This section
documents the planned interface so you can see where things are headed — the
shapes here may change before release. Follow along or vote on our
[roadmap](https://driverforge.canny.io).
:::

## How they work

Both integrations follow the same model: **they install a pinned `driverforge` release
onto the runner and put it on `PATH`, then optionally run a command for you.**
That gives you two ways to use them.

### Just set up the environment

Omit the command and the integration simply makes `driverforge` available, so you can
call it however you like from your own scripts — the `actions/setup-node`
pattern:

```yaml
# GitHub Actions
- uses: driverforge/anvil-github-action@v1
  with:
    version: '1.4.0'
- run: driverforge build -c release
```

### Run a target directly

Give it a `command` and it runs that target in a single declarative step — no
extra scripting:

```yaml
# GitHub Actions
- uses: driverforge/anvil-github-action@v1
  with:
    command: build
    configuration: release
```

## What you need

Nothing extra on the runner. `driverforge` is a self-contained native binary, so the
integration downloads the pinned release, verifies its checksum, and adds it to
`PATH` — no Lua, LuaRocks, or container image required.

We recommend **pinning a version** (rather than `latest`) so a new release can't
change your build without you choosing to upgrade.

## Coming from driverpackager?

If you currently package drivers with the `snap-one/drivers-driverpackager`
action, see **[Migrating from driverpackager](/cicd/migrating-from-driverpackager)**
for the input-by-input mapping.
