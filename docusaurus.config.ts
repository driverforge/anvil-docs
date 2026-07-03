import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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

const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
// URL of the Anvil app — used by the docs API-key feature to call
// the cross-origin `/api/docs/projects` proxy.
// Local dev (docusaurus start): defaults to app.driverforge.test.
// Production (docker build): overridden via Dockerfile ARG APP_URL.
const appUrl = process.env.APP_URL || 'https://app.driverforge.test';

const config: Config = {
  title: 'Anvil Documentation',
  tagline: 'See what Control4 is sending your driver',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.driverforge.dev',
  baseUrl: '/',

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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    ...(umamiWebsiteId
      ? [
          {
            tagName: 'script' as const,
            attributes: {
              defer: 'true',
              src: '/api/sc/um/script.js',
              'data-website-id': umamiWebsiteId,
            },
          },
        ]
      : []),
  ],

  themeConfig: {
    image: 'img/anvil-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
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
        {
          href: appUrl,
          label: 'Open Anvil',
          position: 'right',
        },
        {
          href: 'https://github.com/driverforge',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
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
              label: 'Overview',
              to: '/',
            },
            {
              label: 'Quick Start',
              to: '/getting-started/quick-start',
            },
            {
              label: 'Installation',
              to: '/sdk/installation',
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
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Driverforge`,
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
