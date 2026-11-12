import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// One sidebar per top-level navbar tab. The navbar (docusaurus.config.ts) maps
// each tab to the matching sidebarId via `type: 'docSidebar'`, so choosing a tab
// swaps the left tree; each tab holds its area's docs.
const sidebars: SidebarsConfig = {
  platformSidebar: [
    'platform/overview',
    'platform/quick-start',
    {
      type: 'category',
      label: 'Events',
      collapsed: false,
      items: [
        { type: 'doc', id: 'platform/events', label: 'Overview' },
        'platform/captured-handlers',
      ],
    },
    {
      type: 'category',
      label: 'Logs',
      collapsed: false,
      items: [{ type: 'doc', id: 'platform/logs', label: 'Overview' }, 'platform/logs-vs-events'],
    },
    {
      type: 'category',
      label: 'Errors',
      collapsed: false,
      items: [{ type: 'doc', id: 'platform/errors', label: 'Overview' }, 'platform/error-grouping'],
    },
    {
      type: 'category',
      label: 'Projects',
      collapsed: false,
      items: [
        { type: 'doc', id: 'platform/projects', label: 'Managing projects' },
        { type: 'doc', id: 'platform/project-tokens', label: 'Project tokens' },
      ],
    },
    {
      type: 'category',
      label: 'Organizations',
      collapsed: false,
      items: [
        { type: 'doc', id: 'platform/organizations', label: 'Managing your organization' },
        'platform/members',
        'platform/account',
        'platform/devices',
        {
          type: 'category',
          label: 'Subscription & billing',
          collapsed: false,
          items: ['platform/plans', 'platform/subscription', 'platform/billing'],
        },
      ],
    },
    'platform/troubleshooting',
  ],

  sdkSidebar: [
    'sdk/overview',
    'sdk/installation',
    'sdk/automatic-capture',
    'sdk/manual-capture',
    'sdk/log-forwarding',
    'sdk/trust',
    'sdk/api-reference',
  ],

  agentSidebar: [
    'agent/overview',
    'agent/installation',
    'agent/configuration',
    'agent/deploy-server',
  ],

  cliSidebar: [
    'cli/overview',
    'cli/installation',
    'cli/authentication',
    'cli/context',
    'cli/build-configuration',
    'cli/versioning',
    'cli/source-maps',
    'cli/error-reporting',
    'cli/upgrading',
    'cli/telemetry',
    'cli/agents',
    'cli/spaceship',
    {
      type: 'category',
      label: 'Commands',
      collapsed: false,
      items: [
        'cli/build',
        'cli/completion',
        'cli/deploy',
        'cli/device',
        'cli/doctor',
        'cli/errors',
        'cli/events',
        'cli/get',
        'cli/init',
        'cli/login',
        'cli/logout',
        'cli/logs',
        'cli/org',
        {type: 'doc', id: 'cli/run', className: 'menu-coming-soon'},
        'cli/sync',
        'cli/upgrade',
        'cli/version',
        'cli/whoami',
      ],
    },
  ],

  codingAgentsSidebar: [
    'coding-agents/overview',
    {
      type: 'category',
      label: 'MCP Server',
      collapsed: false,
      items: ['coding-agents/mcp/overview', 'coding-agents/mcp/setup', 'coding-agents/mcp/tools'],
    },
    {
      type: 'category',
      label: 'Agent Skills',
      collapsed: false,
      items: [
        'coding-agents/skills/overview',
        'coding-agents/skills/cli',
        'coding-agents/skills/available',
      ],
    },
  ],

  cicdSidebar: [
    'cicd/overview',
    'cicd/github-actions',
    'cicd/buildkite',
    'cicd/gitlab',
    'cicd/migrating-from-driverpackager',
  ],
};

export default sidebars;
