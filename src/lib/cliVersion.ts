// The driverforge CLI version shown in docs examples. Doc sources write the
// %%CLI_VERSION%% token; the remark plugin below substitutes the current
// release at build time, so example pins track releases without hand-bumping
// every page (the token appears wherever a pinned version is shown — the
// CI/CD templates and input tables).

export const CLI_VERSION_TOKEN = '%%CLI_VERSION%%';

// Known-good release, used when the release channel can't be reached
// (offline builds) or returns something unexpected.
export const CLI_VERSION_FALLBACK = '0.1.0';

const LATEST_MANIFEST_URL =
  'https://releases.driverforge.com/driverforge-releases/driverforge-cli/latest/manifest.json';

const SEMVER = /^\d+\.\d+\.\d+$/;

// Resolution order: DRIVERFORGE_CLI_VERSION env override (reproducible or
// offline builds, tests) → the latest release manifest → the fallback.
export async function resolveCliVersion(
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const override = process.env.DRIVERFORGE_CLI_VERSION;
  if (override) return override;

  try {
    const res = await fetchImpl(LATEST_MANIFEST_URL, {
      signal: AbortSignal.timeout?.(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manifest = (await res.json()) as { version?: unknown };
    if (
      typeof manifest.version !== 'string' ||
      !SEMVER.test(manifest.version)
    ) {
      throw new Error(`unexpected version ${JSON.stringify(manifest.version)}`);
    }
    return manifest.version;
  } catch (err) {
    console.warn(
      `[anvil-docs] could not resolve the latest CLI version (${err}); using fallback ${CLI_VERSION_FALLBACK}`,
    );
    return CLI_VERSION_FALLBACK;
  }
}

type MdastNode = { value?: unknown; children?: MdastNode[] };

let cachedVersion: Promise<string> | undefined;

// Tests only: clear the once-per-build memo.
export function resetCliVersionCache(): void {
  cachedVersion = undefined;
}

// Remark plugin. The transformer is async (unified awaits it) and the version
// fetch is memoised, so a build resolves the version once — not once per page.
// Substitutes the token wherever it appears: code blocks, inline code, prose.
export function cliVersionRemark(fetchImpl: typeof fetch = fetch) {
  return async (tree: MdastNode): Promise<void> => {
    const version = await (cachedVersion ??= resolveCliVersion(fetchImpl));
    const substitute = (node: MdastNode): void => {
      if (
        typeof node.value === 'string' &&
        node.value.includes(CLI_VERSION_TOKEN)
      ) {
        node.value = node.value.split(CLI_VERSION_TOKEN).join(version);
      }
      node.children?.forEach(substitute);
    };
    substitute(tree);
  };
}
