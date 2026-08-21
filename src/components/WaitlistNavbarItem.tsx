import React from 'react';

import { useApiKey } from './ApiKeyProvider';
import { signedInFromStatus } from '../lib/apiKey';

const WAITLIST_URL = 'https://driverforge.com/anvil/#waitlist';

/**
 * The navbar's sign-up call to action.
 *
 * Hidden from anyone already signed in — they have an account, so inviting
 * them to join the waitlist for one is noise at best and confusing at worst.
 *
 * Also hidden until the session answers, for the same reason the sign-in
 * control is: rendering it and then removing it is more distracting than
 * showing it a beat late.
 *
 * The CTA styling keys off `.navbar__link.navbar-cta` in custom.css, so those
 * class names are load-bearing rather than decorative.
 */
export default function WaitlistNavbarItem() {
  const { state } = useApiKey();

  if (signedInFromStatus(state.status) !== 'signed-out') return null;

  return (
    <a className="navbar__item navbar__link navbar-cta" href={WAITLIST_URL}>
      Join the Waitlist
    </a>
  );
}
