import {
  CLI_VERSION_FALLBACK,
  CLI_VERSION_TOKEN,
  cliVersionRemark,
  resetCliVersionCache,
  resolveCliVersion,
} from '../../src/lib/cliVersion';

describe('cliVersion.ts', () => {
  const originalOverride = process.env.DRIVERFORGE_CLI_VERSION;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    delete process.env.DRIVERFORGE_CLI_VERSION;
    resetCliVersionCache();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (originalOverride === undefined) delete process.env.DRIVERFORGE_CLI_VERSION;
    else process.env.DRIVERFORGE_CLI_VERSION = originalOverride;
    resetCliVersionCache();
    warnSpy.mockRestore();
  });

  const fetchReturning = (version: unknown) =>
    jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ version }),
    }) as unknown as typeof fetch;

  describe('resolveCliVersion', () => {
    it('returns the version from the latest release manifest', async () => {
      await expect(resolveCliVersion(fetchReturning('9.9.9'))).resolves.toBe('9.9.9');
    });

    it('prefers the DRIVERFORGE_CLI_VERSION override without fetching', async () => {
      process.env.DRIVERFORGE_CLI_VERSION = '1.2.3';
      const fetchImpl = jest.fn() as unknown as typeof fetch;
      await expect(resolveCliVersion(fetchImpl)).resolves.toBe('1.2.3');
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('falls back when the fetch rejects', async () => {
      const fetchImpl = jest
        .fn()
        .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
      await expect(resolveCliVersion(fetchImpl)).resolves.toBe(CLI_VERSION_FALLBACK);
      expect(warnSpy).toHaveBeenCalled();
    });

    it('falls back on a non-OK response', async () => {
      const fetchImpl = jest
        .fn()
        .mockResolvedValue({ ok: false, status: 404 }) as unknown as typeof fetch;
      await expect(resolveCliVersion(fetchImpl)).resolves.toBe(CLI_VERSION_FALLBACK);
    });

    it('falls back when the manifest version is not semver', async () => {
      await expect(resolveCliVersion(fetchReturning('latest'))).resolves.toBe(
        CLI_VERSION_FALLBACK,
      );
      await expect(resolveCliVersion(fetchReturning(undefined))).resolves.toBe(
        CLI_VERSION_FALLBACK,
      );
    });
  });

  describe('cliVersionRemark', () => {
    const makeTree = () => ({
      children: [
        { value: `version: '${CLI_VERSION_TOKEN}' # pinned` },
        { children: [{ value: CLI_VERSION_TOKEN }] },
        { value: 'no token here' },
      ],
    });

    it('substitutes the token in top-level and nested nodes', async () => {
      const tree = makeTree();
      await cliVersionRemark(fetchReturning('9.9.9'))(tree);

      expect(tree.children[0].value).toBe("version: '9.9.9' # pinned");
      expect(tree.children[1].children![0].value).toBe('9.9.9');
      expect(tree.children[2].value).toBe('no token here');
    });

    it('replaces every occurrence within one node', async () => {
      const tree = {
        children: [{ value: `${CLI_VERSION_TOKEN} and ${CLI_VERSION_TOKEN}` }],
      };
      await cliVersionRemark(fetchReturning('9.9.9'))(tree);
      expect(tree.children[0].value).toBe('9.9.9 and 9.9.9');
    });

    it('resolves the version once across documents', async () => {
      const fetchImpl = fetchReturning('9.9.9');
      const transform = cliVersionRemark(fetchImpl);
      await transform(makeTree());
      await transform(makeTree());
      expect(fetchImpl).toHaveBeenCalledTimes(1);
    });
  });
});
