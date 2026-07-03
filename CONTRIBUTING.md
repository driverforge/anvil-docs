# Contributing

Thanks for helping improve the Anvil documentation! Contributions are welcome under the project's [MIT license](LICENSE).

## How this repository works

This repository is a **public mirror**. The documentation is developed in a private monorepo alongside other closed-source Driverforge code and synced here automatically with [Copybara](https://github.com/google/copybara). Your workflow is the normal GitHub one — open issues and pull requests here as usual.

## Why your merged PR shows as "closed", not "merged"

When we accept your change it will show as **closed** (red), not **merged** (purple). That's expected, not a rejection: we import your PR into our private monorepo, review and build it there, and merge it internally. The change is then synced back out to this repo, and GitHub closes the original PR.

**Your authorship is preserved** — your commits appear here with you as the author, so they still show on your GitHub profile.

**How to tell an accepted PR from a declined one:** when your change lands, our bot labels the PR **`accepted`** and comments with a link to the commit where it landed in this repo. A closed PR _without_ that label was declined — and we'll say why.

## Contributor License Agreement

Contributions require agreeing to our Contributor License Agreement: you keep the copyright to your contribution and grant Driverforge — and its successors and assigns — a licence to use and relicense it. A CLA check runs on your pull request.

**AI assistance is welcome.** However your contribution was produced, you're responsible for it: it must be yours to give, and you must have the right to contribute it under this licence (for example, it must not carry in incompatibly-licensed content). We don't require AI use to be disclosed or attributed — your responsibility for the contribution is the same either way.

## What lives here

The documentation content is Markdown/MDX under [`docs/`](docs/), organised into sections (getting started, platform, SDK, agent, CLI, reference). The site itself is built with [Docusaurus](https://docusaurus.io/); `docusaurus.config.ts` and `sidebars.ts` control navigation, and `src/` holds a handful of custom React components.

For most contributions — fixing a typo, clarifying a step, adding an example — you only need to edit the relevant Markdown file under `docs/`.

## Building locally

This site is mirrored out of a larger monorepo, so a checkout of **this** repository on its own may not `install` and `build` standalone yet (some tooling config lives upstream). For small documentation edits you don't need a local build — a maintainer builds and previews your change when importing it, and the rendered result deploys from the private pipeline.

If you do want a local preview, the site is a standard Docusaurus app:

```sh
yarn
yarn start
```

If the standalone build can't resolve upstream config, note it in your PR and we'll preview it on import.

## Commit, issue & PR conventions

### Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <subject> (#<issue-or-pr>)
```

e.g. `docs: clarify the API key setup step (#42)`.

- **Types:** `docs` (content changes — most doc PRs), `fix` (broken links, build breaks), `feat` (new pages/sections), `refactor`, `tweak` (a small change), `chore` (deps / no-op).
- Use the **imperative mood** — "add", not "added".
- Reference the related GitHub issue/PR number in parentheses; it can be left out until the PR is opened.
- Keep commits small and logical, with messages that say what changed and why.

### Issues

For anything beyond a trivial fix, please open an issue first describing the problem or the improvement and who it helps — it's the best place to agree on scope before writing content. For inaccuracies, link the affected page and describe what's wrong.

### Pull requests

- Title the PR in the same format as a commit (e.g. `docs: fix the quick-start install command`).
- Keep it small and focused; for larger restructures, open an issue first.
- Check that internal links resolve and that any code samples are correct.

Because this repo is a public mirror, **we don't merge PRs on GitHub directly** — a maintainer imports your change into our private monorepo and it syncs back here (your PR then shows as _closed_, with your authorship preserved — see above). So there's no squash-vs-merge choice for you to make and no release branches to target: just open your PR against the default branch.
