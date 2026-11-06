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

  it('gives every headTag an attributes object (Docusaurus schema requires it)', () => {
    // Docusaurus validates headTags with Joi at build time and rejects any
    // entry missing `attributes` — the HtmlTagObject *type* marks it optional,
    // so only this (and the real build) catches it.
    process.env.GA_MEASUREMENT_ID = 'G-TEST123';
    const config = loadConfig();

    for (const tag of (config.headTags ?? []) as HeadTag[]) {
      expect(tag.attributes).toBeDefined();
    }
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

  it('advertises llms.txt to agents reading any page', () => {
    const config = loadConfig();

    const link = ((config.headTags ?? []) as HeadTag[]).find((t) => t.tagName === 'link');
    expect(link?.attributes).toEqual({ rel: 'alternate', type: 'text/markdown', href: '/llms.txt' });
  });

  it("gives the llms plugin the docs' real route base, so the root page links to /index.md", () => {
    // A bare docsDir: 'docs' made the plugin assume /docs/ and link the root
    // page (slug: /) to https://docs.driverforge.com/docs, a 404.
    const config = loadConfig();
    const presetDocs = (config.presets![0] as [string, { docs: { routeBasePath: string } }])[1].docs;
    const llms = (config.plugins as unknown[]).find(
      (p) => Array.isArray(p) && (p[1] as { generateMarkdownFiles?: boolean })?.generateMarkdownFiles,
    ) as [unknown, { docsDir: { path: string; routeBasePath: string }[] }];

    expect(llms[1].docsDir).toEqual([{ path: 'docs', routeBasePath: presetDocs.routeBasePath }]);
  });
});
