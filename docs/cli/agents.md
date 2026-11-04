---
sidebar_position: 9
---

# Coding agents

Coding agents such as Claude Code, Cursor, Gemini CLI and Codex can drive
`driverforge` for you: deploy a change, trigger the driver, read what it
logged, fix the code, and deploy again. The CLI recognises when an agent is
running it and changes how it talks, so the agent can rely on what it reads.

## How it's detected

The CLI switches to agent mode when it finds a variable these agents set in
their shells (`CLAUDECODE`, `CURSOR_AGENT`, `GEMINI_CLI` or `CODEX_SANDBOX`).
`DRIVERFORGE_AGENT_MODE` overrides detection either way:

```bash
DRIVERFORGE_AGENT_MODE=true   # always on, for an agent we don't recognise
DRIVERFORGE_AGENT_MODE=false  # always off, even inside an agent
```

## What changes

- **No prompts.** Nothing waits for an answer an agent can't give: the first-run
  [telemetry](/cli/telemetry) question isn't asked (your existing choice
  stands) and [error reports](/cli/error-reporting) are never offered.
- **No update notices** after a command.
- **Machine-readable output.** [`logs`](/cli/logs), [`errors`](/cli/errors),
  [`events`](/cli/events) and [`get`](/cli/get) print JSON on stdout, and
  everything else on stderr as one JSON object per line.

## The read loop

The commands an agent needs to close the loop after a deploy:

```bash
driverforge deploy
driverforge logs --version current --until-match '"data"' --timeout 30s
```

`--version current` reads only what the version you just deployed reported, and
`--until-match` returns the moment the expected output arrives, so the agent
never has to sleep and retry. Payloads come back exactly as the driver
produced them, so an undocumented wrapper in a vendor response is right there
to see.

## Errors an agent can act on

Every failure carries a stable `code` and a `hint` naming the exact flag,
variable or command that fixes it, alongside a documented
[exit status](/cli/logs#exit-status):

```json
{
  "error": {
    "code": "context_unresolved",
    "message": "No project could be determined.",
    "hint": "Run from a driver repo, pass --project, or set DRIVERFORGE_PROJECT.",
    "details": { "missing": ["project"] }
  }
}
```

Branch on the exit status and the `code`, never on the message text, which may
change. Across every command, a bad flag or value exits `2`.
