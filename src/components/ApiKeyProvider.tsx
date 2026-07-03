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

/**
 * Wraps the docs site with API-key state. On mount (client-side
 * only) it calls the cross-origin proxy on app.driverforge.dev which
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
    if (!APP_URL) {
      setState({ status: 'error' });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${APP_URL}/api/docs/projects`, {
          credentials: 'include',
        });

        if (cancelled) return;

        if (res.status === 401) {
          // Anonymous, but the proxy still returns previewMode so we can gate
          // download CTAs during invite-only preview.
          try {
            const body = (await res.json()) as { previewMode?: boolean };
            if (!cancelled) setPreviewMode(body?.previewMode === true);
          } catch {
            // ignore — previewMode stays false
          }
          if (!cancelled) setState({ status: 'anonymous' });
          return;
        }

        if (!res.ok) {
          setState({ status: 'error' });
          return;
        }

        const body = (await res.json()) as {
          projects: DocsProject[];
          previewMode?: boolean;
        };
        if (cancelled) return;
        setPreviewMode(body.previewMode === true);

        const projects = Array.isArray(body.projects) ? body.projects : [];
        if (projects.length === 0) {
          // Signed in but no project with an active token yet — a normal
          // "onboarding not finished" state, not a load failure. Surfaces a
          // friendly "create a project" prompt rather than an error.
          setState({ status: 'no-projects' });
          return;
        }

        const stored = readStoredSelection();
        const selected = resolveSelectedProject(projects, stored);
        if (!selected) {
          // Unreachable in practice (we guard against empty projects
          // above), but keep the type-system honest.
          setState({ status: 'error' });
          return;
        }
        setState({
          status: 'ready',
          projects,
          selectedProjectId: selected.id,
        });
      } catch {
        if (!cancelled) setState({ status: 'error' });
      }
    })();

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
