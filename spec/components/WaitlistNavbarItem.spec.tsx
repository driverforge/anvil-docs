import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import WaitlistNavbarItem from '../../src/components/WaitlistNavbarItem';
import { ApiKeyProvider } from '../../src/components/ApiKeyProvider';

function respondWith(status: number, body: unknown) {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: status < 400, status, json: async () => body } as Response),
  ) as unknown as typeof fetch;
}

const withProject = {
  projects: [{ id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k' }],
};

function renderItem() {
  render(
    <ApiKeyProvider>
      <WaitlistNavbarItem />
    </ApiKeyProvider>,
  );
}

describe('WaitlistNavbarItem', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    window.localStorage.clear();
  });

  it('invites an anonymous reader to join the waitlist', async () => {
    respondWith(401, {});
    renderItem();

    const cta = await screen.findByRole('link', { name: 'Join the Waitlist' });
    expect(cta).toHaveAttribute('href', 'https://driverforge.com/anvil/#waitlist');
  });

  it('carries the classes the CTA styling keys off', async () => {
    // `.navbar__link.navbar-cta` in custom.css — load-bearing, not decorative.
    respondWith(401, {});
    renderItem();

    const cta = await screen.findByRole('link', { name: 'Join the Waitlist' });
    expect(cta).toHaveClass('navbar__link', 'navbar-cta');
  });

  it('hides from a signed-in reader, who already has an account', async () => {
    respondWith(200, withProject);
    renderItem();

    // Wait for the session to resolve, then confirm it stayed hidden.
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: 'Join the Waitlist' })).not.toBeInTheDocument(),
    );
  });

  it('hides from a signed-in reader who has not finished onboarding', async () => {
    // `no-projects` is still an account — the CTA offers one they have.
    respondWith(200, { projects: [] });
    renderItem();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.queryByRole('link', { name: 'Join the Waitlist' })).not.toBeInTheDocument();
  });

  it('renders nothing while the session is still resolving', () => {
    // Rendering the CTA and then removing it is more distracting than showing
    // it a beat late.
    respondWith(200, withProject);
    renderItem();

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('still invites a reader whose session could not be loaded', async () => {
    // A failed load is not evidence of an account; the CTA is the safe default.
    respondWith(500, {});
    renderItem();

    expect(await screen.findByRole('link', { name: 'Join the Waitlist' })).toBeInTheDocument();
  });
});
