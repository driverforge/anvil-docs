---
sidebar_position: 4
---

# Build configuration

`driverforge` gives your driver an opt-in **build configuration** system — committed Lua
config files, with a named override swapped in at build time. It's a lot like
Release/Debug builds in C++ or .NET: one default, plus named variants you select
when you build.

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

That default is right for dev variants, but a release configuration usually
wants the naked name — the artifact you ship shouldn't be decorated. A
configuration can opt out of the suffixes with `suffix: false` in the project
config (below) or per-invocation with `--no-suffix`.

## Per-configuration defaults

If your project is [initialised](/cli/init), the committed
`.driverforge/config.json` can attach defaults to a configuration, keyed by its
name, so one flagless command produces the right artifact:

```json
"configurations": {
  "release": { "encrypt": true, "suffix": false }
}
```

| Key       | Effect                                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `encrypt` | Default for script encryption: `true` always encrypts this configuration, `false` never does. Unset follows `driver.xml` as authored                       |
| `suffix`  | `false` builds the naked driver name — no `-<name>` artifact suffix and no `(name)` device-name suffix. Unset/`true` keeps the standard suffixing          |

With that entry, `driverforge build -c release` alone produces an encrypted
`my-driver.c4z` — no remembering `--encrypt` for the build that matters most.
The defaults also apply when [`sync`](/cli/sync) or [`deploy`](/cli/deploy)
build that configuration, so shipping produces the same artifact as building.

**Precedence: flag → project config → authored source.** Explicit flags always
win: `--encrypt=false` overrides `"encrypt": true`, and `--no-suffix=false`
forces the suffix back on over `"suffix": false`. With no config file (or no
entry for the configuration), nothing changes — the block is a defaults
overlay, never a requirement.

**The config file never defines what configurations exist.** That stays with
the `config.<name>.lua` files: an entry here with no matching file is inert,
and `-c <name>` without the file still stops the build.

:::caution Suffix opt-out shares the default build's output path
A `suffix: false` configuration writes `dist/my-driver.c4z` — the same path as
a plain `driverforge build`. That's the point for a release configuration (the
shipped artifact gets the real name), but the two builds overwrite each other
in `dist/`.
:::

## Related

- [`driverforge build`](/cli/build) — the `--configuration` flag
- [`driverforge init`](/cli/init) — opt into a build config
- [API Keys](/security/api-keys) — why the key is safe to inline
