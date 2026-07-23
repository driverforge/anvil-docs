---
sidebar_position: 10
---

# debug

Run your driver locally with full IDE debugger support — set breakpoints, step
through code as it executes, and inspect variables in real time.

:::info Coming soon
`driverforge debug` isn't available yet. Follow along or vote for it on our
[roadmap](https://driverforge.canny.io).

For a fast edit-build-test loop **today**, use [`driverforge sync`](/cli/sync): it
hot-swaps your driver's Lua into the running instance on a controller without a
full reload, so changes take effect in seconds.
:::

{/* TODO(canny): confirm the exact Canny board link for driverforge debug */}

## Where it's headed

The plan is to connect your local source to a running driver instance so you can:

- **Set breakpoints** in your IDE and step through code as it runs on the
  controller
- **Inspect variables** and call stacks in real time
- **Edit locally** and see changes take effect without rebuilding
- **See errors immediately** with source-mapped stack traces

We'll document IDE setup and the exact workflow here once the command ships. In
the meantime, [`driverforge sync`](/cli/sync) covers the fast-iteration case and
[source maps](/cli/source-maps) give you readable stack traces in your
[error reports](/platform/errors).
