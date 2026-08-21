import React from 'react';
import { render, screen } from '@testing-library/react';

import WaitlistNavbarItem from '../../src/components/WaitlistNavbarItem';

describe('WaitlistNavbarItem', () => {
  it('links to the waitlist', () => {
    render(<WaitlistNavbarItem />);

    expect(screen.getByRole('link', { name: 'Join the Waitlist' })).toHaveAttribute(
      'href',
      'https://driverforge.com/anvil/#waitlist',
    );
  });

  it('is marked signed-out only, so it hides from anyone with an account', () => {
    render(<WaitlistNavbarItem />);

    expect(screen.getByRole('link', { name: 'Join the Waitlist' })).toHaveClass('df-auth-out');
  });

  it('carries the classes the CTA styling keys off', () => {
    // `.navbar__link.navbar-cta` in custom.css — load-bearing, not decorative.
    // Dropping them degrades the button to a plain text link, silently.
    render(<WaitlistNavbarItem />);

    expect(screen.getByRole('link', { name: 'Join the Waitlist' })).toHaveClass(
      'navbar__link',
      'navbar-cta',
    );
  });

  it('stays in the markup, so crawlers and no-JS readers still see it', () => {
    // Rendering it conditionally removed it from the served HTML entirely.
    render(<WaitlistNavbarItem />);

    expect(screen.getByRole('link', { name: 'Join the Waitlist' })).toBeInTheDocument();
  });
});
