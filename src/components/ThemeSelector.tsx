import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './ThemeSelector.module.css';

// Navbar Theme selector — a Light / Dark / System <select> bound to Docusaurus's
// color-mode API (colorModeChoice: 'light' | 'dark' | null, where null =
// system). Replaces the built-in toggle (disableSwitch: true in the config).

function SunIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Zm1.5 0a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ThemeSelector() {
  const isBrowser = useIsBrowser();
  const { colorModeChoice, setColorMode } = useColorMode();

  // Reflect the real choice only after hydration — the server renders 'system'
  // (it can't know the stored choice), so binding the controlled <select> to it
  // before mount would cause an SSR mismatch.
  const value = isBrowser ? (colorModeChoice ?? 'system') : 'system';

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const next = event.target.value;
    setColorMode(next === 'system' ? null : (next as 'light' | 'dark'));
  }

  const Icon = value === 'light' ? SunIcon : value === 'dark' ? MoonIcon : MonitorIcon;

  return (
    <div className={styles.theme}>
      <Icon />
      <select className={styles.select} value={value} onChange={handleChange} aria-label="Theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <ChevronIcon />
    </div>
  );
}
