import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.queryByText(/Download Driverforge SDK/)).not.toBeInTheDocument();
  });

  it('shows the download button when not in preview mode (even if anonymous)', () => {
    mockUseApiKey.mockReturnValue({
      state: { status: 'anonymous' },
      previewMode: false,
    });

    render(<DownloadSDK />);

    expect(screen.getByText(/Download Driverforge SDK/)).toBeInTheDocument();
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

describe('DownloadSDK / DownloadButton manifests', () => {
  const originalFetch = global.fetch;
  const RELEASES = 'https://releases.driverforge.com/driverforge-releases';

  // Serves a manifest only at the paths the release pipelines publish to.
  const manifests: Record<string, { version: string; artifacts: Array<{ name: string; url: string }> }> = {
    [`${RELEASES}/driverforge-sdk/latest/manifest.json`]: {
      version: '0.10.0',
      artifacts: [{ name: 'driverforge-sdk-0.10.0.zip', url: `${RELEASES}/driverforge-sdk/v0.10.0/driverforge-sdk-0.10.0.zip` }],
    },
    [`${RELEASES}/anvil-agent/latest/manifest.json`]: {
      version: '2026110701',
      artifacts: [{ name: 'anvil-agent-2026110701.zip', url: `${RELEASES}/anvil-agent/2026110701/anvil-agent-2026110701.zip` }],
    },
  };

  beforeEach(() => {
    mockUseApiKey.mockReturnValue({ state: { status: 'anonymous' }, previewMode: false });
    global.fetch = jest.fn((url: string) => {
      const manifest = manifests[url];
      return Promise.resolve({ ok: !!manifest, json: async () => manifest ?? null } as Response);
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('enables the SDK download from the published driverforge-sdk manifest', async () => {
    render(<DownloadSDK />);

    const link = await waitFor(() => screen.getByText('Download Driverforge SDK (v0.10.0)'));
    expect(link.getAttribute('href')).toBe(manifests[`${RELEASES}/driverforge-sdk/latest/manifest.json`].artifacts[0].url);
  });

  it('enables the agent download from the published anvil-agent manifest', async () => {
    render(<DownloadAgent />);

    const link = await waitFor(() => screen.getByText('Download Anvil Agent (v2026110701)'));
    expect(link.getAttribute('href')).toBe(manifests[`${RELEASES}/anvil-agent/latest/manifest.json`].artifacts[0].url);
  });
});
