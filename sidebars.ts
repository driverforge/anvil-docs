import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// One sidebar per top-level navbar tab. The navbar (docusaurus.config.ts) maps
// each tab to the matching sidebarId via `type: 'docSidebar'`, so choosing a tab
// swaps the left tree. "General" collects the cross-cutting pages; the other
// tabs hold their area's docs.
const sidebars: SidebarsConfig = {
  generalSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/overview',
        'getting-started/quick-start',
      ],
    },
    'account/settings',
    'reference/troubleshooting',
    'reference/faq',
  ],

  platformSidebar: [
    'platform/overview',
    {
      type: 'category',
      label: 'Organizations',
      collapsed: false,
      items: [
        {type: 'doc', id: 'platform/organizations', label: 'Managing your organization'},
        'platform/members',
      ],
    },
    {
      type: 'category',
      label: 'Projects',
      collapsed: false,
      items: [
        {type: 'doc', id: 'platform/projects', label: 'Managing projects'},
        {type: 'doc', id: 'security/api-keys', label: 'API keys'},
      ],
    },
    {
      type: 'category',
      label: 'Events',
      collapsed: false,
      items: [
        {type: 'doc', id: 'platform/events', label: 'Overview'},
        'platform/captured-handlers',
      ],
    },
    {
      type: 'category',
      label: 'Logs',
      collapsed: false,
      items: [
        {type: 'doc', id: 'platform/logs', label: 'Overview'},
        'platform/logs-vs-events',
      ],
    },
    {
      type: 'category',
      label: 'Errors',
      collapsed: false,
      items: [
        {type: 'doc', id: 'platform/errors', label: 'Overview'},
        'platform/error-grouping',
      ],
    },
    'platform/devices',
    {
      type: 'category',
      label: 'Subscription & billing',
      collapsed: false,
      items: [
        'platform/plans',
        'platform/subscription',
        'platform/billing',
      ],
    },
  ],

  sdkSidebar: [
    'sdk/overview',
    'sdk/installation',
    'sdk/automatic-capture',
    'sdk/manual-capture',
    'sdk/log-forwarding',
    'sdk/api-reference',
  ],

  agentSidebar: [
    'agent/overview',
    'agent/installation',
    'agent/configuration',
  ],

  cliSidebar: [
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        'cli/overview',
        'cli/authentication',
        'cli/context',
        'cli/build-configuration',
        'cli/source-maps',
        'cli/error-reporting',
        'cli/upgrading',
        'cli/telemetry',
      ],
    },
    {
      type: 'category',
      label: 'Commands',
      collapsed: false,
      items: [
        'cli/agent',
        'cli/build',
        'cli/completion',
        {type: 'doc', id: 'cli/debug', className: 'menu-coming-soon'},
        'cli/deploy',
        'cli/device',
        {type: 'doc', id: 'cli/init', className: 'menu-experimental'},
        'cli/login',
        'cli/logout',
        'cli/org',
        'cli/sync',
        'cli/upgrade',
        'cli/version',
        'cli/whoami',
      ],
    },
  ],

  cicdSidebar: [
    'cicd/overview',
    'cicd/github-actions',
    'cicd/buildkite',
    'cicd/migrating-from-driverpackager',
  ],
};

export default sidebars;
