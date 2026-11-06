---
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# init

Set up Anvil in an existing Control4 driver project: embed the SDK, wrap
`OnDriverInit`, link an Anvil project, and (optionally) add a build config.

:::warning[Modifies your driver project]
`driverforge init` **modifies files in your driver project**; that's the point:
it embeds the SDK, wraps `OnDriverInit`, and writes config. It shows you a
per-file diff for approval (or, with `--dry-run`, before anything is created)
and backs up edited files before writing, but always review the changes before
committing.
:::

## Usage

```bash
driverforge init
```

Run it from inside an existing driver project: a directory with
`src/manifest.c4zproj`. In a terminal it asks its questions as it goes. Every
question also has a flag, so a [coding agent](/coding-agents/skills/cli) or a
script can run it without a terminal (see
[Without a terminal](#without-a-terminal)).

`init` sets a project up exactly **once** and never mutates an initialised
project (see [Running it again](#running-it-again)). SDK updates have one
owner, the [`driverforge upgrade`](/cli/upgrade) picker.

## Prerequisites

- An existing Control4 driver project
- You're [signed in](/cli/login) (`driverforge login`) with an
  [organization selected](/cli/org) (`driverforge org select`)

## What it does

`driverforge init` retrofits your driver for Anvil, walking you through:

1. **Embedding the Driverforge SDK** into your project (under `src/vendor/`): the
   newest locally cached SDK, or, if none is cached, it offers to download the
   latest. Updating it later is the [`driverforge upgrade`](/cli/upgrade)
   picker's job.
2. **Wrapping your driver's `OnDriverInit`** so Anvil initializes when the driver
   loads.
3. **Linking an Anvil project** (an existing one, or a new one it creates) and
   provisioning an [API key](/platform/project-tokens).
4. **Choosing a [versioning scheme](/cli/versioning)**: date-based for new
   drivers; for an existing driver the wizard inspects the current `<version>`,
   proposes the matching scheme (date-shaped stays date, anything else becomes
   an incrementing integer), and states the choice before writing it. The
   scheme is what `--increment` and the ship commands bump with.
5. **Optionally setting up a [build config](/cli/build-configuration)**: a
   committed `src/config.lua` (your default configuration) plus a
   `src/config.release.lua` override, loaded by your driver via `require('config')`
   and swapped per build with [`driverforge build --configuration`](/cli/build). These
   are committed and hold no secrets (your Anvil key is inlined in the driver, not
   in config).
6. **Detecting a logger** in your entry file to forward log output from.
7. **Writing `.driverforge/config`**: a committed record of the integration
   (including your versioning scheme), with no secrets in it.

Initialising is also what unlocks version management and the ship commands:
[`sync`](/cli/sync) and [`deploy`](/cli/deploy) require an initialised project,
and `build --increment` needs the versioning scheme recorded here.

## Review before anything is written

Before changing a single file, `driverforge init` shows you a **per-file diff of every
proposed change** and asks for approval. If your project is a git repository, it
offers to create a branch first. Edited files are backed up to `<file>.bak` while writing,
and the changes are applied atomically: if anything fails, it rolls back.

`--dry-run` shows the same plan and diffs and stops there: it creates no
project and writes no files, so it runs on a working tree with uncommitted
changes too. `--yes` applies the plan without the review and the final
confirmation.

## Options

Each flag answers one of the questions `init` would otherwise ask. In a
terminal, any question without its flag is still asked.

| Option                  | Description                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--project`             | Link an existing Anvil project: `<org-slug>/<project-slug>`, or a project slug                                    |
| `--create-project`      | Create an Anvil project with this name for the driver to report to                                               |
| `--org`                 | The organization to create the project in (default: the active one), or to qualify a bare `--project` slug        |
| `--platform`            | The new project's platform, by id or name (default: the only supported one)                                      |
| `--description`         | The new project's description                                                                                     |
| `--versioning`          | How deploys bump `<version>`: `date` (`YYYYMMDDNN`) or `integer`. See [versioning](/cli/versioning)               |
| `--build-configs`       | Add the `config.lua` and `config.release.lua` [build configurations](/cli/build-configuration)                    |
| `--no-build-configs`    | Don't add build configurations                                                                                    |
| `--logger`              | Forward logs from this logger global, for example `Log`                                                           |
| `--no-logger`           | Don't forward the driver's logs                                                                                   |
| `--branch`              | Create this git branch and commit the changes to it                                                               |
| `--no-branch`           | Write the changes to the current branch, uncommitted                                                              |
| `--commit-message`      | The commit message on `--branch` (default `chore: add Anvil developer tooling support`). Empty leaves the changes uncommitted |
| `--dry-run`             | Report the plan and its diffs without creating or writing anything                                                |
| `--yes`, `-y`           | Apply the plan without reviewing the changes                                                                      |

`--project` and `--create-project` can't be used together, nor can a flag and
its `--no-` form, or `--dry-run` and `--yes`. `--platform` and `--description`
only apply with `--create-project`, and `--commit-message` only with
`--branch`. A conflicting combination fails as a usage error with exit status
`2`.

## Without a terminal

Under a coding agent, in CI, or with `--no-tui`, `init` can't ask, so every
question needs its flag. Run it without them and it fails once, before any
network call, with `input_required`. `details.missing` lists every flag still
needed, and `details.detected` gives the versioning scheme and logger it found
in the driver, to help choose the answers:

```bash
driverforge init
```

```json
{
  "error": {
    "code": "input_required",
    "message": "driverforge init can't ask its questions without a terminal, and these weren't answered: --project or --create-project, --versioning, --build-configs or --no-build-configs, --logger or --no-logger, --branch or --no-branch, --dry-run or --yes.",
    "hint": "Pass them as flags (see `driverforge init --help`); preview with --dry-run before applying with --yes.",
    "details": {
      "missing": [
        "--project or --create-project",
        "--versioning",
        "--build-configs or --no-build-configs",
        "--logger or --no-logger",
        "--branch or --no-branch",
        "--dry-run or --yes"
      ],
      "detected": { "versioning": "date", "logger": "Log" }
    }
  }
}
```

`--org` is listed too when no organization is active, and `--branch or
--no-branch` only when the project is in a git repository with at least one
commit. If more than one platform is available, `--create-project` without
`--platform` fails with `input_required` and lists the choices in
`details.candidates`.

Preview the plan, then apply it with the same answers:

```bash
driverforge init --create-project "Pool Pump" --versioning date \
  --no-build-configs --logger Log --branch driverforge-init --dry-run

driverforge init --create-project "Pool Pump" --versioning date \
  --no-build-configs --logger Log --branch driverforge-init --yes
```

Without a terminal, running `init` is consent to download the SDK into the
local cache when no copy is cached; in a terminal it asks first.

Creating a project counts against your organization's [plan](/platform/plans).
When the plan has no room for another, `init` fails with
`project_limit_reached` (exit status `6`); when the organization's
subscription is suspended, it fails with `subscription_suspended`.

## Running it again

`driverforge init` on an already-initialised project reports the existing setup as
an advisory card and exits without touching anything:

```
┃ This project is already set up for Driverforge.
┃
┃ project Eight Sleep
┃ SDK     0.3.0
┃ targets debug, release
┃
┃  💡  Run `driverforge upgrade` to update the embedded SDK.
```

In structured output, the result has `already_set_up: true` and describes
the existing setup.

The one exception: a config predating the [versioning scheme](/cli/versioning)
field still gets the one-time versioning interview backfilled: a migration, not
a setup change.

If the setup has since been *broken* rather than merely already done (a
reverted edit, a missing `src/vendor/`, a file that didn't survive a clone),
that's [`driverforge doctor`](/cli/doctor). It checks each piece `init` puts in
place and offers to restore what's gone.

To update the embedded SDK, select the SDK row in the
[`driverforge upgrade`](/cli/upgrade) picker.

## After setup

```bash
driverforge deploy
```

If you set up a build config, review the committed `src/config.lua` (and any
`src/config.<name>.lua` override), and build a named configuration with
[`driverforge build --configuration release`](/cli/build). It's also worth reviewing the
wrapped `OnDriverInit` in your driver's entry file.

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

Without `--yes`, `init` walks you through linking or creating the project,
choosing a versioning scheme, and reviewing the per-file diff before anything
is written. With `--dry-run`, it prints the diffs and the plan, then stops:

```text
On apply, Driverforge will:
  • Create project "Pool Pump" (Control4)
  • Create git branch driverforge-init
  • Embed the Driverforge SDK
  • Write 3 file changes
  • Commit the changes ("chore: add Anvil developer tooling support")

Dry run: nothing was created or written. Re-run with --yes to apply.
```

</TabItem>
<TabItem value="structured" label="Structured">

`--dry-run` returns the plan, with each file's diff. `applied` is `false`, and
a project it would create has no `id` or `slug` yet. The vendored SDK bundle
is listed without a diff.

stdout:

```json
{
  "applied": false,
  "dry_run": true,
  "already_set_up": false,
  "org": { "slug": "acme", "name": "Acme Integration" },
  "project": { "action": "create", "name": "Pool Pump", "platform": "control4" },
  "sdk_version": "0.3.0",
  "versioning": "date",
  "build_configs": false,
  "logger": "Log",
  "branch": "driverforge-init",
  "commit_message": "chore: add Anvil developer tooling support",
  "changes": [
    { "path": "src/vendor/driverforge-sdk.lua", "kind": "create" },
    {
      "path": "src/driver.lua",
      "kind": "modify",
      "diff": "+ require('vendor.driverforge-sdk')\n  function OnDriverInit(driverInitType)\n…"
    },
    {
      "path": ".driverforge/config.json",
      "kind": "create",
      "diff": "+ {\n+   \"org\": \"acme\",\n…"
    }
  ],
  "warnings": []
}
```

With `--yes`, `applied` is `true`, `project` carries the `id` and `slug` of
the project it created or linked (`action` is `create` or `link`), and
`changes` lists the files it wrote:

```json
{
  "applied": true,
  "dry_run": false,
  "already_set_up": false,
  "org": { "slug": "acme", "name": "Acme Integration" },
  "project": {
    "action": "create",
    "id": "8f3c2a1e-5b7d-4e19-a6c2-0d4b9e7f1a23",
    "slug": "pool-pump",
    "name": "Pool Pump",
    "platform": "control4"
  },
  "sdk_version": "0.3.0",
  "versioning": "date",
  "build_configs": false,
  "logger": "Log",
  "branch": "driverforge-init",
  "commit_message": "chore: add Anvil developer tooling support",
  "changes": [
    { "path": "src/vendor/driverforge-sdk.lua", "kind": "create" },
    { "path": "src/driver.lua", "kind": "modify", "diff": "…" },
    { "path": ".driverforge/config.json", "kind": "create", "diff": "…" }
  ],
  "warnings": []
}
```

</TabItem>
</Tabs>

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
