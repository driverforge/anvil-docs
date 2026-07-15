import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {cliVersionRemark} from './src/lib/cliVersion';

// Load .env at config-load time so values are available for fields like
// the navbar href below. docusaurus-plugin-dotenv (registered under
// `plugins`) only replaces references in the client bundle at build time
// via webpack — it does not populate process.env for the config file
// itself. Kept non-fatal so production Docker builds (which set APP_URL
// via an ENV) and fresh checkouts without a .env file both work.
try {
  process.loadEnvFile('.env');
} catch {
  // No .env file — rely on process.env / defaults.
}

const gaMeasurementId = process.env.GA_MEASUREMENT_ID;

const config: Config = {
  title: 'Anvil Documentation',
  tagline: 'See what Control4 is sending your driver',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.driverforge.dev',
  baseUrl: '/',

  // Emit trailing-slash URLs so the sitemap + links match what the host serves
  // 200 (it 301-redirects no-slash -> slash). Without this the Algolia DocSearch
  // crawler hits redirects it won't follow and ignores every deep page.
  trailingSlash: true,

  organizationName: 'driverforge',
  projectName: 'anvil-docs',

  onBrokenLinks: 'throw',

  markdown: {
    preprocessor: undefined,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      'docusaurus-plugin-dotenv',
      {
        // Load local overrides from `.env` (gitignored). Docker production
        // builds set APP_URL via an ENV so `systemvars: true` picks it up
        // even without a file present.
        path: './.env',
        systemvars: true,
      },
    ],
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: 'docs',
        title: 'Anvil Documentation',
        description:
          'Documentation for Anvil, the observability platform for Control4 drivers by Driverforge',
        excludeImports: true,
        removeDuplicateHeadings: true,
        includeOrder: [
          'getting-started/*',
          'platform/*',
          'sdk/*',
          'agent/*',
          'cli/*',
          'reference/*',
        ],
        includeUnmatchedLast: true,
        pathTransformation: {
          ignorePaths: ['docs'],
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // "Edit this page" -> the public mirror (driverforge/anvil-docs), where
          // the docs live at docs/ (the apps/anvil-docs/ prefix is stripped on
          // sync). Docusaurus appends the source path (docs/<file>) to this base.
          editUrl: 'https://github.com/driverforge/anvil-docs/edit/main/',
          // Substitute %%CLI_VERSION%% tokens with the current CLI release at
          // build time (latest release manifest, checked-in fallback) so
          // pinned-version examples track releases. See src/lib/cliVersion.ts.
          remarkPlugins: [cliVersionRemark],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // GA4 via the Google tag gateway: /gt is intercepted by
  // Cloudflare at the edge on the proxied docs host, so no nginx proxying is
  // involved. Snippet shape mirrors GoogleTag in @driverforge/monitoring-next
  // (not importable here — its package entry points at unbuilt dist output).
  headTags: [
    ...(gaMeasurementId
      ? [
          {
            tagName: 'script' as const,
            // Required by Docusaurus's headTags schema even when empty.
            attributes: {},
            // The bootstrap only queues into dataLayer — no cookies/requests
            // until the consent-gated loader below runs, so it can stay live.
            innerHTML:
              'window.dataLayer = window.dataLayer || [];' +
              'function gtag(){dataLayer.push(arguments);}' +
              "gtag('js', new Date());" +
              `gtag('config', '${gaMeasurementId}');`,
          },
          {
            tagName: 'script' as const,
            attributes: {
              // Blocked until the user consents to the analytics category; the
              // cookie-consent plugin activates it by swapping data-src -> src.
              type: 'text/plain',
              'data-category': 'analytics',
              'data-src': `/gt/?id=${gaMeasurementId}`,
            },
          },
        ]
      : []),
  ],

  themeConfig: {
    image: 'img/anvil-social-card.png',
    // Algolia DocSearch. All three values are public (search-only key is
    // client-side by design), so they're hardcoded rather than routed through
    // gayle. The Admin/write key (crawler) is never committed.
    algolia: {
      appId: 'E09E8I6JYN',
      apiKey: 'f6d1caacb3efc3c5ce1a9b7c1176ea6a',
      indexName: 'Anvil Docs',
      // Off: the site is single-version / single-language, so contextual scoping
      // adds nothing — and it would filter on a `docusaurus_tag` facet the
      // current crawler doesn't emit, returning zero results.
      contextualSearch: false,
    },
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
      // Built-in toggle removed in favour of the custom Theme selector navbar
      // item (src/components/ThemeSelector). The colorMode API still works.
      disableSwitch: true,
    },
    navbar: {
      title: 'Anvil Documentation',
      logo: {
        alt: 'Driverforge',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'generalSidebar',
          label: 'General',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'platformSidebar',
          label: 'Platform',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sdkSidebar',
          label: 'SDK',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'agentSidebar',
          label: 'Agent',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'cliSidebar',
          label: 'CLI',
          position: 'left',
          className: 'navbar-preview',
        },
        {
          type: 'docSidebar',
          sidebarId: 'cicdSidebar',
          label: 'CI/CD',
          position: 'left',
          className: 'navbar-preview',
        },
        // Search sits at the end of the left group — after the section tabs,
        // before the right-side Help/Theme/Login/CTA cluster.
        {
          type: 'search',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Help',
          position: 'right',
          items: [
            {
              label: 'Email support',
              href: 'mailto:support@driverforge.com',
            },
            {
              label: 'Forum',
              href: 'https://driverforge.canny.io/feature-requests',
            },
          ],
        },
        {
          type: 'custom-themeSelector',
          position: 'right',
        },
        {
          href: 'https://id.driverforge.com/login',
          label: 'Login',
          position: 'right',
        },
        {
          href: 'https://driverforge.dev/#waitlist',
          label: 'Join the Waitlist',
          position: 'right',
          className: 'navbar-cta',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Platform',
              to: '/platform/overview',
            },
            {
              label: 'SDK',
              to: '/sdk/overview',
            },
            {
              label: 'Agent',
              to: '/agent/overview',
            },
            {
              label: 'CLI',
              to: '/cli/overview',
            },
            {
              label: 'CI/CD',
              to: '/cicd/overview',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Support',
              href: 'https://support.driverforge.com',
            },
            {
              label: "What's New",
              href: 'https://driverforge.canny.io/changelog',
            },
            {
              label: 'Share Feedback',
              href: 'https://driverforge.canny.io/feature-requests',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/driverforge',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Terms',
              href: 'https://driverforge.com/terms',
            },
            {
              label: 'Privacy',
              href: 'https://driverforge.com/privacy',
            },
            {
              html: '<button type="button" class="footer__link-item footer__cookie-preferences" data-cc="show-preferencesModal">Cookie preferences</button>',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Driverforge Pty Ltd`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['lua'],
    },
    zoom: {
      selector: '.markdown img[src*="/platform/"]',
      background: {
        light: 'rgba(255, 255, 255, 0.95)',
        dark: 'rgba(0, 0, 0, 0.95)',
      },
      config: {
        margin: 80,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
