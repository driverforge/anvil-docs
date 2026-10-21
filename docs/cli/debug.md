---
sidebar_position: 10
---

# debug

Run your driver's Lua on your own machine while a real controller drives it.
Set breakpoints in your IDE, inspect variables, step through handlers, and save
a file to have the next event run the new code. No rebuild, no redeploy.

:::note Beta
Live debugging is new. If something doesn't behave the way this page describes,
tell us.
:::

## Usage

```bash
driverforge debug [options]
```

`debug` swaps your driver on the controller for a small **stub** and runs your
real source in a Lua process on your machine. Every callback the controller
makes is handed to your local code, and every `C4:*` call your code makes is
carried out on the controller, with the real result handed back. From your
driver's point of view it is running on the controller; from your debugger's
point of view it is an ordinary local Lua process.

When you're done, Ctrl+C ends the session and
[`driverforge deploy`](/cli/deploy) puts your real driver back.

## Prerequisites

- The project is [initialised](/cli/init) (`driverforge init`)
- You're [signed in](/cli/login) (`driverforge login`)
- A target controller is [selected](/cli/device) (`driverforge device select`)
- The [Anvil Agent](/agent/overview) is installed and running on the controller
- A Lua 5.1 interpreter is on your machine. LuaJIT is the easiest to get
  (`brew install luajit`); the CLI looks for `lua5.1`, `luajit` or `lua` on your
  `PATH`, or uses whatever `--lua` or `DRIVERFORGE_LUA` points at.

## When to reach for it

[`sync`](/cli/sync) is the fast loop when you know what to change. `debug` is
for when you don't: a handler that misbehaves only with a real device on the
other end, a property change that sets off something you can't see, state that
goes wrong three callbacks in. Instead of adding `print` statements and
redeploying, you stop at a breakpoint while the controller is talking to your
driver, and look.

## How it works

The stub that replaces your driver has no business logic of its own. It
forwards each callback (`OnDriverInit`, `ReceivedFromProxy`,
`OnPropertyChanged`, `OnTimerExpired`, …) to your machine, and executes the
`C4:*` calls your code makes in reply.

Both ends connect **outbound** to Anvil's broker, the same service the Anvil
Agent reports to. Your machine never needs a route to the controller once the
stub is deployed, so a session works across VLANs and through a customer's
firewall just as well as on your own bench.

## A session, step by step

1. **Your driver loads locally first.** A driver that fails to load stops the
   session here, before the controller is touched.
2. **The stub is built.** The CLI builds your project exactly as `deploy` does,
   then replaces the Lua inside the `.c4z` with the stub. `driver.xml` is left
   byte-for-byte as it was, so your bindings, proxies and properties stay put.
3. **The stub is deployed** through the agent, like any `deploy`.
4. **The controller now drives your local code.** `print` output appears in your
   terminal; with `--verbose`, so does every `C4` call and its result.
5. **Saving a file reloads your driver in place.** Handlers are redefined,
   `OnDriverInit`/`OnDriverLateInit` don't re-run, and in-memory state survives:
   the same rules as [`sync`](/cli/sync). A file that fails to compile is
   reported, and the previous code keeps running.
6. **Ctrl+C ends the session.** The stub stays on the controller, inert, until
   you run [`driverforge deploy`](/cli/deploy).

## Attaching a debugger

Your driver runs in an ordinary Lua process, so any Lua 5.1 debugger that can
attach to one will work.

**ZeroBrane Studio, or anything that speaks mobdebug.** Start the debugger
server in your IDE, then:

```bash
luarocks install mobdebug
driverforge debug --mobdebug localhost:8172
```

**VS Code.** Point `--lua` at the debugger-aware interpreter or launcher your
extension provides. The local process talks to the CLI over stdin and stdout,
so your debugger has to use a socket of its own rather than stdio.

## Options

| Option                  | Description                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `--device`              | Controller to debug on (name, hostname, or id); overrides the selected one                  |
| `--select`              | Re-select the target controller first                                                        |
| `--configuration`, `-c` | Build configuration to debug; also selects `config.<name>.lua` in the local process          |
| `--lua`                 | Lua 5.1 interpreter to run your driver with (default: `lua5.1`, `luajit` or `lua` on `PATH`) |
| `--mobdebug`            | Start mobdebug in the local process and connect it to your IDE at `host:port`                |
| `--no-reload`           | Don't reload your driver when source files change                                            |

## Examples

Debug on the selected controller:

```bash
driverforge debug
```

Debug the `release` configuration on a specific controller, showing every `C4`
call as it happens:

```bash
driverforge debug -c release --device "Plant Room" --verbose
```

Debug under ZeroBrane Studio:

```bash
driverforge debug --mobdebug localhost:8172
```

## What's different from running on the controller

Your code is real and so is the controller, but there's a network between them.
A few things behave differently because of that:

- **Callbacks don't wait for your answer.** The controller hands a callback over
  and carries on. A handler whose return value the controller uses
  (`UIRequest`, `GetPrivateKeyPassword`, the `List*` family) still runs, but the
  controller sees `nil`.
- **Every `C4:*` call is a round trip.** Each one travels to the controller and
  back through the broker, so timing-sensitive code won't behave the way it does
  in production.
- **State starts fresh.** Swapping the stub in reloads the driver, so anything it
  held in memory is gone. `Properties` and `PersistData` are copied to your local
  process on every callback, but writes to `PersistData` aren't saved during a
  session.
- **Timers, URL requests and other controller objects work.** Callbacks you pass
  to `C4:SetTimer` or `C4:url():OnDone` fire in your local code, and objects the
  controller returns can be used and cancelled as usual.
- **Anvil reports from the stub, not your SDK.** The stub is instrumented, so the
  console shows one event per callback and every error your handlers raise. Your
  driver's own Anvil SDK stays quiet for the session.
- **One session per driver.** If a colleague is already debugging the same
  driver on the same controller, starting a second session replaces their stub.

## Troubleshooting

- **"Your sign-in has expired, so the debug session can't start"**: run
  `driverforge login`, then `driverforge debug` again. A session needs a current
  sign-in to connect, and yours has expired or been revoked.
- **"Couldn't reach Driverforge to start the debug session"**: your machine
  couldn't reach Driverforge to set the session up. Check your connection and
  try again; there's no need to sign in again.
- **"no Lua 5.1 interpreter found"**: install one (`brew install luajit`) or
  point `--lua` at one you already have.
- **Nothing arrives after "Debug session active"**: the stub reaches the broker
  from the controller, so the controller needs outbound access to
  `ingest.driverforge.com:8883`, the same route the Anvil Agent uses. Check the
  agent's connectivity in the console.
- **You quit without deploying**: the stub is still installed, and does nothing.
  Run [`driverforge deploy`](/cli/deploy) whenever you're ready; the next
  `debug` replaces it too.

## Global flags

Every `driverforge` command also accepts these global flags: `--verbose`/`-v`, `--project-dir`, `--no-tui`, `--no-update-check`, and `--help`/`-h`. See the [overview](/cli/overview#global-flags) for details.
