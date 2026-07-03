import React, { useState } from 'react';
import { useApiKey } from './ApiKeyProvider';
import { ApiKeyPicker } from './ApiKeyPicker';
import {
  buildSignInUrl,
  projectLabel,
  replaceApiKeyPlaceholders,
  apiKeyForState,
  containsApiKeyPlaceholder,
} from '../lib/apiKey';
import styles from './api-key.module.css';

const APP_URL = process.env.APP_URL || 'https://app.driverforge.dev';

interface Props {
  children?: React.ReactNode;
  // The original swizzled component (MDXComponents/Code). Passed in
  // rather than imported so this file stays free of theme aliases and
  // therefore is importable from unit tests.
  OriginalCode: React.ComponentType<
    React.PropsWithChildren<Record<string, unknown>>
  >;
  [key: string]: unknown;
}

function replaceInChildren(
  children: React.ReactNode,
  apiKey: string,
): React.ReactNode {
  if (typeof children === 'string') {
    return replaceApiKeyPlaceholders(children, apiKey);
  }
  if (Array.isArray(children)) {
    return children.map((c, i) => (
      <React.Fragment key={i}>{replaceInChildren(c, apiKey)}</React.Fragment>
    ));
  }
  return children;
}

/**
 * Whether this code element is a fenced block (vs inline code). Mirrors
 * Docusaurus's own MDXComponents/Code heuristic — block iff any child is a
 * non-string or contains a newline — so it also catches bare ``` fences that
 * carry no `language-*` class.
 */
export function isBlockCode(children: React.ReactNode): boolean {
  return !React.Children.toArray(children).every(
    (el) => typeof el === 'string' && !el.includes('\n'),
  );
}

/** Flatten React children (incl. Prism token nodes) to plain text for copying. */
function childrenToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join('');
  if (React.isValidElement(node)) {
    return childrenToText(
      (node.props as { children?: React.ReactNode }).children,
    );
  }
  return '';
}

const COPY_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
    />
  </svg>
);

/** Copy-to-clipboard control, styled as a peer of the project selector. */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => undefined);
  };

  return (
    <button
      type="button"
      className={`${styles.controlButton} ${styles.controlButtonIcon}`}
      title={copied ? 'Copied' : 'Copy code'}
      aria-label="Copy code to clipboard"
      onClick={onCopy}
    >
      {copied ? CHECK_ICON : COPY_ICON}
    </button>
  );
}

/**
 * Wraps a Docusaurus code element (fenced block or inline) containing
 * `YOUR_API_KEY` (or `your-api-key`) and substitutes the selected project's
 * real API key in the rendered output.
 *
 * Overlays a single controls group (styles.codeBlockControls) that holds — as
 * siblings sharing one look — the project-selector control and, for fenced
 * blocks, our own copy button. Docusaurus's built-in copy button is hidden
 * inside our wrapper (see api-key.module.css) so the two controls sit together.
 */
export function TokenAwareCodeBlock({
  children,
  OriginalCode,
  ...rest
}: Props) {
  const { state } = useApiKey();
  const [open, setOpen] = useState(false);

  const apiKey = apiKeyForState(state);
  // Substitute the key (and show the project selector) only on snippets that
  // actually reference it; plain snippets just get the copy control.
  const hasApiKey = containsApiKeyPlaceholder(childrenToText(children));
  const substituted = hasApiKey ? replaceInChildren(children, apiKey) : children;

  // Only fenced blocks (not inline code) get a copy control.
  const isBlock = isBlockCode(children);
  const codeText = isBlock ? childrenToText(substituted) : '';

  const selectedProject =
    state.status === 'ready'
      ? state.projects.find((p) => p.id === state.selectedProjectId)
      : null;

  const label = selectedProject
    ? projectLabel(selectedProject)
    : state.status === 'loading'
      ? 'Loading your API key…'
      : 'Showing placeholder';

  const tooltip = selectedProject
    ? `Showing API key for ${projectLabel(selectedProject)} — click to switch`
    : undefined;

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '/';

  // The project-selector control only appears on snippets that reference the API
  // key; its form varies by auth state. The copy control appears on every block.
  let projectControl: React.ReactNode = null;
  if (hasApiKey && (state.status === 'anonymous' || state.status === 'no-projects')) {
    // anonymous  → sign in; the broadened cookie surfaces the key on return.
    // no-projects → signed in but onboarding unfinished; send them to the app.
    const isAnon = state.status === 'anonymous';
    const href = isAnon ? buildSignInUrl(APP_URL, currentUrl) : `${APP_URL}/`;
    const linkLabel = isAnon
      ? 'Sign in for your API key'
      : 'Create a project for your API key';
    projectControl = (
      <a className={styles.controlButton} href={href}>
        {linkLabel}
      </a>
    );
  } else if (hasApiKey) {
    projectControl = (
      <>
        <button
          type="button"
          className={styles.controlButton}
          title={tooltip}
          onClick={(e) => {
            e.preventDefault();
            setOpen((v) => !v);
          }}
        >
          {label}
        </button>
        {open && <ApiKeyPicker onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <span className={styles.codeBlockWrapper}>
      <OriginalCode {...rest}>{substituted}</OriginalCode>
      <span className={styles.codeBlockControls}>
        {isBlock && <CopyButton text={codeText} />}
        {projectControl}
      </span>
    </span>
  );
}
