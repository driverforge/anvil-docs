---
sidebar_label: Setup
description: Connect a coding agent to the Anvil MCP server and sign in with your Driverforge account.
---

# Set up the MCP server

The Anvil MCP server lets a coding agent read your Anvil data directly: the
projects you belong to, and the errors, events and logs your drivers report. It
speaks the [Model Context Protocol](https://modelcontextprotocol.io), so it
works with any agent that supports remote MCP servers.

The server lives at:

```text
https://mcp.driverforge.com/mcp
```

It uses the Streamable HTTP transport. The agent acts as you, so it sees exactly
the projects and data your Driverforge account can see, and nothing more.

## Connect your agent

### Claude Code

```bash
claude mcp add --transport http anvil https://mcp.driverforge.com/mcp
```

Add `--scope user` to make it available in every project rather than only the
current one.

### Codex

```bash
codex mcp add anvil --url https://mcp.driverforge.com/mcp
```

Or add it to `~/.codex/config.toml` yourself:

```toml
[mcp_servers.anvil]
url = "https://mcp.driverforge.com/mcp"
```

Then sign in with `codex mcp login anvil`.

### Gemini CLI

```bash
gemini mcp add --transport http anvil https://mcp.driverforge.com/mcp
```

This adds it to the current project's `.gemini/settings.json`. Add
`--scope user` to make it available in every project. To edit the settings
file yourself, use `httpUrl`, not `url`, which Gemini CLI reserves for SSE
servers:

```json
{
  "mcpServers": {
    "anvil": {
      "httpUrl": "https://mcp.driverforge.com/mcp"
    }
  }
}
```

In a session, run `/mcp auth anvil` to sign in.

### Cursor

Add the server to `.cursor/mcp.json` in your project, or to
`~/.cursor/mcp.json` to make it available in every project:

```json
{
  "mcpServers": {
    "anvil": {
      "url": "https://mcp.driverforge.com/mcp"
    }
  }
}
```

### VS Code (GitHub Copilot)

Add the server to `.vscode/mcp.json` in your workspace. VS Code uses a
`servers` key and needs the `type`:

```json
{
  "servers": {
    "anvil": {
      "type": "http",
      "url": "https://mcp.driverforge.com/mcp"
    }
  }
}
```

To add it to your user profile instead, so it's available in every
workspace:

```bash
code --add-mcp '{"name":"anvil","type":"http","url":"https://mcp.driverforge.com/mcp"}'
```

### Other agents

Most agents take a JSON entry in their MCP configuration file. Point it at the
server URL:

```json
{
  "mcpServers": {
    "anvil": {
      "url": "https://mcp.driverforge.com/mcp"
    }
  }
}
```

Where the file lives, and whether the agent needs a `type` or `transport` field
alongside `url`, depends on the agent. Check its documentation for adding a
remote, HTTP-based MCP server.

## Sign in

The server needs to know who you are before it returns any data. There are two
ways to sign in, and which one you use depends on your agent.

### In the browser, when the agent connects

Agents that support MCP authorization, among them Claude Code, Codex, Gemini
CLI and Cursor, find the
server's sign-in endpoints themselves. The first time the agent connects, it
opens your browser at the Driverforge sign-in page. Sign in, approve access, and
the browser hands control back to the agent.

In Claude Code, run `/mcp`, choose **anvil** and select **Authenticate** if the
browser doesn't open on its own.

### With the `authenticate` tool

Any agent can sign in by asking the server, which works even where the agent
has no built-in support for MCP sign-in. Ask your agent to "authenticate with
Anvil". It calls the [`authenticate`](/coding-agents/mcp/tools#authenticate)
tool, which returns a link and a code:

1. Open the link in your browser and sign in to Driverforge.
2. If the page asks for a code, enter the one your agent showed you, then
   approve access.
3. Tell your agent you're done. It calls `authenticate` again to finish.

The link expires after a few minutes. If it does, ask the agent to
authenticate again for a fresh one.

### Checking who you're signed in as

Ask your agent "am I signed in to Anvil?" It calls
[`auth_status`](/coding-agents/mcp/tools#auth_status), which reports the
account it's acting as.

## Sessions

The agent's connection to the server is a session, and the sign-in belongs to
that session. A session ends after an hour without any requests. If a tool
replies that authentication is required, sign in again the same way; agents
that signed in through the browser usually do this for you.

## Next steps

- See what your agent can ask for in the [tools reference](/coding-agents/mcp/tools).
- Add the [`driverforge` CLI](/coding-agents/skills/cli) so your agent can deploy the fixes it
  makes.
