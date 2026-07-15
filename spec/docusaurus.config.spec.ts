describe('docusaurus.config.ts', () => {
  const originalGaId = process.env.GA_MEASUREMENT_ID;

  afterEach(() => {
    if (originalGaId === undefined) delete process.env.GA_MEASUREMENT_ID;
    else process.env.GA_MEASUREMENT_ID = originalGaId;
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

  type HeadTag = {
    tagName: string;
    attributes?: Record<string, string>;
    innerHTML?: string;
  };

  it('keeps the GA loader consent-blocked (text/plain + data-src)', () => {
    process.env.GA_MEASUREMENT_ID = 'G-TEST123';
    const config = loadConfig();

    const scripts = (config.headTags ?? []) as HeadTag[];
    const loader = scripts.find(
      (t) => t.attributes?.['data-src'] === '/gt/?id=G-TEST123',
    );

    expect(loader).toBeDefined();
    expect(loader!.attributes!.type).toBe('text/plain');
    expect(loader!.attributes!['data-category']).toBe('analytics');
    // An executable `src` would bypass consent entirely.
    expect(loader!.attributes!.src).toBeUndefined();
  });

  it('emits a live gtag bootstrap that only queues into dataLayer', () => {
    process.env.GA_MEASUREMENT_ID = 'G-TEST123';
    const config = loadConfig();

    const scripts = (config.headTags ?? []) as HeadTag[];
    const bootstrap = scripts.find((t) => t.innerHTML?.includes('window.dataLayer'));

    expect(bootstrap).toBeDefined();
    expect(bootstrap!.innerHTML).toContain("gtag('config', 'G-TEST123');");
    // The bootstrap must not load anything itself — the gated loader does.
    expect(bootstrap!.attributes?.src).toBeUndefined();
    expect(bootstrap!.attributes?.['data-src']).toBeUndefined();
  });

  it('emits no GA tags when GA_MEASUREMENT_ID is unset', () => {
    delete process.env.GA_MEASUREMENT_ID;
    const config = loadConfig();

    const scripts = (config.headTags ?? []) as HeadTag[];
    expect(scripts.find((t) => t.attributes?.['data-src']?.startsWith('/gt/'))).toBeUndefined();
    expect(scripts.find((t) => t.innerHTML?.includes('window.dataLayer'))).toBeUndefined();
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
