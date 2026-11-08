---
sidebar_label: Agents using the CLI
description: "How the driverforge CLI behaves when a coding agent runs it, and how to install the skills that teach an agent to use it."
---

# Agents using the CLI

Coding agents such as Claude Code, Cursor, Gemini CLI and Codex can drive
`driverforge` for you: deploy a change, trigger the driver, read what it
logged, fix the code, and deploy again. Two things make that work:

- **Agent mode.** The CLI recognises when an agent is running it and changes
  how it talks, so the agent can rely on what it reads.
- **Skills.** The routines an agent follows with the CLI, installed with one
  command. See [Installing skills](#installing-skills).

## How agent mode is detected

The CLI switches to agent mode when it finds a variable these agents set in
their shells (`CLAUDECODE`, `CURSOR_AGENT`, `GEMINI_CLI` or `CODEX_SANDBOX`).
`DRIVERFORGE_AGENT_MODE` overrides detection either way:

```bash
DRIVERFORGE_AGENT_MODE=true   # always on, for an agent we don't recognise
DRIVERFORGE_AGENT_MODE=false  # always off, even inside an agent
```

To choose the output format on its own, set `DRIVERFORGE_OUTPUT`. It overrides
agent mode either way, so a script can ask for JSON without claiming to be an
agent:

```bash
DRIVERFORGE_OUTPUT=json   # structured output, wherever it runs
DRIVERFORGE_OUTPUT=text   # readable output, even inside an agent
```

## What changes

- **No prompts.** Nothing waits for an answer an agent can't give. A command
  that would have asked a question stops with `input_required` and names the
  question, so the agent can pass the flag that answers it. The first-run
  [telemetry](/cli/telemetry) question isn't asked (your existing choice
  stands) and [error reports](/cli/error-reporting) are never offered.
- **No update notices** after a command.
- **Machine-readable output from every command.** See [Output](#output) below.

## Output

Every command writes JSON, split across the two streams so an agent can read
the result without wading through progress.

**stdout** carries one JSON document: the command's result, or an
[error](#errors-an-agent-can-act-on). [`logs`](/cli/logs),
[`errors`](/cli/errors), [`events`](/cli/events) and [`get`](/cli/get) write
their documents here as before. `logs --follow` writes one JSON object per
line as entries arrive.

**stderr** carries one JSON object per line as the command works:

```json
{"progress": {"status": "running", "message": "Package…"}}
{"progress": {"status": "ok", "message": "Build complete"}}
```

A progress `status` is one of `running`, `ok`, `skipped`, `failed`, `warning`
or `info`. If the command fails, its error follows as the last line.

Help is a document too. `--help`, `-h`, `help <command>` and a command group
run on its own each print one JSON object describing the command. For
`driverforge skills install --help` (long text and global flags trimmed here):

```json
{
  "command": "driverforge skills install",
  "short": "Install skills into a coding agent's skills directory",
  "long": "…",
  "usage": "driverforge skills install [skill...] [flags]",
  "aliases": [],
  "examples": [
    "driverforge skills install",
    "driverforge skills install --global",
    "driverforge skills install --path ./tools/skills"
  ],
  "flags": [
    {"name": "force", "shorthand": null, "type": "bool", "default": "false", "usage": "replace a directory driverforge didn't install"},
    {"name": "global", "shorthand": null, "type": "bool", "default": "false", "usage": "install for the current user, into ~/.agents/skills"},
    {"name": "path", "shorthand": null, "type": "string", "default": "", "usage": "install into this skills directory"}
  ],
  "global_flags": […],
  "subcommands": []
}
```

Each entry in `flags` and `global_flags` has the same fields; `shorthand` is
`null` for a flag without one. `subcommands` lists a group's commands, each
with its `name` and `short` description.

Only `--version` and [`completion`](/cli/completion) stay as text.

### When a person has to act

Some steps need you, not the agent. [`login`](/cli/login) writes the link and
code you need to approve the sign-in as an `action_required` line on stderr
(formatted here for reading), then waits for you:

```json
{
  "action_required": {
    "message": "Open the link in a browser and approve the sign-in with this code.",
    "url": "…",
    "url_with_code": "…",
    "code": "ABCD-EFGH",
    "expires_at": "…"
  }
}
```

The agent hands you the link and code; once you approve, `login` finishes.

### Commands that would have asked

- [`sync`](/cli/sync) won't escalate to a full deploy on its own. When the change
  needs one, it stops with `deploy_required`; run it again with `--deploy`.
- [`doctor`](/cli/doctor) without `--yes` reports the repairs it would make,
  writes nothing, and exits `1`. Run it again with `--yes` to apply them.
- [`init`](/cli/init) needs every answer as a flag. Run without them, it stops
  with `input_required` and lists what's missing. Preview the plan with
  `--dry-run`, then apply it with `--yes`.

## The read loop

The commands an agent needs to close the loop after a deploy:

```bash
driverforge deploy
driverforge logs --version <n> --until-match '"data"' --timeout 30s
```

`<n>` is the `version` the deploy returned, so the read covers only what that
deploy reported, even if someone else deploys to the controller meanwhile.
`--until-match` returns the moment the expected output arrives, so the agent
never has to sleep and retry. Payloads come back exactly as the driver
produced them, so an undocumented wrapper in a vendor response is right there
to see.

## Errors an agent can act on

Every failure carries a stable `code`, a `message`, and usually a `hint` naming
the exact flag, variable or command that fixes it. `details` holds structured
facts, such as what was missing or the candidates to choose from:

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

An unexpected failure has the code `internal_error` and may carry a
`reference` to quote to [support](mailto:support@driverforge.com).

Branch on the exit status and the `code`, never on the message text, which may
change.

A wait (`--until-match` or `--min-events`) that ends at `--timeout` exits `3`
with the code `wait_timeout`. When the controller isn't reporting, its
`details` add `device_not_reporting: true` and `last_seen_at`, and the hint
says to check the controller and its Anvil agent rather than to wait longer:

```json
{
  "error": {
    "code": "wait_timeout",
    "message": "The stop condition wasn't met before --timeout.",
    "hint": "The controller isn't reporting: check it and its Anvil agent are running before waiting again.",
    "details": { "device_not_reporting": true, "last_seen_at": "2026-11-05T03:07:12Z" }
  }
}
```

## Warnings

A command that succeeds can still carry `warnings`, each with a stable `code`,
a `message` and sometimes `details`. `logs`, `errors` and `events` use:

- `no_entries`: nothing matched the scope and filters.
- `retention_clamped`: `--since` reaches past the plan's retention; only the
  last `details.window_minutes` were searched.
- `tail_clamped`: `--tail` is over the maximum; the newest page was returned.
- `payload_truncated`: some entries were cut at `--max-payload-bytes`;
  `details.entries` lists them.
- `device_not_reporting`: the controller hasn't reported to Driverforge for 5
  minutes or more; `details.last_seen_at` is when it last did (RFC 3339, UTC).
  Empty results from a controller that isn't reporting say nothing about the
  driver: check the controller first.

## Exit status

Every command uses the same exit statuses, in agent mode or not:

| Status | Meaning                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| `0`    | Success                                                                                                              |
| `1`    | Any other failure, such as `skill_not_installed` (no skills installed by `driverforge` in the searched directories)  |
| `2`    | A bad flag or value, or an answer a prompt would have asked for (`usage_error`, `input_required`)                    |
| `3`    | A wait ended at `--timeout` without its condition being met                                                          |
| `4`    | Not signed in, or the session expired (`auth_required`)                                                              |
| `5`    | The organization, project or controller couldn't be determined, or the directory isn't an initialised driver project |
| `6`    | Rate limited, or a plan limit reached (`rate_limited`, `project_limit_reached`)                                      |
| `130`  | Interrupted                                                                                                          |

## Installing skills

The [available skills](/coding-agents/skills/available) ship inside the
`driverforge` CLI, so the version you install always matches the CLI they
describe. Skills follow the [Agent Skills](https://agentskills.io)
specification, so one install works with any agent that supports it, including
Claude Code, Codex and Gemini CLI.

Install them for the current project:

```bash
driverforge skills install
```

This writes the skills to `.agents/skills/` at the root of the current Git
repository. Commit them, and everyone working on the driver gets the same
skills.

To install them for yourself in every project instead, use `--global`, which
writes to `~/.agents/skills/`:

```bash
driverforge skills install --global
```

| Option     | Description                                                          |
| ---------- | -------------------------------------------------------------------- |
| `--global` | Install for the current user, in `~/.agents/skills/`                 |
| `--path`   | Install to this directory, relative to the current working directory |
| `--force`  | Replace a directory of the same name that `driverforge` didn't write |

## Keeping skills up to date

After you [upgrade the CLI](/cli/upgrading), update the installed skills:

```bash
driverforge skills update
```

This updates every skill `driverforge` installed, in both standard locations:
`.agents/skills/` at the root of the current Git repository, and
`~/.agents/skills/`. For each skill, the output says whether it was `updated`
or `unchanged`.

| Option     | Description                                   |
| ---------- | --------------------------------------------- |
| `--global` | Update only the skills in `~/.agents/skills/` |
| `--path`   | Update only the skills in this directory      |

Name a skill to update only that one: `driverforge skills update anvil-driver-dev-cycle`.

If no skills installed by `driverforge` are found, the command fails with
`skill_not_installed` and lists the directories it searched.

To see the skills the CLI ships, run `driverforge skills list`.
