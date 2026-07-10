---
sidebar_position: 8
---

# Telemetry

The CLI can collect **anonymous usage metrics** to help us improve it. It's
opt-in: on first interactive launch, `driverforge` asks once whether you'd like to share
them.

:::info Preview
The `driverforge` CLI is in **preview**. Commands and flags documented here may change
before the stable release. Follow along or share feedback on our
[roadmap](https://driverforge.canny.io).
:::

## What's collected

If you opt in, the CLI records things like which commands you run, build timings,
and errors, tagged with a random anonymous id. **No source code, file contents, or
personal data is ever sent.**

## Opting out

You can change your mind anytime by setting `DO_NOT_TRACK=1` (or
`ANVIL_NO_METRICS=1`). Telemetry is also off automatically in CI and in
non-interactive shells, where the consent prompt never appears.

See also [Error reporting](/cli/error-reporting), which is separate and asks
before sending each crash report.
