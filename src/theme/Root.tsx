import React from 'react';
import { ApiKeyProvider } from '../components/ApiKeyProvider';
import { CookieConsentBanner } from '../components/CookieConsentBanner';

/**
 * Docusaurus `Root` theme hook — wraps the entire site with app-wide
 * providers. See: https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ApiKeyProvider>
      {children}
      <CookieConsentBanner />
    </ApiKeyProvider>
  );
}
