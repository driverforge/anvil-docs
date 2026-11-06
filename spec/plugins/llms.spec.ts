const order: string[] = [];
const innerPostBuild = jest.fn(async () => {
  order.push('llms');
});
const finishLlmsOutput = jest.fn(async () => {
  order.push('finish');
});
const finishLlmsFiles = jest.fn(async () => {
  order.push('finish');
  return [];
});
const createLlmsPlugin = jest.fn((_context: { outDir: string }) => ({
  name: 'docusaurus-plugin-llms',
  postBuild: innerPostBuild,
}));

jest.mock('docusaurus-plugin-llms', () => ({ default: createLlmsPlugin }));
jest.mock('../../src/lib/llmsOutput', () => ({ finishLlmsOutput, finishLlmsFiles }));
jest.mock('../../src/lib/cliVersion', () => ({ cliVersion: async () => '1.2.3' }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const llmsPlugin = require('../../src/plugins/llms').default;

describe('llms.ts', () => {
  const context = { outDir: '/build', generatedFilesDir: '/site/.docusaurus' };
  const props = {
    outDir: '/build',
    siteConfig: { url: 'https://docs.driverforge.com' },
    plugins: [
      { name: 'docusaurus-plugin-llms', content: undefined },
      {
        name: 'docusaurus-plugin-content-docs',
        content: {
          loadedVersions: [{ docs: [{ permalink: '/' }, { permalink: '/cli/init/' }] }],
        },
      },
    ],
  };

  beforeEach(() => {
    order.length = 0;
    jest.clearAllMocks();
  });

  it('finishes the output only after docusaurus-plugin-llms has written it', async () => {
    await llmsPlugin(context, {}).postBuild(props);

    expect(order).toEqual(['llms', 'finish']);
  });

  it("checks every doc page and stamps this build's CLI version", async () => {
    await llmsPlugin(context, {}).postBuild(props);

    expect(finishLlmsOutput).toHaveBeenCalledWith({
      outDir: '/build',
      siteUrl: 'https://docs.driverforge.com',
      docPermalinks: ['/', '/cli/init/'],
      cliVersion: '1.2.3',
    });
  });

  it('keeps the wrapped plugin\'s name', () => {
    expect(llmsPlugin(context, {}).name).toBe('docusaurus-plugin-llms');
  });

  describe('under docusaurus start', () => {
    const allContent = {
      'docusaurus-plugin-content-docs': {
        default: { loadedVersions: [{ docs: [{ permalink: '/cli/init/' }] }] },
      },
    };
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('writes and finishes the Markdown into .docusaurus/llms each time content loads', async () => {
      process.env.NODE_ENV = 'development';
      await llmsPlugin(context, {}).allContentLoaded({ allContent });

      expect(createLlmsPlugin).toHaveBeenLastCalledWith(
        expect.objectContaining({ outDir: '/site/.docusaurus/llms' }),
        {},
      );
      expect(order).toEqual(['llms', 'finish']);
      expect(finishLlmsFiles).toHaveBeenCalledWith({
        outDir: '/site/.docusaurus/llms',
        docPermalinks: ['/cli/init/'],
        cliVersion: '1.2.3',
      });
    });

    it('serves that directory from the dev server', () => {
      process.env.NODE_ENV = 'development';

      expect(llmsPlugin(context, {}).configureWebpack()).toEqual({
        devServer: { static: [{ directory: '/site/.docusaurus/llms', publicPath: '/' }] },
      });
    });

    it('does neither in a production build, where postBuild writes the real files', async () => {
      process.env.NODE_ENV = 'production';
      const plugin = llmsPlugin(context, {});
      await plugin.allContentLoaded({ allContent });

      expect(innerPostBuild).not.toHaveBeenCalled();
      expect(plugin.configureWebpack()).toEqual({});
    });
  });
});
