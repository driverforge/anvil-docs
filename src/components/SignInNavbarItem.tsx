import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

import { useApiKey } from './ApiKeyProvider';
import { buildSignInUrl, signedInFromStatus } from '../lib/apiKey';

const APP_URL = process.env.APP_URL || 'https://dev.driverforge.com';

/**
 * The navbar's sign-in control.
 *
 * A component rather than a config entry because navbar items are static, and
 * this needs two things static config cannot express: the page the reader is
 * currently on, and whether they are already signed in.
 *
 * It links through the app's `/auth/login` rather than straight to Kratos.
 * That is where `returnTo` is honoured, so going direct is what sent readers
 * to the app instead of back to the page they were reading.
 */
export default function SignInNavbarItem() {
  // False during SSR and on the first client render, so the markup React
  // hydrates matches what was served. `window` is only read after that.
  const isBrowser = useIsBrowser();
  const { state } = useApiKey();
  const signedIn = signedInFromStatus(state.status);

  // Render nothing until the session answers. Showing "Login" here is right
  // for the anonymous majority but wrong for everyone else, and being wrong
  // shows: the label visibly rewrote itself to "Dashboard" once the fetch
  // landed. Appearing a beat late is quieter than correcting in public.
  if (signedIn === 'unknown') return null;

  if (signedIn === 'signed-in') {
    return (
      <a className="navbar__item navbar__link" href={APP_URL}>
        Dashboard
      </a>
    );
  }

  // Before hydration there is no current URL to return to, so fall back to the
  // app's login without one. It resolves to the same place a reader would
  // reach anyway; the deep link is an improvement on it, not a precondition.
  const href = isBrowser
    ? buildSignInUrl(APP_URL, window.location.href)
    : `${APP_URL}/auth/login`;

  return (
    <a className="navbar__item navbar__link" href={href}>
      Login
    </a>
  );
}
