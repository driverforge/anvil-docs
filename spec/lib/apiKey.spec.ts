import {
  API_KEY_PLACEHOLDER,
  buildSignInUrl,
  containsApiKeyPlaceholder,
  replaceApiKeyPlaceholders,
  resolveSelectedProject,
  apiKeyForState,
  type DocsProject,
  type ApiKeyState,
} from '../../src/lib/apiKey';

describe('apiKey.ts', () => {
  const projects: DocsProject[] = [
    { id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k-one' },
    { id: 'p-2', name: 'Two', slug: 'two', orgName: 'Acme', apiKey: 'k-two' },
  ];

  describe('resolveSelectedProject', () => {
    it('returns null when the project list is empty', () => {
      expect(resolveSelectedProject([], null)).toBeNull();
      expect(resolveSelectedProject([], 'p-1')).toBeNull();
    });

    it('returns the stored match when it still exists', () => {
      expect(resolveSelectedProject(projects, 'p-2')).toEqual(projects[1]);
    });

    it('falls back to first project when the stored id is missing', () => {
      expect(resolveSelectedProject(projects, 'p-gone')).toEqual(projects[0]);
    });

    it('falls back to first project when no stored id', () => {
      expect(resolveSelectedProject(projects, null)).toEqual(projects[0]);
    });
  });

  describe('buildSignInUrl', () => {
    it('builds an app sign-in URL with returnTo pointing at the current docs url', () => {
      const url = buildSignInUrl(
        'https://app.driverforge.dev',
        'https://docs.driverforge.dev/getting-started/quick-start',
      );
      expect(url).toBe(
        'https://app.driverforge.dev/auth/login?returnTo=https%3A%2F%2Fdocs.driverforge.dev%2Fgetting-started%2Fquick-start',
      );
    });
  });

  describe('apiKeyForState', () => {
    it('returns the placeholder while loading', () => {
      expect(apiKeyForState({ status: 'loading' })).toBe(API_KEY_PLACEHOLDER);
    });

    it('returns the placeholder when anonymous', () => {
      expect(apiKeyForState({ status: 'anonymous' })).toBe(API_KEY_PLACEHOLDER);
    });

    it('returns the placeholder on error', () => {
      expect(apiKeyForState({ status: 'error' })).toBe(API_KEY_PLACEHOLDER);
    });

    it('returns the placeholder when signed in with no projects', () => {
      expect(apiKeyForState({ status: 'no-projects' })).toBe(
        API_KEY_PLACEHOLDER,
      );
    });

    it('returns the selected project API key when ready', () => {
      const state: ApiKeyState = {
        status: 'ready',
        projects,
        selectedProjectId: 'p-2',
      };
      expect(apiKeyForState(state)).toBe('k-two');
    });

    it('returns the placeholder if selected id is missing', () => {
      const state: ApiKeyState = {
        status: 'ready',
        projects,
        selectedProjectId: 'gone',
      };
      expect(apiKeyForState(state)).toBe(API_KEY_PLACEHOLDER);
    });
  });

  describe('containsApiKeyPlaceholder', () => {
    it('matches the uppercase variant', () => {
      expect(containsApiKeyPlaceholder('Anvil:Init("YOUR_API_KEY")')).toBe(true);
    });

    it('matches the lowercase-hyphenated variant', () => {
      expect(
        containsApiKeyPlaceholder('driverforge init my-driver --apikey "your-api-key"'),
      ).toBe(true);
    });

    it('returns false for unrelated text', () => {
      expect(containsApiKeyPlaceholder('some random code')).toBe(false);
    });
  });

  describe('replaceApiKeyPlaceholders', () => {
    it('replaces YOUR_API_KEY', () => {
      expect(
        replaceApiKeyPlaceholders(
          'Anvil:Init("YOUR_API_KEY", name)',
          'real-key',
        ),
      ).toBe('Anvil:Init("real-key", name)');
    });

    it('replaces your-api-key', () => {
      expect(
        replaceApiKeyPlaceholders(
          'driverforge init my-driver --apikey "your-api-key"',
          'real-key',
        ),
      ).toBe('driverforge init my-driver --apikey "real-key"');
    });

    it('replaces multiple occurrences of mixed variants', () => {
      expect(
        replaceApiKeyPlaceholders('a YOUR_API_KEY b your-api-key c', 'X'),
      ).toBe('a X b X c');
    });
  });
});
