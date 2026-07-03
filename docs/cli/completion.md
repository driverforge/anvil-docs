---
sidebar_position: 13
---

# anvil completion

Generate a shell autocompletion script for `anvil`, so commands, subcommands, and
flags tab-complete. `anvil completion` on its own does nothing; run the subcommand
for your shell.

:::info Preview
The `anvil` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Usage

```bash
anvil completion <subcommand>
```

## Subcommands

Each subcommand prints a completion script for that shell. Run
`anvil completion <shell> --help` for the authoritative, shell-specific install
steps; the essentials are below.

### anvil completion zsh

```bash
anvil completion zsh > "${fpath[1]}/_anvil"
```

Ensure `autoload -U compinit && compinit` is in your `~/.zshrc`, then restart your
shell.

### anvil completion bash

```bash
# current session
source <(anvil completion bash)

# or persist it (requires bash-completion installed)
anvil completion bash > /etc/bash_completion.d/anvil
```

### anvil completion fish

```bash
anvil completion fish > ~/.config/fish/completions/anvil.fish
```

### anvil completion powershell

```powershell
anvil completion powershell | Out-String | Invoke-Expression
```

## Global flags

Every `anvil` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
