---
sidebar_position: 6
---

# Error reporting

When something goes wrong, the CLI distinguishes a condition it *expected* from a
genuine *bug*, and treats them differently.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## Expected conditions

Things like "you're not logged in", "this isn't a driver project", "no controller
selected", or "the Anvil Agent is unreachable" are expected. The CLI shows a
short, friendly card explaining what happened and how to fix it, and **never**
reports them anywhere.

## Unexpected errors

If the CLI hits something it didn't anticipate, it shows a crash card and **offers
to send an error report** so we can fix it. Reporting is **opt-in, per error** —
you're asked each time, and nothing is sent unless you agree.

A report contains the command you ran, which flags were set (their names only, not
their values), and the error itself — **never your source code or file contents**.

## Turning it off

Error reporting is off automatically in CI and non-interactive shells. To disable
it everywhere, set any of:

- `ANVIL_NO_ERROR_REPORTING=1`
- `DO_NOT_TRACK=1`
- `ANVIL_NO_METRICS=1`

See also [Telemetry](/cli/telemetry) for anonymous usage metrics, which are
separate and likewise opt-in.
