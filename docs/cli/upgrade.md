---
sidebar_position: 21
---

# upgrade

See, and interactively apply, everything upgradable in the current context:
the `driverforge` CLI itself, the [Anvil Agent](/agent/overview) on the selected
controller, and the [Driverforge SDK](/sdk/overview) embedded in the current project.

## Usage

```bash
driverforge upgrade
```

## The picker

`driverforge upgrade` shows one row per component: **driverforge CLI**,
**Anvil Agent** (the [selected controller](/cli/device)), and **Driverforge SDK** (the
current project). Each row shows current → latest versions and status. The CLI's version
check here is always live, never the daily cached answer behind the passive
[update notice](/cli/upgrading#update-notices).

Available upgrades are selectable when their prerequisites are met. **Nothing is
pre-selected**: confirming the selection starts the upgrades. For SDK changes,
the CLI also offers an optional git branch and commit, as described below.

| Key | Action |
|-----|--------|
| `space` | Select / deselect a row |
| `enter` | Upgrade the selected rows |
| `r` | Open the highlighted row's release notes |
| `q` | Quit |

What confirming does, per row:

- **Anvil Agent**: upgrades the agent on the selected controller directly
  (download, SHA-256 verify, deploy under the installed filename, restart, and
  confirm it came back up via a health poll).
- **Driverforge SDK**: re-embeds the latest Driverforge SDK in the current project
  (`src/vendor/driverforge-sdk.lua`, and `.driverforge/config.json` is bumped to
  match). With a dirty git tree, the update remains visible but cannot be
  selected: commit or stash your changes, then re-run.
- **driverforge CLI**: verifies and replaces the installed binary when its
  location is writable. The new version runs on your next command. If it cannot
  update itself, the CLI provides the upgrade command for your installation.

`r` on the SDK row opens that release's notes on GitHub
(`github.com/driverforge/control4-sdk/releases`).

:::note
An agent too old to report its installed filename can't self-upgrade. Update it
once in Composer Pro ([instructions](/agent/installation#updating)); after that
`driverforge upgrade` can take over.
:::

## SDK branch and commit prompts

When an SDK upgrade will change files in a git repository with an existing
commit, it offers the same git workflow as [`init`](/cli/init):

1. **Create a git branch for these changes?** Accept to choose a branch name.
   The default is `driverforge-sdk-<version>`, for example `driverforge-sdk-0.9.2`.
   If that name already exists, the suggestion gets a numeric suffix such as
   `-2`. Decline to apply the update on your current branch without committing.
2. **Commit message** appears if you choose a branch. The default is
   `chore: update Driverforge SDK to <version>`. Accept or edit it to commit the
   update, or clear it to leave the changes uncommitted on the new branch.

If the SDK bundle and configuration already match the target release, the CLI
reports that there is nothing to update and skips both prompts. Projects outside
git, or without an initial commit, also skip the branch and commit prompts.

## Non-interactive behaviour

Piped, under `CI`, or with `--no-tui`, `driverforge upgrade` is report-only: it
prints the status table and never mutates. There is **no non-interactive way to
upgrade an agent**; this is deliberate. Upgrades act on a connected controller
and are always an interactive choice.

## Examples

```bash
driverforge upgrade
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
