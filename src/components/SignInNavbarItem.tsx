import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

import { buildSignInUrl } from '../lib/apiKey';

const APP_URL = process.env.APP_URL || 'https://dev.driverforge.com';

/**
 * The navbar's sign-in control.
 *
 * Renders **both** variants and lets CSS pick, rather than branching on the
 * session. That is deliberate and does three things at once:
 *
 *   - the markup is identical for every reader, so React hydrates cleanly
 *   - `data-auth` is already on <html> before first paint, so the right one is
 *     visible immediately — no label correcting itself in front of the reader
 *   - the one that is hidden is `display: none`, so nothing appears late and
 *     shoves the rest of the navbar sideways
 *
 * See custom.css for the rules and docusaurus.config.ts for the head script.
 *
 * The link goes through the app's `/auth/login` rather than straight to
 * Kratos: that is where `returnTo` is honoured, so going direct is what used
 * to land readers on the app instead of the page they were reading.
 */
export default function SignInNavbarItem() {
  // False during SSR and the first client render, so the served markup and the
  // hydrated markup agree. `window` is only read afterwards, and the resulting
  // change is to an href — never to layout.
  const isBrowser = useIsBrowser();

  const signInHref = isBrowser
    ? buildSignInUrl(APP_URL, window.location.href)
    : `${APP_URL}/auth/login`;

  return (
    <>
      <a className="navbar__item navbar__link df-auth-out" href={signInHref}>
        Login
      </a>
      <a className="navbar__item navbar__link df-auth-in" href={APP_URL}>
        Dashboard
      </a>
    </>
  );
}
