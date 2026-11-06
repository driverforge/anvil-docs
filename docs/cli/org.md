---
sidebar_position: 19
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# org

Manage the active organization: the workspace your projects, devices, and billing
belong to. The CLI remembers it so the deploy commands don't need it every time.
`driverforge org` on its own does nothing; run one of its subcommands.

## Usage

```bash
driverforge org <subcommand>
```

## Prerequisites

- You're [signed in](/cli/login) (`driverforge login`)

## Subcommands

### driverforge org list

List the organizations you can access; `*` marks the active one.

```bash
driverforge org list
```

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
   NAME              SLUG       ROLE
*  Acme Integration  acme       OWNER
   Bench Labs        bench-labs MEMBER
```

</TabItem>
<TabItem value="structured" label="Structured">

stdout:

```json
{
  "organizations": [
    {
      "id": "c2d4e6f8-1a3b-4c5d-9e7f-8a6b4c2d0e1f",
      "name": "Acme Integration",
      "slug": "acme",
      "role": "OWNER",
      "current": true
    },
    {
      "id": "1b3d5f7a-9c2e-4a6b-8d0f-2e4c6a8b0d1f",
      "name": "Bench Labs",
      "slug": "bench-labs",
      "role": "MEMBER",
      "current": false
    }
  ]
}
```

</TabItem>
</Tabs>

### driverforge org select [name|slug|id]

Switch the active organization. Matches a slug, id, or exact name. It shows a
picker when given no argument.

```bash
driverforge org select acme
```

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
Using organization: Acme Integration (acme)
```

</TabItem>
<TabItem value="structured" label="Structured">

With no argument, there's no picker: it stops with `input_required`. Pass the organization to select.

stdout:

```json
{
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

### driverforge org show

Print the active organization.

```bash
driverforge org show
```

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
Acme Integration (acme)
```

</TabItem>
<TabItem value="structured" label="Structured">

stdout:

```json
{
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

See [Organizations & devices](/cli/context) for how the active org and device fit
together.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
