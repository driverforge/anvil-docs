---
sidebar_position: 21
---

# upgrade

See — and interactively apply — everything upgradable in the current context:
the `driverforge` CLI itself, the [Anvil Agent](/agent/overview) on the selected
controller, and the [Anvil SDK](/sdk/overview) embedded in the current project.

## Usage

```bash
driverforge upgrade
```

## The picker

`driverforge upgrade` shows one row per component — **driverforge CLI**,
**Anvil Agent** (the [selected controller](/cli/device)), **Anvil SDK** (the
current project) — with current → latest versions and status. The CLI's version
check here is always live, never the daily cached answer behind the passive
[update notice](/cli/upgrading#update-notices).

Rows with an update available are selectable checkboxes. **Nothing is
pre-selected** — an upgrade is always an explicit choice, and confirming the
selection is the consent: there is no further prompt.

| Key | Action |
|-----|--------|
| `space` | Select / deselect a row |
| `enter` | Upgrade the selected rows |
| `r` | Open the highlighted row's release notes |
| `q` | Quit |

What confirming does, per row:

- **Anvil Agent** — upgrades the agent on the selected controller directly:
  download, SHA-256 verify, deploy under the installed filename, restart, and
  confirm it came back up via a health poll.
- **Anvil SDK** — re-embeds the latest Anvil SDK in the current project
  (`src/vendor/anvil-sdk.lua`, and `.driverforge/config.json` is bumped to
  match). A dirty git tree is refused first — commit or stash, then re-run.
- **driverforge CLI** — doesn't upgrade (a package manager owns the binary).
  After the other upgrades finish, the CLI prints the right upgrade command for
  how it was installed (brew, scoop, or the install script).

`r` on the SDK row opens that release's notes on GitHub
(`github.com/driverforge/control4-anvil-sdk/releases`).

:::note
An agent too old to report its installed filename can't self-upgrade. Update it
once in Composer Pro ([instructions](/agent/installation#updating)); after that
`driverforge upgrade` can take over.
:::

## Non-interactive behaviour

Piped, under `CI`, or with `--no-tui`, `driverforge upgrade` is report-only: it
prints the status table and never mutates. There is **no non-interactive way to
upgrade an agent** — this is deliberate. Upgrades act on a connected controller
and are always an interactive choice.

## Examples

```bash
driverforge upgrade
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
