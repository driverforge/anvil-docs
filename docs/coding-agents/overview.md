---
sidebar_position: 1
description: Give Claude Code, Cursor and other coding agents direct access to your drivers' Anvil telemetry and the driverforge CLI.
---

# Overview

Coding agents such as Claude Code, Cursor, Gemini CLI and Codex can work on a
Control4 driver the way you do: change the code, deploy it, trigger it, read
what it reported, and fix what went wrong. Driverforge gives them two ways in.

- **[MCP server](/coding-agents/mcp/overview)**: connects your agent to Anvil,
  so it can read your projects' errors, events and logs itself instead of you
  copying them into the chat.
- **[Agent skills](/coding-agents/skills/overview)**: the `driverforge` CLI
  recognises when an agent is running it, drops its prompts and prints
  machine-readable output, and the skills it ships teach the agent to build,
  deploy and read telemetry from the terminal.

## What an agent can do

With the MCP server connected, you can ask your agent things like:

- "Set up Anvil in this driver."
- "What errors has the Pool Pump driver hit in the last day?"
- "Look into POOLPUMP-4F2A9C1B and fix it."
- "I've just pressed Play on the touch screen. Did `PlayEpisode` run, and what
  did it log?"

The agent finds the project, reads the telemetry, and works from what the
driver actually did rather than from your description of it.

## MCP server or CLI?

Use both. They overlap on reading telemetry, but each does something the other
can't:

|                                                 | MCP server | CLI |
| ----------------------------------------------- | ---------- | --- |
| Read errors, events and logs                    | Yes        | Yes |
| Look up an error by its reference               | Yes        | No  |
| List your projects and fetch setup instructions | Yes        | No  |
| Build, deploy and sync a driver                 | No         | Yes |
| Needs a terminal                                | No         | Yes |

An agent with only the MCP server can diagnose a problem; one with the CLI as
well can also ship the fix and confirm it worked.

## Docs your agent can read

Every page of these docs is also served as Markdown, at its own URL with `.md`
on the end: [`/cli/init.md`](pathname:///cli/init.md) for the
[`init` command](/cli/init), for example. The **Copy page** menu beside each
page's title copies that Markdown, opens it, or hands it to Claude or ChatGPT.

To point an agent at the docs as a whole, give it
[`llms.txt`](pathname:///llms.txt), an index of every page with a one-line
summary and a link to its Markdown. The agent reads the index, then fetches
only the pages it needs.

[`llms-full.txt`](pathname:///llms-full.txt) holds every page in one file. It's
meant for tools that index documentation; it's too large for many agents to
load in one go, so prefer `llms.txt` when you're giving an agent the docs
directly.
