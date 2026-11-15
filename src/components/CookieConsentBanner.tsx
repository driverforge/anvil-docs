import { useEffect } from 'react';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';
import {
  CONSENT_COOKIE_NAME,
  cookieConsentConfig,
  sharedConsentDomain,
  withSharedConsentCookie,
} from '../lib/cookieConsentConfig';

/**
 * Runs the vanilla-cookieconsent banner and keeps its `cc--darkmode` class in
 * sync with Docusaurus's `data-theme` attribute (the plugin only themes via
 * that class, not via `data-theme`). On driverforge.com hosts the consent is
 * held on the parent domain, shared with the other driverforge.com properties.
 */
export function CookieConsentBanner(): null {
  useEffect(() => {
    const html = document.documentElement;
    const syncDarkMode = () =>
      html.classList.toggle('cc--darkmode', html.getAttribute('data-theme') === 'dark');

    syncDarkMode();
    const observer = new MutationObserver(syncDarkMode);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    const { hostname } = window.location;
    if (sharedConsentDomain(hostname)) {
      // A copy from before consent was shared would sit on this host alone and
      // shadow the shared one. Expiring it without a domain removes only that.
      document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; path=/`;
    }
    CookieConsent.run(withSharedConsentCookie(cookieConsentConfig, hostname));

    return () => observer.disconnect();
  }, []);

  return null;
}
