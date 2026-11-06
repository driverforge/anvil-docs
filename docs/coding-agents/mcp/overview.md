---
sidebar_label: Overview
description: The Anvil MCP server gives a coding agent direct, read-only access to your projects and the errors, events and logs your drivers report.
---

# MCP server

The Anvil MCP server connects a coding agent to Anvil. Instead of you copying
errors and logs into the chat, the agent reads them itself: it finds the
project, pulls the telemetry it needs, and works from what the driver actually
did.

It speaks the [Model Context Protocol](https://modelcontextprotocol.io), so it
works with any agent that supports remote MCP servers, including Claude Code,
Cursor, Gemini CLI and Codex. There's nothing to install: you add one URL to
your agent and sign in.

## What it does

The server gives your agent [tools](/coding-agents/mcp/tools) for:

1. **Finding your projects** - List the projects you belong to, and fetch the
   instructions for setting the SDK up in a driver
2. **Reading errors** - List a project's errors, or look one up by the
   reference shown in Anvil, with its stack trace, the arguments the handler
   was called with, and what it logged
3. **Reading events** - See which handlers Control4 called, with what arguments,
   and what they returned
4. **Reading logs** - Search what your driver logged, by level, driver, controller or text

## It acts as you

The agent signs in with your Driverforge account, so it sees exactly the
projects and data you can see, and nothing more. It can only read: nothing it
does through the server changes your projects or your drivers.

## What to ask

Once it's connected, ask your agent things like:

- "What errors has the Pool Pump driver hit in the last day?"
- "Look into POOLPUMP-4F2A9C1B and fix it."
- "I've just pressed Play on the touch screen. Did `ReceivedFromProxy` run, and
  what did it log?"

## When you'll want the CLI too

The MCP server reads telemetry; it doesn't build or deploy. To let an agent
ship a fix and confirm it worked, give it the `driverforge` CLI as well. See
[Agent skills](/coding-agents/skills/overview).

## Next steps

- [Set up the MCP server](/coding-agents/mcp/setup) in your agent
- Browse the [tools](/coding-agents/mcp/tools) it offers
