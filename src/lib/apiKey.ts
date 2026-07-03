/**
 * Pure helpers for the docs API-key feature.
 *
 * Kept framework-agnostic (no Docusaurus, no React) so the core state
 * transitions and URL building can be unit-tested in isolation from the
 * Docusaurus test infrastructure.
 */

export const API_KEY_PLACEHOLDER = 'YOUR_API_KEY';
export const SELECTED_PROJECT_STORAGE_KEY = 'df-docs-selected-project';

/**
 * All placeholder variants used across the docs. The swizzle matches
 * any of these and substitutes the user's real API key. Both the
 * uppercase form (Lua `Anvil:Init(...)` examples) and lowercase form
 * (CLI flag values, prose) appear in the docs.
 */
export const API_KEY_PLACEHOLDER_VARIANTS = [
  'YOUR_API_KEY',
  'your-api-key',
] as const;

/**
 * A regex that matches any of the known API-key placeholder variants
 * inside a string. Used for both detection and replacement.
 */
export const API_KEY_PLACEHOLDER_RE = new RegExp(
  API_KEY_PLACEHOLDER_VARIANTS.map((v) =>
    v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|'),
  'g',
);

/**
 * Check whether a string contains any known API-key placeholder.
 */
export function containsApiKeyPlaceholder(text: string): boolean {
  API_KEY_PLACEHOLDER_RE.lastIndex = 0;
  return API_KEY_PLACEHOLDER_RE.test(text);
}

/**
 * Replace all API-key placeholder variants in a string with the given key.
 */
export function replaceApiKeyPlaceholders(
  text: string,
  apiKey: string,
): string {
  return text.replace(API_KEY_PLACEHOLDER_RE, apiKey);
}

export interface DocsProject {
  id: string;
  name: string;
  slug: string;
  orgName: string;
  apiKey: string;
}

/**
 * Display label for a project: `orgName / projectName`.
 */
export function projectLabel(project: DocsProject): string {
  return `${project.orgName} / ${project.name}`;
}

export type ApiKeyState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  // Signed in, but the account has no project with an active token yet
  // (onboarding not finished) — distinct from a genuine load failure.
  | { status: 'no-projects' }
  | { status: 'error' }
  | {
      status: 'ready';
      projects: DocsProject[];
      selectedProjectId: string;
    };

/**
 * Pick the project to show given a previously-persisted selection.
 * Falls back to the first project if the stored id no longer exists
 * (e.g. the user lost access or deleted it).
 */
export function resolveSelectedProject(
  projects: DocsProject[],
  storedId: string | null,
): DocsProject | null {
  if (projects.length === 0) return null;
  if (storedId) {
    const match = projects.find((p) => p.id === storedId);
    if (match) return match;
  }
  return projects[0];
}

/**
 * Build the sign-in URL that deep-links the user back to the current
 * docs page after authenticating on the app.
 */
export function buildSignInUrl(appUrl: string, currentUrl: string): string {
  const url = new URL('/auth/login', appUrl);
  url.searchParams.set('returnTo', currentUrl);
  return url.toString();
}

/**
 * Return the API key to display, or the placeholder when no project is
 * available (loading, anonymous, error, or empty list).
 */
export function apiKeyForState(state: ApiKeyState): string {
  if (state.status !== 'ready') return API_KEY_PLACEHOLDER;
  const project = state.projects.find(
    (p) => p.id === state.selectedProjectId,
  );
  return project?.apiKey ?? API_KEY_PLACEHOLDER;
}
