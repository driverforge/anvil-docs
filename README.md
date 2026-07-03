# Anvil Documentation

Source for the Anvil documentation site — **<https://docs.driverforge.dev>**.

Anvil is the observability platform for Control4 drivers by [Driverforge](https://driverforge.com): capture errors (with full stack traces), event timings, and logs from your driver and see what Control4 is sending it. These docs cover installing and using the SDK, the agent, the CLI, and the platform.

This repository is the **docs source**, published as a public mirror of Driverforge's private monorepo (see [Contributing](#contributing)). It's built with [Docusaurus](https://docusaurus.io/).

## Repository layout

| Path                   |                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/`                | the documentation content (Markdown/MDX), grouped by section — `getting-started/`, `platform/`, `sdk/`, `agent/`, `cli/`, `reference/` |
| `src/`                 | custom Docusaurus theming and a few React components (e.g. API-key-aware code samples)                                                 |
| `static/`              | static assets served as-is (images, favicon)                                                                                           |
| `docusaurus.config.ts` | site config — navbar, footer, plugins                                                                                                  |
| `sidebars.ts`          | sidebar / navigation structure                                                                                                         |

## Development

The site is a standard Docusaurus app:

```sh
yarn          # install dependencies
yarn start    # start the dev server with live reload
yarn build    # build the static site into build/
```

> **Note:** this repository is mirrored out of a larger monorepo, so a standalone checkout may not build without upstream tooling config. For small documentation edits you don't need a local build — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). Third-party dependencies are listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Contributing

Documentation fixes and improvements are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Note that accepted PRs are imported into our private monorepo and synced back, so they show as _closed_ (not merged) with your authorship preserved; CONTRIBUTING explains why.

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). To report a security issue, see [SECURITY.md](SECURITY.md).
