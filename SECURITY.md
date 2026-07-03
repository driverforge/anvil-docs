# Security Policy

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue.

- **Preferred:** GitHub's [private vulnerability reporting](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on this repository (**Security → Report a vulnerability**).
- **Or** email **oss@driverforge.com**.

Please include a description, reproduction steps, and the affected page or component where you can. We'll acknowledge your report and keep you posted on the fix.

## Scope

This policy covers the **Anvil documentation site** in this repository — the Markdown content and the small amount of client-side code (custom Docusaurus components) that render at <https://docs.driverforge.dev>. The docs site ships **no credentials of its own**; the only secret it ever handles is the reader's own Anvil API key, entered client-side to personalise code samples and sent only to the reader's own Anvil app. The Anvil backend, ingestion, agent, and SDK are separate projects and out of scope here.

If you've found a vulnerability in the Anvil platform itself (not the docs), please report it against the relevant project or email the address above.

## Supported versions

The site deploys continuously — please confirm the issue against the live site or the current `main` before reporting.
