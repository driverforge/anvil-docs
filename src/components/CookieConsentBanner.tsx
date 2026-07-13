import { useEffect } from 'react';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';
import { cookieConsentConfig } from '../lib/cookieConsentConfig';

/**
 * Runs the vanilla-cookieconsent banner and keeps its `cc--darkmode` class in
 * sync with Docusaurus's `data-theme` attribute (the plugin only themes via
 * that class, not via `data-theme`).
 */
export function CookieConsentBanner(): null {
  useEffect(() => {
    const html = document.documentElement;
    const syncDarkMode = () =>
      html.classList.toggle('cc--darkmode', html.getAttribute('data-theme') === 'dark');

    syncDarkMode();
    const observer = new MutationObserver(syncDarkMode);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    CookieConsent.run(cookieConsentConfig);

    return () => observer.disconnect();
  }, []);

  return null;
}
