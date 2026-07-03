import React from 'react';
import { render, screen } from '@testing-library/react';
import DownloadSDK, { DownloadAgent } from '../../src/components/DownloadSDK';

const mockUseApiKey = jest.fn();
jest.mock('../../src/components/ApiKeyProvider', () => ({
  useApiKey: () => mockUseApiKey(),
}));

describe('DownloadSDK / DownloadButton preview gating', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Manifest fetch — not the focus here; return no artifacts.
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: async () => null } as Response),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('shows a "Sign in to download" prompt during preview when anonymous', () => {
    mockUseApiKey.mockReturnValue({
      state: { status: 'anonymous' },
      previewMode: true,
    });

    render(<DownloadSDK />);

    const link = screen.getByText('Sign in to download');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('returnTo');
    expect(screen.queryByText(/Download Anvil SDK/)).not.toBeInTheDocument();
  });

  it('shows the download button when not in preview mode (even if anonymous)', () => {
    mockUseApiKey.mockReturnValue({
      state: { status: 'anonymous' },
      previewMode: false,
    });

    render(<DownloadSDK />);

    expect(screen.getByText(/Download Anvil SDK/)).toBeInTheDocument();
    expect(screen.queryByText('Sign in to download')).not.toBeInTheDocument();
  });

  it('shows the download button for a signed-in user during preview', () => {
    mockUseApiKey.mockReturnValue({
      state: { status: 'ready', projects: [], selectedProjectId: 'p-1' },
      previewMode: true,
    });

    render(<DownloadAgent />);

    expect(screen.getByText(/Download Anvil Agent/)).toBeInTheDocument();
    expect(screen.queryByText('Sign in to download')).not.toBeInTheDocument();
  });
});
