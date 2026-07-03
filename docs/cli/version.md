---
sidebar_position: 12
---

# anvil version

Print the `anvil` CLI version — and, when a controller is selected, the Director
and Anvil Agent versions running on it.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
anvil version
```

With no controller selected, it prints just the CLI version. Once you've
[selected a controller](/cli/context) (`anvil device select`), `version` also
reaches that controller's [Anvil Agent](/agent/overview) (best-effort) and reports:

- **Controller** — the controller's name
- **Director** — the Control4 Director (OS) version
- **Anvil Agent** — the agent version installed on the controller
- **MAC** — the controller's MAC address

If the controller can't be reached, that line reads `unreachable` — the CLI
version is always printed regardless.

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
