---
sidebar_position: 17
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# login

Authenticate with Driverforge. Sign in once and the CLI stores and refreshes your
credentials, so the commands that reach the Anvil cloud ([`deploy`](/cli/deploy),
[`sync`](/cli/sync), [`org`](/cli/org), [`device`](/cli/device),
[`upgrade`](/cli/upgrade)) work without prompting again.

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

Run by a [coding agent](/cli/agents), `login` doesn't open a browser. It writes
the link and code as an
[`action_required`](/coding-agents/skills/cli#when-a-person-has-to-act) line for the agent to
hand to you, and waits while you approve. It can't show the organization
picker, so pass `--org` if you belong to more than one.

## Options

| Option | Description |
|--------|-------------|
| `--no-browser` | Don't open a browser automatically; visit the printed URL yourself |
| `--org` | Organization to use after signing in (name, slug, or id); skips the picker |

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
┃ To authorize driverforge, open this link in your browser:
┃
┃     https://auth.driverforge.com/device?user_code=WDJB-MJHT
┃
┃ and check it shows this code:
┃
┃     WDJB-MJHT

Opened your browser…
✓ Logged in as Jane Citizen (jane@example.com)

Using organization: Acme Integration (acme)
```

</TabItem>
<TabItem value="structured" label="Structured">

No browser opens. The agent hands you the link and code from the `action_required` line, and `login` waits while you approve.

stdout:

```json
{
  "user": {
    "id": "6a1f0c2e-9b7d-4e3a-8f21-0d5c4b3a2e10",
    "name": "Jane Citizen",
    "email": "jane@example.com",
    "session_expires_at": "2026-11-05T07:30:00Z"
  },
  "organization": {
    "id": "c2d4e6f8-1a3b-4c5d-9e7f-8a6b4c2d0e1f",
    "name": "Acme Integration",
    "slug": "acme",
    "current": true
  },
  "warnings": []
}
```

stderr:

```json
{"action_required": {"message": "Open the link in a browser and approve the sign-in with this code.", "url": "https://auth.driverforge.com/device", "url_with_code": "https://auth.driverforge.com/device?user_code=WDJB-MJHT", "code": "WDJB-MJHT", "expires_at": "2026-11-05T07:40:00Z"}}
{"progress": {"status": "running", "message": "Waiting for authorization"}}
{"progress": {"status": "ok", "message": "Logged in as Jane Citizen (jane@example.com)"}}
{"progress": {"status": "info", "message": "Using organization: Acme Integration (acme)"}}
```

</TabItem>
</Tabs>


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
