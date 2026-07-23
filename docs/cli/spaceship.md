---
sidebar_position: 14
---

# Spaceship prompt

Show your active Driverforge [context](/cli/context) — the selected
organization and controller — right in your shell prompt, the way
[Spaceship](https://spaceship-prompt.sh) shows the git branch or the Azure
subscription:

```
~/drivers/acme-thermostat  on  main  󰢛 acme/living-room
```

The section reads only the local context file (`driverforge org current` /
`driverforge device current` — no network), renders asynchronously so it never
blocks your prompt, and disappears entirely when no organization is selected.

## Install

Save the snippet below as `~/.config/spaceship/driverforge.zsh`, then in your
`~/.zshrc` — **after** Spaceship is initialised:

```bash
source ~/.config/spaceship/driverforge.zsh
```

and add `driverforge` to your prompt order:

```bash
SPACESHIP_PROMPT_ORDER=( dir git driverforge line_sep char )
```

## The section

```bash
# Driverforge — active org/device section for the Spaceship prompt.

# Configuration (override any of these in ~/.zshrc before sourcing).
SPACESHIP_DRIVERFORGE_SHOW="${SPACESHIP_DRIVERFORGE_SHOW=true}"
SPACESHIP_DRIVERFORGE_SHOW_DEVICE="${SPACESHIP_DRIVERFORGE_SHOW_DEVICE=true}"
SPACESHIP_DRIVERFORGE_PREFIX="${SPACESHIP_DRIVERFORGE_PREFIX="using "}"
SPACESHIP_DRIVERFORGE_SUFFIX="${SPACESHIP_DRIVERFORGE_SUFFIX="$SPACESHIP_PROMPT_DEFAULT_SUFFIX"}"
SPACESHIP_DRIVERFORGE_SYMBOL=${SPACESHIP_DRIVERFORGE_SYMBOL=$'\U000F089B '} # nf-md-anvil (Nerd Font)
SPACESHIP_DRIVERFORGE_DEVICE_SEPARATOR="${SPACESHIP_DRIVERFORGE_DEVICE_SEPARATOR="/"}"
SPACESHIP_DRIVERFORGE_COLOR="${SPACESHIP_DRIVERFORGE_COLOR="#79C0FF"}"
SPACESHIP_DRIVERFORGE_COMMAND="${SPACESHIP_DRIVERFORGE_COMMAND=driverforge}"

# spaceship_driverforge renders the active driverforge org (and device, if
# selected), or nothing.
spaceship_driverforge() {
  [[ $SPACESHIP_DRIVERFORGE_SHOW == false ]] && return

  # Only render when the driverforge CLI is on PATH.
  spaceship::exists "$SPACESHIP_DRIVERFORGE_COMMAND" || return

  local org
  org=$($SPACESHIP_DRIVERFORGE_COMMAND org current 2>/dev/null) || return
  [[ -z $org ]] && return

  local label="$org"
  if [[ $SPACESHIP_DRIVERFORGE_SHOW_DEVICE != false ]]; then
    local device
    device=$($SPACESHIP_DRIVERFORGE_COMMAND device current 2>/dev/null)
    [[ -n $device ]] && label="${org}${SPACESHIP_DRIVERFORGE_DEVICE_SEPARATOR}${device}"
  fi

  spaceship::section::v4 \
    --color "$SPACESHIP_DRIVERFORGE_COLOR" \
    --prefix "$SPACESHIP_DRIVERFORGE_PREFIX" \
    --suffix "$SPACESHIP_DRIVERFORGE_SUFFIX" \
    --symbol "$SPACESHIP_DRIVERFORGE_SYMBOL" \
    "$label"
}
```

## Options

Override any of these in `~/.zshrc` before sourcing the file:

| Variable                                | Default        | Effect                                                        |
| --------------------------------------- | -------------- | -------------------------------------------------------------- |
| `SPACESHIP_DRIVERFORGE_SHOW`             | `true`         | `false` hides the section entirely                             |
| `SPACESHIP_DRIVERFORGE_SHOW_DEVICE`      | `true`         | `false` shows only the org, never the controller               |
| `SPACESHIP_DRIVERFORGE_PREFIX`           | `using `       | Text before the section (matches Spaceship's Azure section)    |
| `SPACESHIP_DRIVERFORGE_SYMBOL`           | `󰢛 ` (anvil)  | Section symbol — see the font note below                       |
| `SPACESHIP_DRIVERFORGE_DEVICE_SEPARATOR` | `/`            | Separator in `org/device`                                      |
| `SPACESHIP_DRIVERFORGE_COLOR`            | `#79C0FF`      | Section colour (any zsh `%F` value: ANSI index or `#rrggbb`)   |
| `SPACESHIP_DRIVERFORGE_COMMAND`          | `driverforge`  | Binary to query — point at a dev build if you have one         |

## Font note

The default symbol is the Material Design *anvil* glyph (`nf-md-anvil`,
`U+F089B`), which needs a full **Nerd Font** — a plain Powerline font (including
plain Fira Code) only carries the Powerline glyphs and will show a
missing-glyph box. Either install one:

```bash
brew install --cask font-fira-code-nerd-font   # then select "FiraCode Nerd Font" in your terminal
```

or override the symbol with an emoji, which renders anywhere:

```bash
SPACESHIP_DRIVERFORGE_SYMBOL="🛠️ "
```

## Related

- [Context](/cli/context) — how org and controller selection works
- [`driverforge org`](/cli/org) / [`driverforge device`](/cli/device) — the commands the section reads
