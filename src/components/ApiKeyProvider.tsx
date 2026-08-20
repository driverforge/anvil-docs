import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  DocsProject,
  ApiKeyState,
  SELECTED_PROJECT_STORAGE_KEY,
  resolveSelectedProject,
} from '../lib/apiKey';

// Anvil app URL for the cross-origin `/api/docs/projects` proxy. Inlined at
// build time by docusaurus-plugin-dotenv from `.env` (or process.env when
// running inside the Docker container).
const APP_URL = process.env.APP_URL || 'https://app.driverforge.dev';

interface ApiKeyContextValue {
  state: ApiKeyState;
  /** Invite-only preview mode (from the public previewMode flag via the proxy). */
  previewMode: boolean;
  selectProject: (projectId: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

function readStoredSelection(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(SELECTED_PROJECT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredSelection(id: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SELECTED_PROJECT_STORAGE_KEY, id);
  } catch {
    // ignore (Safari private mode, quota, etc.)
  }
}

/** What one load of the proxy resolved to: the state to show, and the flag. */
interface ProjectsLoad {
  state: ApiKeyState;
  previewMode: boolean;
}

const ERROR_LOAD: ProjectsLoad = { state: { status: 'error' }, previewMode: false };

/**
 * A 401 is not a failure — the reader is simply anonymous. The proxy still
 * returns `previewMode` so download CTAs can be gated during invite-only
 * preview, and a body that will not parse just leaves the flag false.
 */
async function readAnonymousLoad(res: Response): Promise<ProjectsLoad> {
  try {
    const body = (await res.json()) as { previewMode?: boolean };
    return { state: { status: 'anonymous' }, previewMode: body?.previewMode === true };
  } catch {
    return { state: { status: 'anonymous' }, previewMode: false };
  }
}

function toApiKeyState(projects: DocsProject[]): ApiKeyState {
  if (projects.length === 0) {
    // Signed in but no project with an active token yet — a normal
    // "onboarding not finished" state, not a load failure. Surfaces a
    // friendly "create a project" prompt rather than an error.
    return { status: 'no-projects' };
  }

  const selected = resolveSelectedProject(projects, readStoredSelection());
  // `selected` is unreachable-null in practice given the guard above, but
  // keep the type system honest rather than asserting.
  return selected
    ? { status: 'ready', projects, selectedProjectId: selected.id }
    : { status: 'error' };
}

/**
 * One call to the cross-origin proxy, resolved to what the UI should show.
 *
 * Every failure mode collapses to the same error state, so this returns a
 * value rather than setting React state — which keeps the effect below to
 * nothing but cancellation.
 */
async function loadProjects(): Promise<ProjectsLoad> {
  if (!APP_URL) return ERROR_LOAD;

  try {
    const res = await fetch(`${APP_URL}/api/docs/projects`, { credentials: 'include' });

    if (res.status === 401) return readAnonymousLoad(res);
    if (!res.ok) return ERROR_LOAD;

    const body = (await res.json()) as { projects: DocsProject[]; previewMode?: boolean };
    const projects = Array.isArray(body.projects) ? body.projects : [];

    return { state: toApiKeyState(projects), previewMode: body.previewMode === true };
  } catch {
    return ERROR_LOAD;
  }
}

/**
 * Wraps the docs site with API-key state. On mount (client-side
 * only) it calls the cross-origin proxy on the Anvil app, which
 * reads the shared appSession cookie and returns the user's projects.
 */
export function ApiKeyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ApiKeyState>({ status: 'loading' });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void loadProjects().then((load) => {
      if (cancelled) return;
      setPreviewMode(load.previewMode);
      setState(load.state);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectProject = useCallback((projectId: string) => {
    setState((prev) =>
      prev.status === 'ready'
        ? { ...prev, selectedProjectId: projectId }
        : prev,
    );
    writeStoredSelection(projectId);
  }, []);

  return (
    <ApiKeyContext.Provider value={{ state, previewMode, selectProject }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey(): ApiKeyContextValue {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) {
    // Safety net — should never happen because <Root> wraps the entire
    // app. Returning a static anonymous state avoids crashing a page if
    // this ever gets used outside the provider.
    return {
      state: { status: 'anonymous' },
      previewMode: false,
      selectProject: () => undefined,
    };
  }
  return ctx;
}
