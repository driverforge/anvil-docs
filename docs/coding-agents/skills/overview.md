---
sidebar_label: Overview
description: Agent skills teach a coding agent to build, deploy, exercise and validate a Control4 driver with the driverforge CLI.
---

# Agent skills

A coding agent with a terminal can run the `driverforge` CLI the way you do:
build the driver, deploy it to a controller, read what it reported, and fix
what went wrong. Agent skills teach it to do that well.

A skill is a set of instructions an agent loads when the task calls for it.
Skills follow the open [Agent Skills](https://agentskills.io) specification, so
the same skill works in Claude Code, Codex, Gemini CLI and any other agent that
supports it.

## How it works

Two parts work together:

1. **The CLI speaks to agents** - When an agent runs it, `driverforge` drops its
   prompts, writes structured output, and fails with stable error codes and
   exit statuses. The agent always knows what happened and what to do next.
2. **Skills teach the routine** - Having the commands isn't the same as knowing
   how to use them. A skill gives the agent the loop, the decision rules, and
   the habits that make a session productive: reading only the version it just
   deployed, waiting for a match instead of sleeping and retrying, and asking
   you to press a button only when it can't cause the action itself.

## Shipped with the CLI

The skills ship inside the `driverforge` CLI, so the version you install always
matches the CLI it describes. One command installs them, and running it again
after you upgrade the CLI updates them:

```bash
driverforge skills install
```

The skills cover the routine. For anything they don't, point your agent at
[`llms.txt`](pathname:///llms.txt), the index of these docs as Markdown (see
[Docs your agent can read](/coding-agents/overview#docs-your-agent-can-read)).

## When you'll want the MCP server too

The CLI reads errors, events and logs as well, but the
[MCP server](/coding-agents/mcp/overview) can also look up an error by the
reference shown in Anvil, list your projects, and work in an agent without a
terminal. Use both.

## Next steps

- [Agents using the CLI](/coding-agents/skills/cli): agent mode, its output,
  and installing skills
- [Available skills](/coding-agents/skills/available): what each skill
  teaches, including the driver dev/test cycle an agent runs on a driver
