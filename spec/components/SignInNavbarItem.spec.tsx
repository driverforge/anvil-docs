import React from 'react';
import { render, screen } from '@testing-library/react';

import SignInNavbarItem from '../../src/components/SignInNavbarItem';

// Docusaurus's hook returns false during SSR and the first client render.
let isBrowser = true;
jest.mock('@docusaurus/useIsBrowser', () => ({
  __esModule: true,
  default: () => isBrowser,
}));

// Mirrors the component: the value is environment-driven, so pinning a literal
// here would break the spec wherever APP_URL differs.
const APP = process.env.APP_URL || 'https://dev.driverforge.com';

describe('SignInNavbarItem', () => {
  beforeEach(() => {
    isBrowser = true;
  });

  it('renders both variants, so the markup does not depend on the session', () => {
    // This is what lets the served HTML be identical for every reader, and so
    // what keeps hydration clean and the navbar from re-laying out.
    render(<SignInNavbarItem />);

    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('marks each variant for the CSS that shows one and hides the other', () => {
    render(<SignInNavbarItem />);

    expect(screen.getByRole('link', { name: 'Login' })).toHaveClass('df-auth-out');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('df-auth-in');
  });

  it('deep-links sign-in back to the page being read', () => {
    render(<SignInNavbarItem />);

    const href = screen.getByRole('link', { name: 'Login' }).getAttribute('href') ?? '';
    expect(new URL(href).searchParams.get('returnTo')).toBe(window.location.href);
  });

  it('routes sign-in through the app rather than straight to Kratos', () => {
    render(<SignInNavbarItem />);

    // Going direct to id.driverforge.com is what dropped returnTo entirely.
    const href = screen.getByRole('link', { name: 'Login' }).getAttribute('href') ?? '';
    expect(href).not.toContain('id.driverforge.com');
  });

  it('omits returnTo before hydration, when there is no current URL', () => {
    isBrowser = false;
    render(<SignInNavbarItem />);

    // Still a usable sign-in link — the deep link is an improvement on it, not
    // a precondition — and only the href differs, never the layout.
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
      'href',
      `${APP}/auth/login`,
    );
  });

  it('points the signed-in variant at the app', () => {
    render(<SignInNavbarItem />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', APP);
  });
});
