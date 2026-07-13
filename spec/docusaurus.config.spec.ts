describe('docusaurus.config.ts', () => {
  const originalUmamiId = process.env.UMAMI_WEBSITE_ID;

  afterEach(() => {
    if (originalUmamiId === undefined) delete process.env.UMAMI_WEBSITE_ID;
    else process.env.UMAMI_WEBSITE_ID = originalUmamiId;
    jest.resetModules();
  });

  const loadConfig = () => {
    let config: typeof import('../docusaurus.config').default;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      config = require('../docusaurus.config').default;
    });
    return config!;
  };

  it('keeps the Umami script consent-blocked (text/plain + data-src)', () => {
    process.env.UMAMI_WEBSITE_ID = 'test-website-id';
    const config = loadConfig();

    const scripts = (config.headTags ?? []) as Array<{
      tagName: string;
      attributes: Record<string, string>;
    }>;
    const umami = scripts.find((t) => t.attributes['data-src'] === '/api/sc/um/script.js');

    expect(umami).toBeDefined();
    expect(umami!.attributes.type).toBe('text/plain');
    expect(umami!.attributes['data-category']).toBe('analytics');
    // An executable `src` would bypass consent entirely.
    expect(umami!.attributes.src).toBeUndefined();
  });

  it('emits no Umami script when UMAMI_WEBSITE_ID is unset', () => {
    delete process.env.UMAMI_WEBSITE_ID;
    const config = loadConfig();

    const scripts = (config.headTags ?? []) as Array<{
      tagName: string;
      attributes: Record<string, string>;
    }>;
    expect(
      scripts.find((t) => t.attributes?.['data-src'] === '/api/sc/um/script.js')
    ).toBeUndefined();
  });

  it('offers a cookie preferences trigger in the footer legal links', () => {
    const config = loadConfig();
    const footer = (config.themeConfig as { footer: { links: Array<{ title: string; items: Array<Record<string, string>> }> } }).footer;
    const legal = footer.links.find((l) => l.title === 'Legal');

    expect(legal).toBeDefined();
    const trigger = legal!.items.find((i) => i.html?.includes('data-cc="show-preferencesModal"'));
    expect(trigger).toBeDefined();
  });
});
