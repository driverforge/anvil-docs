---
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# run

Run your driver's Lua on your own machine while a real controller drives it.
Save a file, trigger the action again, and the new code handles it: no build,
no deploy, no waiting for the driver to reload. When you need to look closer,
attach a debugger and step through your handlers with breakpoints.

:::info[Coming soon]
`driverforge run` isn't available in the current release; running it reports
that it's coming soon. This page describes how it will work.
:::

## Usage

```bash
driverforge run [options]
```

`run` swaps your driver on the controller for a small **stub** and runs your
real source in a Lua process on your machine. Every callback the controller
makes is handed to your local code, and every `C4:*` call your code makes is
carried out on the controller, with the real result handed back. From your
driver's point of view it is running on the controller; from your machine's
point of view it is an ordinary local Lua process, which your editor, your
coding agent and your debugger can all work with directly.

Ctrl+C stops it. Run [`driverforge deploy`](/cli/deploy) to put your real
driver back, or pass `--deploy-on-exit` and `run` does it for you.

## Prerequisites

- The project is [initialised](/cli/init) (`driverforge init`)
- You're [signed in](/cli/login) (`driverforge login`)
- A target controller is [selected](/cli/device) (`driverforge device select`)
- The [Anvil Agent](/agent/overview) is installed and running on the controller
- A Lua 5.1 interpreter is on your machine. LuaJIT is the easiest to get
  (`brew install luajit`); the CLI looks for `lua5.1`, `luajit` or `lua` on your
  `PATH`, or uses whatever `--lua` or `DRIVERFORGE_LUA` points at.

## The edit loop

The usual way to try a change is build, deploy, wait for the driver to
reload, then trigger the behaviour you changed. `run` removes everything but
the last step:

1. Start `driverforge run` once.
2. Edit a file and save it, in your editor or from your coding agent.
3. Trigger the action again: press the button in Composer or the app, send the
   command, wait for the next poll. The new code handles it.

Saving reloads your driver in place, under the same rules as
[`sync`](/cli/sync): handlers are redefined, `OnDriverInit` and
`OnDriverLateInit` don't run again, and in-memory state survives. A file that
fails to compile is reported, and the previous code keeps running.

`print` output and errors appear in your terminal as they happen, so a coding
agent running `run` sees the result of each change in the same place it made
it. With `--verbose`, so does every `C4` call and its result.

## How it works

The stub that replaces your driver has no business logic of its own. It
forwards each callback (`OnDriverInit`, `ReceivedFromProxy`,
`OnPropertyChanged`, `OnTimerExpired`, …) to your machine, and executes the
`C4:*` calls your code makes in reply.

Every `C4:*` call is a round trip to the controller, so the route matters:

- **Over your local network, through the Anvil Agent**, when your machine can
  reach the controller and the agent supports it. This is the fast path: each
  call costs a LAN round trip. You'll see
  `Local network relay up through the agent` once it's in use.
- **Through Anvil's broker**, the cloud service the Anvil Agent reports to.
  Both ends connect outbound, so this works across VLANs and through a
  customer's firewall, at the cost of an internet round trip per call.

The broker connection is set up first and stays up for the whole run. If the
local network path drops, `run` falls back to the broker without losing a
call, and says so. `--no-relay` keeps everything on the broker.

## A run, step by step

1. **Your driver compiles locally first.** A driver that fails to compile stops
   here, before the controller is touched.
2. **The stub is built.** The CLI builds your project exactly as `deploy` does,
   then replaces the Lua inside the `.c4z` with the stub. `driver.xml` is left
   byte-for-byte as it was, so your bindings, proxies and properties stay put.
3. **The stub is deployed** through the agent, like any `deploy`.
4. **The controller now drives your local code**, over the local network when
   it can and through the broker when it can't.
5. **Saving a file reloads your driver in place** (see [the edit loop](#the-edit-loop)).
6. **Ctrl+C stops it.** The stub stays on the controller, inert, until you run
   [`driverforge deploy`](/cli/deploy). With `--deploy-on-exit`, `run` builds
   and deploys your driver as `deploy` would, and confirms when it's back.

## Debugging with breakpoints

Because your driver runs in a local Lua process, you can stop it at a
breakpoint while the controller is talking to it, inspect variables and step
through handlers. `--debug` connects that process to a Lua debugger using
[MobDebug](https://github.com/pkulchenko/MobDebug), the remote debugging
protocol ZeroBrane Studio and the VS Code "Lua MobDebug adapter" speak:

```bash
driverforge run --debug                    # debugger listening on localhost:8172
driverforge run --debug=192.168.1.20:8172  # debugger on another address
```

The debugger must already be listening when `run` starts: the Lua process
connects out to it before your driver loads. Without `--debug`, no debugger is
loaded and your code runs at full speed.

### 1. Install MobDebug for the Lua that `run` uses

MobDebug needs the `mobdebug` module and LuaSocket, built for the same Lua 5.1
interpreter `run` uses. Pick one:

- **With LuaRocks**, for Lua 5.1:

  ```bash
  luarocks --lua-version 5.1 install mobdebug   # also installs LuaSocket
  eval "$(luarocks --lua-version 5.1 path)"     # in the shell you run driverforge from
  ```

- **From ZeroBrane Studio**, which ships both for Lua 5.1. On macOS:

  ```bash
  ZBS=/Applications/ZeroBraneStudio.app/Contents/ZeroBraneStudio
  export LUA_PATH="./?.lua;$ZBS/lualibs/?/?.lua;$ZBS/lualibs/?.lua"
  export LUA_CPATH="$ZBS/bin/clibs/?.dylib"
  ```

`run` passes your environment to the Lua process, so `LUA_PATH` and
`LUA_CPATH` set in your shell reach it. If MobDebug can't be loaded, `run`
warns and carries on without a debugger.

### 2. Start the debugger, then `run`

<Tabs groupId="debugger">
<TabItem value="vscode" label="VS Code">

Install the **Lua MobDebug adapter** extension (`AlexeyMelnichuk.lua-mobdebug`),
then add a configuration that listens for `run` to `.vscode/launch.json` in your
driver project:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "driverforge run --debug",
      "type": "luaMobDebug",
      "request": "attach",
      "workingDirectory": "${workspaceFolder}",
      "sourceBasePath": "${workspaceFolder}",
      "listenPublicly": false,
      "listenPort": 8172,
      "stopOnEntry": false,
      "sourceEncoding": "UTF-8"
    }
  ]
}
```

1. Set breakpoints in your driver's source files.
2. Start the **driverforge run --debug** configuration (F5). VS Code waits for
   a connection on port 8172.
3. In a terminal in the project, run `driverforge run --debug`.
4. Trigger the action on the controller. VS Code stops at your breakpoint.

`stopOnEntry` is `false` because the first line after the debugger connects
belongs to `run`'s own loader, not your driver. Set `listenPublicly` to `true`
only when `run` connects from another machine (`--debug=<your-ip>:8172`).

</TabItem>
<TabItem value="zerobrane" label="ZeroBrane Studio">

1. Open your driver project's folder and set it as the project directory
   (**Project → Project Directory → Choose…**).
2. Choose **Project → Start Debugger Server**. ZeroBrane listens on port 8172.
3. Set breakpoints in your driver's source files.
4. In a terminal in the project, run `driverforge run --debug`.
5. ZeroBrane stops on the first line after the debugger connects, which is in
   `run`'s own loader. Continue (F5), then trigger the action on the
   controller; ZeroBrane stops at your breakpoint.

</TabItem>
<TabItem value="other" label="Other editors">

Any editor or debugger that runs a MobDebug server works the same way: start
its server on a port, then pass that address to `--debug`:

```bash
driverforge run --debug=localhost:9000
```

Your driver's files are loaded from their absolute paths on your machine, so
breakpoints set on the files in your project match without any path mapping.

</TabItem>
</Tabs>

### While you're stopped at a breakpoint

Only your local Lua process pauses. The controller and the stub keep running:
callbacks that arrive while you're stopped wait in line and reach your code
when you continue, and the connection to the controller stays up. The
controller doesn't wait for your answer to a callback in any case (see
[what's different](#whats-different-from-running-on-the-controller)), so a
long pause doesn't stall the controller, but anything time-based in your
driver will see the time you spent paused.

Saving a file while you're stopped reloads it when the process continues.

## Options

| Option                  | Description                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `--device`              | Controller to run against (name, hostname, or id); overrides the selected one                                   |
| `--select`              | Re-select the target controller first                                                                          |
| `--configuration`, `-c` | Build configuration to run; also selects `config.<name>.lua` in the local process                              |
| `--debug[=host:port]`   | Connect the local Lua process to a MobDebug debugger; `localhost:8172` when given without an address            |
| `--deploy-on-exit`      | When `run` stops, build and deploy your driver to replace the stub, as `driverforge deploy` would              |
| `--no-relay`            | Send everything through the broker, not over your local network through the agent                              |
| `--no-reload`           | Don't reload your driver when source files change                                                              |
| `--lua`                 | Lua 5.1 interpreter to run your driver with (default: `lua5.1`, `luajit` or `lua` on `PATH`)                   |

An address for `--debug` needs the `=`: `--debug=host:port`. A bare
`--debug` followed by a separate word is read as `--debug` plus that word.

## Output

In a terminal the output is for reading. Under a [coding agent](/coding-agents/skills/cli), or with `DRIVERFORGE_OUTPUT=json`, the result is one JSON document on stdout and progress is one JSON object per line on stderr.

<Tabs groupId="output">
<TabItem value="interactive" label="Interactive">

```text
✓ Stub online as poolpump; starting the driver locally
✓ Local network relay up through the agent: C4 calls skip the cloud
✓ Driver running locally (12 handlers)
← ExecuteCommand("SET_SPEED",{SPEED="2400"})
  | pump speed set to 2400 rpm
  changed: driver.lua
✓ Reloaded driver source
```

</TabItem>
<TabItem value="structured" label="Structured">

`run` writes one JSON object per event on stdout, as it happens, until it stops. `event` is one of `compiled`, `ready`, `callback`, `callback_result`, `c4_call`, `c4_result`, `print`, `runtime_log`, `reloaded`, `fatal`, `stub_online`, `stub_offline`, `stub_log` or `runtime_exited`. Fields that don't apply to an event are left out.

stdout:

```json
{"event": "stub_online", "driver": "poolpump"}
{"event": "ready", "handlers": ["ExecuteCommand", "ReceivedFromProxy", "OnPropertyChanged"]}
{"event": "callback", "summary": "ExecuteCommand(\"SET_SPEED\",{SPEED=\"2400\"})", "name": "ExecuteCommand", "args": ["SET_SPEED", {"SPEED": "2400"}]}
{"event": "print", "text": "pump speed set to 2400 rpm"}
{"event": "callback_result", "name": "ExecuteCommand", "ok": true, "handled": true}
```

</TabItem>
</Tabs>

## Examples

Run on the selected controller, and put the real driver back when you stop:

```bash
driverforge run --deploy-on-exit
```

Run the `release` configuration on a specific controller, showing every `C4`
call as it happens:

```bash
driverforge run -c release --device "Plant Room" --verbose
```

Debug under VS Code or ZeroBrane Studio, with the debugger already listening
on port 8172:

```bash
driverforge run --debug
```

Debug from a machine that can't reach the controller directly, through the
broker:

```bash
driverforge run --debug --no-relay
```

## What's different from running on the controller

Your code is real and so is the controller, but there's a network between them.
A few things behave differently because of that:

- **Callbacks don't wait for your answer.** The controller hands a callback over
  and carries on. A handler whose return value the controller uses
  (`UIRequest`, `GetPrivateKeyPassword`, the `List*` family) still runs, but the
  controller sees `nil`.
- **Every `C4:*` call is a round trip.** Over your local network that's quick;
  through the broker it's an internet round trip. Either way, timing-sensitive
  code won't behave exactly the way it does in production.
- **State starts fresh.** Swapping the stub in reloads the driver, so anything it
  held in memory is gone. `Properties` and `PersistData` are copied to your local
  process on every callback, but writes to `PersistData` aren't saved while
  `run` is running.
- **Timers, URL requests and other controller objects work.** Callbacks you pass
  to `C4:SetTimer` or `C4:url():OnDone` fire in your local code, and objects the
  controller returns can be used and cancelled as usual.
- **Anvil reports from the stub, not your SDK.** The stub is instrumented, so the
  console shows one event per callback and every error your handlers raise. Your
  driver's own Anvil SDK stays quiet while `run` is running.
- **One `run` per driver.** If a colleague is already running the same driver on
  the same controller, starting a second `run` replaces their stub.

## Troubleshooting

- **"Your sign-in has expired, so the driver can't start"**: run
  `driverforge login`, then `driverforge run` again. `run` needs a current
  sign-in to connect, and yours has expired or been revoked.
- **"Couldn't reach Driverforge to start the driver"**: your machine couldn't
  reach Driverforge to set the run up. Check your connection and try again;
  there's no need to sign in again.
- **"no Lua 5.1 interpreter found"**: install one (`brew install luajit`) or
  point `--lua` at one you already have.
- **Nothing arrives after "Running. Ctrl+C to stop."**: the stub reaches the
  broker from the controller, so the controller needs outbound access to
  `ingest.driverforge.com:8883`, the same route the Anvil Agent uses. Check the
  agent's connectivity in the console.
- **"can't relay over the local network yet"**: the controller's agent predates
  the local network path. `run` works through the broker; update the agent with
  [`driverforge upgrade`](/cli/upgrade) for the faster path.
- **"mobdebug not installed"**: the Lua process couldn't load MobDebug, so it
  carried on without a debugger. Install it for the same Lua 5.1 interpreter
  ([step 1](#1-install-mobdebug-for-the-lua-that-run-uses)) and check that
  `LUA_PATH` and `LUA_CPATH` are set in the shell you run `driverforge` from.
- **The debugger never connects**: start the debugger's server before
  `driverforge run --debug`, and check that the port matches (`--debug=host:port`).
  For a debugger on another machine, it must listen on all interfaces
  (`listenPublicly: true` in VS Code).
- **Breakpoints aren't hit**: set them in your project's source files, the ones
  `run` loads, not in a built copy under `dist/`.
- **You quit without deploying**: the stub is still installed, and does nothing.
  Run [`driverforge deploy`](/cli/deploy) whenever you're ready; the next
  `run` replaces it too.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
