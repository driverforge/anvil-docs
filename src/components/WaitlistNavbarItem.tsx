import React from 'react';

const WAITLIST_URL = 'https://driverforge.com/anvil/#waitlist';

/**
 * The navbar's sign-up call to action.
 *
 * Hidden from anyone signed in — they have an account, so inviting them to
 * join a waitlist for one is noise at best and confusing at worst.
 *
 * Always rendered, hidden by CSS rather than by a condition, for the same
 * reasons as SignInNavbarItem: identical markup for every reader, correct
 * before first paint, and nothing appearing late to move the navbar. It also
 * means the link stays in the served HTML, so crawlers and readers without JS
 * still see it.
 *
 * `navbar__link navbar-cta` is the pair custom.css keys the button styling
 * off, so those class names are load-bearing rather than decorative.
 */
export default function WaitlistNavbarItem() {
  return (
    <a className="navbar__item navbar__link navbar-cta df-auth-out" href={WAITLIST_URL}>
      Join the Waitlist
    </a>
  );
}
