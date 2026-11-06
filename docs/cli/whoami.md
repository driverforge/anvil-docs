---
sidebar_position: 23
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# whoami

Show the currently signed-in user.

## Usage

```bash
driverforge whoami
```

## What it does

Prints the user you're signed in as, refreshing the access token first if it has
expired. If you're not signed in, it tells you to run [`driverforge login`](/cli/login).

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
Jane Citizen (jane@example.com)
token expires Thu, 05 Nov 2026 18:30:00 AEDT
```

</TabItem>
<TabItem value="structured" label="Structured">

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
  }
}
```

</TabItem>
</Tabs>


## Examples

```bash
driverforge whoami
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
