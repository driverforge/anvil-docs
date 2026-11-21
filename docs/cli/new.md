---
sidebar_position: 8
---

# new

Create a Control4 driver project from a template, then set it up for
Driverforge.

## Usage

```bash
driverforge new my-driver
```

`new` fetches a template, by default the official one from
[`driverforge/control4-templates`](https://github.com/driverforge/control4-templates),
and creates `./my-driver` from it with the driver's name filled in. It then
runs [`init`](/cli/init) inside the new directory, which asks the same
questions `driverforge init` does: which project to link or create, the
[versioning scheme](/cli/versioning), [build configurations](/cli/build-configuration)
and the logger to forward.

`new` doesn't change your shell's directory. When it finishes:

```bash
cd my-driver
```

For a walkthrough from an empty directory to telemetry in Anvil, see
[Start a driver from a template](/platform/start-from-a-template).

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`) with an
  [organization selected](/cli/org) (`driverforge org select`). Not needed
  with `--no-init`.
- `git` installed, if `--repo` is a git URL.

## What it does

1. **Fetches the template.** Nothing is created until the template has
   downloaded and rendered cleanly.
2. **Creates the project directory**, replacing the template's
   [placeholders](/cli/templates#placeholders) with values derived from the
   name you gave: `driverforge new my-pool-pump` gives `${slug}` =
   `my-pool-pump`, `${id}` = `my_pool_pump` and `${title}` = `My Pool Pump`.
3. **Runs `init`**, which embeds the latest Driverforge SDK, wraps
   `OnDriverInit`, and links or creates the Anvil project. A new project has
   nothing to review against, so `init` applies its changes straight away,
   without the diff review or a git branch.
4. **Prints a link to the project in Anvil**, and in a terminal offers to open
   it. The page there picks up where `new` leaves off: deploying the driver
   and watching its first telemetry arrive.

If `init` fails, for example because the project limit on your
[plan](/platform/plans) is reached, the project directory stays. It's a
complete driver; run `driverforge init` inside it to finish the setup.

## Choosing a template

### `--template`

A template repository holds one directory per template. `--template` picks
one:

```bash
driverforge new acme-thermostat --repo acme/driver-templates --template thermostat
```

Without `--template`, `new` uses the repository root when it holds a
`template.json` (a repository that is a single template), and otherwise the
`driver` directory.

### `--repo`

`--repo` points `new` at a different template repository. It takes:

| Form                             | Example                                        |
| -------------------------------- | ---------------------------------------------- |
| GitHub `owner/repo`, with `@ref` | `acme/driver-templates@v2`                     |
| GitHub URL                       | `https://github.com/acme/driver-templates`     |
| Any git URL, with `#ref`         | `https://gitlab.com/acme/templates.git#v2`     |
|                                  | `ssh://git@git.acme.com/drivers/templates.git` |
|                                  | `git@bitbucket.org:acme/templates.git#main`    |
|                                  | `git://git.acme.com/templates.git`             |

`@ref` and `#ref` name a branch or tag. Without one, `new` uses the
repository's default branch.

GitHub `owner/repo` and `https://github.com/...` forms are downloaded as an
archive, so they must be public. Every other git URL is cloned with `git`,
using your own git credentials, so it works for GitLab, Bitbucket,
self-hosted servers and private repositories. `new` never prompts for git
credentials: if the clone needs a password and no credential helper or SSH
key supplies it, the clone fails.

To write your own templates, see [Authoring templates](/cli/templates).

## Options

| Option               | Description                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `--repo`             | Repository holding the templates: `owner/repo[@ref]` on GitHub, or any git URL `[#ref]`               |
| `--template`         | Template directory within the repository                                                              |
| `--set key=value`    | Set a variable the template declares. Repeatable                                                      |
| `--no-init`          | Create the project without setting it up for Driverforge                                              |
| `--project`          | Link an existing Anvil project: `<org-slug>/<project-slug>`, or a project slug                        |
| `--create-project`   | Create an Anvil project with this name for the driver to report to                                    |
| `--org`              | The organization to create the project in (default: the active one), or to qualify a `--project` slug |
| `--platform`         | The new project's platform, by id or name (default: the only supported one)                           |
| `--description`      | The new project's description                                                                         |
| `--versioning`       | How deploys bump `<version>`: `date` (`YYYYMMDDNN`) or `integer`                                      |
| `--build-configs`    | Add the `config.lua` and `config.release.lua` build configurations                                    |
| `--no-build-configs` | Don't add build configurations                                                                        |
| `--logger`           | Forward logs from this logger global, for example `Log`                                               |
| `--no-logger`        | Don't forward the driver's logs                                                                       |
| `--sdk-dir`          | Source-relative directory to install the Driverforge SDK in                                           |

The options from `--project` down are `init`'s, and mean the same thing as on
[`driverforge init`](/cli/init#options). `--no-init` can't be combined with
them.

`--set` only accepts variables the template's `template.json` declares; any
other name fails and lists the variables it does accept. A required variable
you don't set is asked for in a terminal.

`new` has no `--yes` or `--dry-run`: there's no existing project to review
changes against.

## Without a terminal

Under a coding agent, in CI, or with `--no-tui`, `new` can't ask, so every
question needs its flag. Missing answers fail with `input_required` before
anything is fetched or created, and `details.missing` names the flags still
needed. Required template variables you didn't `--set` fail the same way,
naming each one.

```bash
driverforge new pool-pump --create-project "Pool Pump" --versioning date \
  --no-build-configs --no-logger
```

In JSON output, the result lists the created files, `init`'s result, and
`setup_url`: the Anvil link `new` prints at the end.

## Examples

```bash
# The official template, answering init's questions as you go
driverforge new my-driver

# One of your own templates, from a private GitLab repository, at tag v2
driverforge new my-driver --repo https://gitlab.com/acme/templates.git#v2

# A template that declares a vendor variable
driverforge new acme-thermostat --repo acme/driver-templates@v2 \
  --template thermostat --set vendor=Acme

# Just the project, no Driverforge setup
driverforge new scratch --no-init
```
