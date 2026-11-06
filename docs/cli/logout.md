---
sidebar_position: 18
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# logout

Log out and remove your stored Driverforge credentials.

## Usage

```bash
driverforge logout
```

## What it does

Revokes the stored credentials and clears your saved [organization](/cli/org) and
[device](/cli/device) context. It's safe to run when you're already signed out.

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
✓ Logged out.
```

</TabItem>
<TabItem value="structured" label="Structured">

`revoked` is `false` if the session couldn't be revoked server-side; the local credentials are removed either way.

stdout:

```json
{
  "was_logged_in": true,
  "revoked": true
}
```

</TabItem>
</Tabs>


## Examples

```bash
driverforge logout
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
