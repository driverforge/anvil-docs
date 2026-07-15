---
sidebar_position: 4
description: Build and ship Control4 drivers from a GitLab CI/CD pipeline with the driverforge CLI.
---

# GitLab CI/CD

There's no dedicated GitLab integration (yet) — but `driverforge` is a
self-contained native binary, so running it in a GitLab pipeline is a short
`before_script`: download a pinned release, verify its checksum, put it on
`PATH`. The template below is the same install the
[GitHub Action](/cicd/github-actions) and [Buildkite plugin](/cicd/buildkite)
perform, written out as plain `.gitlab-ci.yml`.

:::tip Want a first-class GitLab component?
Tell us — vote for it on our [roadmap](https://driverforge.canny.io) and we'll
prioritise accordingly.
:::

## Template

Copy this into `.gitlab-ci.yml` at the root of your driver repository:

```yaml
variables:
  DRIVERFORGE_VERSION: '%%CLI_VERSION%%' # pin — a new release shouldn't change your build unannounced

.install-driverforge:
  image: alpine:3.20
  # Cache the binary per version so repeat pipelines don't re-download.
  cache:
    key: driverforge-$DRIVERFORGE_VERSION
    paths:
      - .driverforge/
  before_script:
    - apk add --no-cache curl
    - |
      if [ ! -x .driverforge/driverforge ]; then
        base="https://releases.driverforge.com/driverforge-releases/driverforge-cli/v${DRIVERFORGE_VERSION}"
        archive="driverforge_${DRIVERFORGE_VERSION}_linux_amd64.tar.gz"
        mkdir -p .driverforge
        curl -fsSL -o ".driverforge/${archive}" "${base}/${archive}"
        curl -fsSL -o .driverforge/checksums.txt "${base}/checksums.txt"
        (cd .driverforge && grep " ${archive}$" checksums.txt | sha256sum -c -)
        tar -xzf ".driverforge/${archive}" -C .driverforge driverforge
        rm ".driverforge/${archive}" .driverforge/checksums.txt
      fi
    - export PATH="$PWD/.driverforge:$PATH"
    - driverforge --version

build-driver:
  extends: .install-driverforge
  script:
    - driverforge build --configuration release
  artifacts:
    paths:
      - dist/*.c4z
```

Every push builds the driver and collects the `.c4z` as a job artifact. The
checksum line fails the job if the download doesn't match the published
`checksums.txt`, exactly like the other integrations.

## Release builds on tags

For a tagged release that owns the exact driver version, stamps it, encrypts,
and ships the artifact under the plain driver name (no `-release` suffix), add
a second job reusing the same install:

```yaml
release-driver:
  extends: .install-driverforge
  rules:
    - if: $CI_COMMIT_TAG
  script:
    # e.g. tag v1.2.0 -> <version> 120
    - driverforge build -c release --encrypt --no-suffix --version "$(echo "$CI_COMMIT_TAG" | tr -d 'v.')"
  artifacts:
    paths:
      - dist/*.c4z
```

`--version` is mutually exclusive with `--increment`; see
[Versioning](/cli/versioning) for the schemes and
[Build configuration](/cli/build-configuration) for per-configuration
defaults (`encrypt`/`suffix` in `.driverforge/config.json`), which let the
release job shrink to `driverforge build -c release --version …`.

## Notes

- **Pin the version.** `DRIVERFORGE_VERSION` names an immutable release path.
  A `latest/manifest.json` pointer exists if you must track the newest release,
  but a pinned version keeps builds reproducible.
- **Architecture**: the template downloads `linux_amd64`, which matches
  GitLab.com shared runners. On self-hosted arm64 runners swap in
  `linux_arm64`; darwin archives exist for macOS runners too.
- **Driver not at the repo root?** Pass `--project-dir path/to/driver` to
  `driverforge build` — see [`driverforge build`](/cli/build) for the full
  option list.
- **Shipping** (`driverforge deploy` / `driverforge sync`) needs network reach to the
  target controller, which hosted CI runners won't have — those commands are
  for [dev-loop use](/cli/deploy), not pipelines.
