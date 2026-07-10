---
sidebar_position: 4
---

# Build configuration

`driverforge` gives your driver an opt-in **build configuration** system — committed Lua
config files, with a named override swapped in at build time. It's a lot like
Release/Debug builds in C++ or .NET: one default, plus named variants you select
when you build.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

It's entirely optional. A driver can inline its settings (including its Anvil
[API key](/security/api-keys)) directly and never use any of this.

## `config.lua` — your default

Your driver's configuration lives in `src/config.lua`: a **committed, real** Lua
file your driver loads with `require('config')`. It's the default configuration —
the one a plain `driverforge build` uses as-is. Because it's a normal file on disk, your
editor, linters, and the driver all resolve it without a build step.

## `config.<name>.lua` — named overrides

To vary config per build, commit an override named `src/config.<name>.lua` — for
example `src/config.release.lua`. Building with that configuration:

```bash
driverforge build --configuration release   # or: -c release
```

swaps `config.release.lua` in as `config.lua` **for that build only** — in a
temporary work directory, so your source tree is never touched. If
`src/config.<name>.lua` doesn't exist, the build stops and tells you.

There's no separate default/`debug` file: the default configuration **is**
`config.lua`, so there's no `--configuration debug`.

## Everything is committed — and safe to commit

`config.lua` and its overrides are committed, real files — nothing is generated
and nothing is gitignored. That's safe because **config files hold no secrets**:
your Anvil API key is a publishable credential inlined directly in the driver
(see [API Keys](/security/api-keys)), not stored in config.

This is deliberate. `config.lua` has to exist on disk for `require('config')`,
your IDE, and your linter — so making it a real committed file, rather than a
gitignored artifact that only appears after a build, keeps the project honest:
what you see is what ships.

## Setting it up

It's opt-in. [`driverforge init`](/cli/init) offers to set it up for you — it creates
`src/config.lua` plus a `src/config.release.lua` override and wires
`require('config')` into your driver. Decline, and you can inline your settings
directly instead.

## Naming

A plain build (the default configuration) keeps the driver's naked name
(`my-driver.c4z`). A named configuration is suffixed so builds coexist —
`driverforge build --configuration release` produces `my-driver-release.c4z` and adds a
`(release)` suffix to the device name in Composer.

## Related

- [`driverforge build`](/cli/build) — the `--configuration` flag
- [`driverforge init`](/cli/init) — opt into a build config
- [API Keys](/security/api-keys) — why the key is safe to inline
