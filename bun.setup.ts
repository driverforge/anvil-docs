import { mock } from 'bun:test';

// Docusaurus provides these as build-time aliases rather than installed
// packages. Register placeholders before Bun resolves the spec modules; the
// specs replace them with their scenario-specific implementations.
mock.module('@docusaurus/useIsBrowser', () => ({ default: () => true }));
mock.module('@docusaurus/router', () => ({
  useLocation: () => ({ pathname: '/' }),
}));
mock.module('@docusaurus/plugin-content-docs/client', () => ({
  useDoc: () => ({ metadata: {} }),
}));
