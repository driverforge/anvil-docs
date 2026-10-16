---
sidebar_position: 10
---

# debug

Run your driver's Lua on your own machine while a real controller drives it.
Set breakpoints in your IDE, inspect variables, step through handlers, and
save a file to run the new code on the next event. No rebuild, no redeploy.

```bash
driverforge debug
```

:::note Beta
Live debugging is new. It works with controllers running the Anvil agent and
needs a Lua 5.1 interpreter on your machine (`brew install lua@5.1`, or
LuaJIT). If something doesn't behave as described here, tell us.
:::

## How it works

`driverforge debug` temporarily swaps your driver on the controller for a
small **stub** that ships inside the CLI. The stub has no business logic: it
forwards every callback the controller makes (`OnDriverInit`,
`ReceivedFromProxy`, `OnPropertyChanged`, `OnTimerExpired`, …) over Anvil's
messaging broker to a local Lua process running your source, and it executes
the `C4:*` calls your code makes against the real controller, returning the
real results.

Both the stub and the CLI connect **outbound** to the broker, so your machine
never needs a route to the controller once the stub is deployed. It works
across VLANs and through customer firewalls.

```
driverforge debug            # stub replaces your driver, local Lua starts
# edit, save, trigger events, hit breakpoints …
Ctrl+C                       # session ends
driverforge deploy           # your real driver goes back
```

## A session, step by step

1. The CLI loads your driver in a local Lua process. A driver that fails to
   load stops here, before the controller is touched.
2. It builds your project exactly as `deploy` does, then replaces the script
   inside the `.c4z` with the stub. `driver.xml` is byte-identical, so the
   stub keeps your bindings, proxies and properties.
3. The stub is deployed through the agent, like any `deploy`.
4. Every callback from the controller now runs your local code. `print`
   output appears in the terminal; `-v` also shows each `C4` call and result.
5. Save a file and the driver is **reloaded in place**: handler functions are
   redefined, `OnDriverInit`/`OnDriverLateInit` do not re-run, and in-memory
   state survives — the same semantics as [`driverforge sync`](/cli/sync). A
   file that fails to compile is reported and the previous code keeps running.
6. Ctrl+C ends the session. The stub stays on the controller, inert, until
   you run [`driverforge deploy`](/cli/deploy).

## Attaching a debugger

The driver runs in an ordinary Lua process, so any Lua 5.1 debugger that can
attach to one works.

**ZeroBrane Studio / mobdebug** — start the debugger server in your IDE, then:

```bash
luarocks install mobdebug
driverforge debug --mobdebug localhost:8172
```

**VS Code** — use `--lua` to run the driver under a debugger-aware
interpreter or wrapper your extension provides, for example a `lua` launcher
that enables its debug hook. The process reads JSON lines on stdin and writes
them on stdout; your debugger must use its own socket, not stdio.

## Options

| Flag | Meaning |
| --- | --- |
| `-c, --configuration <name>` | Build configuration to debug; selects `config.<name>.lua` locally too |
| `--device <name>` | Controller to use (name, hostname or id) |
| `--select` | Pick the controller again first |
| `--lua <path>` | Interpreter for the local process (default: `lua5.1`, `luajit` or `lua` on `PATH`; or `DRIVERFORGE_LUA`) |
| `--mobdebug <host:port>` | Start mobdebug in the local process and connect it to your IDE |
| `--no-reload` | Don't reload on file changes |
| `-v` | Show every `C4` call and its result |

## What to expect, and what not to

- **Callbacks are one-way.** The controller does not wait for your code. A
  handler whose return value the controller consumes (`UIRequest`,
  `GetPrivateKeyPassword`, the `List*` family) runs for its side effects
  only; the controller sees `nil`.
- **C4 calls are real, and each one is a round trip** to the controller
  through the broker. Timing-sensitive code behaves differently than in
  production.
- **State starts fresh.** Swapping the stub in reloads the driver, so
  anything your driver kept in memory is gone. `Properties` and
  `PersistData` are mirrored into the local process on every callback, but
  writes to `PersistData` are not persisted during a session.
- **Timers, URL requests and other controller objects work.** Callbacks you
  pass to `C4:SetTimer` or `C4:url():OnDone` fire in your local code; objects
  the controller returns can be used and cancelled as usual.
- **Your driver's own Anvil SDK stays quiet.** The stub is instrumented, so
  the console shows one event per callback and every error your handlers
  raise. Logs from the stub itself appear there too.
- **One session per driver.** If a colleague is already debugging the same
  driver on the same controller, the second session replaces the first stub.

## Troubleshooting

**"your sign-in predates live debugging"** — run `driverforge login` again;
live debugging needs a broker credential your earlier login didn't request.

**"no Lua 5.1 interpreter found"** — install one (`brew install lua@5.1`) or
pass `--lua`.

**Nothing arrives after "Debug session active"** — the stub connects to the
broker from the controller, which needs outbound access to
`ingest.driverforge.com:8883`, the same route the Anvil agent uses. Check the
agent's connectivity in the console.

**I quit without `deploy`** — the stub is still installed, inert. Run
`driverforge deploy` whenever you're ready; the next `debug` replaces it too.
