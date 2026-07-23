---
sidebar_position: 13
---

# completion

Generate a shell autocompletion script for `driverforge`, so commands, subcommands, and
flags tab-complete. `driverforge completion` on its own does nothing; run the subcommand
for your shell.

## Usage

```bash
driverforge completion <subcommand>
```

## Subcommands

Each subcommand prints a completion script for that shell. Run
`driverforge completion <shell> --help` for the authoritative, shell-specific install
steps; the essentials are below.

### driverforge completion zsh

```bash
driverforge completion zsh > "${fpath[1]}/_driverforge"
```

Ensure `autoload -U compinit && compinit` is in your `~/.zshrc`, then restart your
shell.

### driverforge completion bash

```bash
# current session
source <(driverforge completion bash)

# or persist it (requires bash-completion installed)
driverforge completion bash > /etc/bash_completion.d/driverforge
```

### driverforge completion fish

```bash
driverforge completion fish > ~/.config/fish/completions/driverforge.fish
```

### driverforge completion powershell

```powershell
driverforge completion powershell | Out-String | Invoke-Expression
```

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
