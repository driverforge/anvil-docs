---
sidebar_position: 17
---

# login

Authenticate with Driverforge. Sign in once and the CLI stores and refreshes your
credentials, so the commands that reach the Anvil cloud — [`deploy`](/cli/deploy),
[`sync`](/cli/sync), [`org`](/cli/org), [`device`](/cli/device),
[`upgrade`](/cli/upgrade) — work without prompting again.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
driverforge login [options]
```

## What it does

`driverforge login` uses the OAuth 2.0 device authorization grant: it shows a short
code, opens your browser to confirm it, and waits while you authorize. **Your
password is never entered into or seen by the CLI.** After you authorize, it
stores the credentials locally and prompts you to pick the
[organization](/cli/org) to work in (skipped if you belong to only one). See
[Authentication](/cli/authentication) for the bigger picture.

## Options

| Option | Description |
|--------|-------------|
| `--no-browser` | Don't open a browser automatically — visit the printed URL yourself |
| `--org` | Organization to use after signing in (name, slug, or id); skips the picker |

## Examples

Sign in interactively:

```bash
driverforge login
```

Sign in on a headless machine and pick an org non-interactively:

```bash
driverforge login --no-browser --org acme
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
