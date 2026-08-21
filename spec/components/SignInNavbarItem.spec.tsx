import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import SignInNavbarItem from '../../src/components/SignInNavbarItem';
import { ApiKeyProvider } from '../../src/components/ApiKeyProvider';

// Docusaurus's hook returns false during SSR and the first client render.
// Driven per-test so both sides of that split are covered.
let isBrowser = true;
jest.mock('@docusaurus/useIsBrowser', () => ({
  __esModule: true,
  default: () => isBrowser,
}));

// Mirrors the component: the value is environment-driven, so pinning a literal
// here would make the spec fail wherever APP_URL happens to differ.
const APP = process.env.APP_URL || 'https://dev.driverforge.com';

function respondWith(status: number, body: unknown) {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: status < 400, status, json: async () => body } as Response),
  ) as unknown as typeof fetch;
}

const signedIn = {
  projects: [{ id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k' }],
};

function renderItem() {
  render(
    <ApiKeyProvider>
      <SignInNavbarItem />
    </ApiKeyProvider>,
  );
}

describe('SignInNavbarItem', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    isBrowser = true;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    window.localStorage.clear();
  });

  it('offers sign-in to an anonymous reader', async () => {
    respondWith(401, {});
    renderItem();

    const link = await screen.findByRole('link', { name: 'Login' });
    expect(link).toHaveAttribute('href', expect.stringContaining(`${APP}/auth/login`));
  });

  it('deep-links back to the page being read', async () => {
    respondWith(401, {});
    renderItem();

    const link = await screen.findByRole('link', { name: 'Login' });
    const href = link.getAttribute('href') ?? '';

    // The whole point: sign-in returns you to where you were, not to the app.
    expect(new URL(href).searchParams.get('returnTo')).toBe(window.location.href);
  });

  it('routes through the app rather than straight to Kratos', async () => {
    respondWith(401, {});
    renderItem();

    const href = (await screen.findByRole('link', { name: 'Login' })).getAttribute('href') ?? '';

    // Going direct to id.driverforge.com is what dropped returnTo entirely.
    expect(href).not.toContain('id.driverforge.com');
  });

  it('omits returnTo before hydration, when there is no current URL', () => {
    isBrowser = false;
    respondWith(401, {});
    renderItem();

    // Still a usable sign-in link, just without the deep link.
    const link = screen.getByRole('link', { name: 'Login' });
    expect(link).toHaveAttribute('href', `${APP}/auth/login`);
  });

  it('shows the dashboard to a signed-in reader', async () => {
    respondWith(200, signedIn);
    renderItem();

    const link = await screen.findByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('href', APP);
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
  });

  it('treats a signed-in reader with no projects as signed in', async () => {
    // Authenticated, just not onboarded — inviting them to sign in again is
    // the confusing case this exists to remove.
    respondWith(200, { projects: [] });
    renderItem();

    expect(await screen.findByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('shows sign-in while the session is still resolving', () => {
    // The provider starts at `loading` on both server and first client render.
    // Rendering the signed-out link there is what keeps hydration consistent.
    respondWith(200, signedIn);
    renderItem();

    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  it('falls back to sign-in when the session cannot be loaded', async () => {
    respondWith(500, {});
    renderItem();

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument(),
    );
  });
});
