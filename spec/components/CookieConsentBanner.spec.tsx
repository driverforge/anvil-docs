import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as CookieConsent from 'vanilla-cookieconsent';
import { CookieConsentBanner } from '../../src/components/CookieConsentBanner';
import { cookieConsentConfig } from '../../src/lib/cookieConsentConfig';

jest.mock('vanilla-cookieconsent', () => ({
  run: jest.fn().mockResolvedValue(undefined),
}));

const runMock = CookieConsent.run as jest.Mock;

describe('CookieConsentBanner.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('cc--darkmode');
  });

  it('runs the plugin with the docs config', () => {
    render(<CookieConsentBanner />);
    expect(runMock).toHaveBeenCalledWith(cookieConsentConfig);
  });

  it('enables the plugin dark theme when data-theme is dark', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<CookieConsentBanner />);
    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(true);
  });

  it('leaves the plugin light theme when data-theme is light', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    render(<CookieConsentBanner />);
    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(false);
  });

  it('follows theme changes after mount', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    render(<CookieConsentBanner />);

    document.documentElement.setAttribute('data-theme', 'dark');
    await waitFor(() =>
      expect(document.documentElement.classList.contains('cc--darkmode')).toBe(true)
    );

    document.documentElement.setAttribute('data-theme', 'light');
    await waitFor(() =>
      expect(document.documentElement.classList.contains('cc--darkmode')).toBe(false)
    );
  });

  it('stops following theme changes after unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { unmount } = render(<CookieConsentBanner />);
    unmount();

    document.documentElement.setAttribute('data-theme', 'dark');
    // Flush any pending MutationObserver microtasks.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(false);
  });
});
