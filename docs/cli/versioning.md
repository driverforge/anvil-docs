---
sidebar_position: 5
description: How driverforge manages the Control4 driver version, and the date and integer schemes chosen at init.
---

# Versioning

Control4 identifies a driver build by the integer `<version>` in `driver.xml`, and Director only reloads a driver when it sees a **higher** number. `driverforge` manages that integer for you, using a versioning scheme you choose once during [`driverforge init`](/cli/init).

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## The two schemes

Your scheme is recorded in `.driverforge/config` when you initialise the project:

**Date** is the default for new drivers. Versions are the date plus a two-digit sequence: `2026070501` is the first version of 5 July 2026. The first bump on a given day jumps to that day's `01`; later bumps the same day count up from there. The number always grows, reads as a date at a glance, and needs no bookkeeping. (Ship more than 99 times in a day and the sequence simply spills forward; it stays monotonic.)

**Integer** is a plain counter: each bump adds one, preserving any zero-padding. This is what `driverforge init` proposes for an existing driver whose `<version>` doesn't look like a date, so an established numbering scheme is never silently converted. The wizard states which scheme it detected before anything is written.

## When the version changes

| Command                   | Effect on `<version>`                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `driverforge build`             | Never changes it. The driver builds exactly as authored.                                                   |
| `driverforge build --increment` | Bumps per your scheme, persisted to `driver.xml` after a successful build.                                 |
| `driverforge build --version N` | Stamps the exact value you give, persisted to `driver.xml` after a successful build.                       |
| `driverforge sync`              | Never changes it. A hot-swap updates the running instance without a reload.                                |
| `driverforge deploy`            | Bumps per your scheme. Director needs a higher version to reload, so every deploy consumes a version slot. |

## Uninitialised projects

Plain `driverforge build` works on any driverpackager-style project with no account and no setup, and the version passes through exactly as authored. What [`driverforge init`](/cli/init) unlocks is version management and the ship commands: bumping needs a scheme, and the scheme is chosen during init. Without one, `--increment` stops with a friendly "Versioning not configured" pointing you at `driverforge init`, and [`sync`](/cli/sync)/[`deploy`](/cli/deploy) require an initialised project up front.

`--version` is the exception: an explicit value needs no scheme, so it works anywhere, initialised or not.

## What about `<semver>`?

Earlier previews of `driverforge` derived the Control4 `<version>` from a `<semver>` element in `driver.xml`. That's gone. `<semver>` isn't part of the Control4 driver.xml specification, and keeping a second source of truth for the version created more problems than it solved. `driverforge` now ignores the element entirely: it isn't read, written, or removed. If your `driver.xml` still carries one, it has no effect; remove it whenever convenient.
