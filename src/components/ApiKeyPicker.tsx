import React, { useEffect, useRef } from 'react';
import { useApiKey } from './ApiKeyProvider';
import { buildSignInUrl, projectLabel } from '../lib/apiKey';
import styles from './api-key.module.css';

// Anvil app URL for the anonymous sign-in deep link. Inlined at build time by
// docusaurus-plugin-dotenv from `.env` (or process.env in Docker builds).
const APP_URL = process.env.APP_URL || 'https://app.driverforge.dev';

interface Props {
  onClose: () => void;
}

/**
 * Popover shown when the user clicks an API-key placeholder.
 * Lists their projects so they can switch which one is rendered in the
 * docs code blocks. Anonymous users see a sign-in link.
 */
export function ApiKeyPicker({ onClose }: Props) {
  const { state, selectProject } = useApiKey();

  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '/';

  return (
    <div ref={rootRef} className={styles.picker} role="dialog">
      {state.status === 'loading' && (
        <div className={styles.pickerRow}>Loading projects…</div>
      )}

      {state.status === 'anonymous' && (
        <a
          className={styles.pickerRow}
          href={buildSignInUrl(APP_URL, currentUrl)}
        >
          Sign in to see your API key
        </a>
      )}

      {state.status === 'error' && (
        <div className={styles.pickerRow}>
          Unable to load projects. Showing placeholder.
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <div className={styles.pickerHeader}>Select project</div>
          {state.projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={
                p.id === state.selectedProjectId
                  ? `${styles.pickerRow} ${styles.pickerRowSelected}`
                  : styles.pickerRow
              }
              onClick={() => {
                selectProject(p.id);
                onClose();
              }}
            >
              {projectLabel(p)}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
