---
sidebar_position: 9
---

# Coding agents

Coding agents such as Claude Code, Cursor, Gemini CLI and Codex can drive
`driverforge` for you: deploy a change, trigger the driver, read what it
reported, fix the code, and deploy again.

The CLI recognises when an agent is running it and switches to agent mode:

- **No prompts.** A command that would have asked a question stops with an
  error naming it, so the agent can pass the flag that answers it.
- **Structured output.** Every command writes its result as JSON on stdout, and
  its progress as JSON lines on stderr.
- **Errors an agent can act on.** Every failure carries a stable `code`, a
  `hint` naming the fix, and a documented exit status.

Set `DRIVERFORGE_OUTPUT=json` to get the same structured output in your own
scripts, or `DRIVERFORGE_AGENT_MODE=false` to turn agent mode off.

Each command's page shows its output both ways. For the full contract, and how
an agent puts the CLI to work, see [Coding Agents](/coding-agents/overview):

- [Agents using the CLI](/coding-agents/skills/cli): detection, the output
  streams, error codes and exit statuses, and installing skills
- [Available skills](/coding-agents/skills/available): what each skill
  teaches your agent, including the driver dev/test cycle: deploy, trigger,
  read, compare, repeat
