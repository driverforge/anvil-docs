import React, { useEffect, useState } from 'react';
import { useApiKey } from './ApiKeyProvider';
import { buildSignInUrl } from '../lib/apiKey';

const RELEASES_BASE =
  'https://releases.driverforge.com/driverforge-releases';

const APP_URL = process.env.APP_URL || 'https://app.driverforge.dev';

interface Manifest {
  version: string;
  artifacts: Array<{ name: string; url: string }>;
}

function DownloadButton({ label, manifestPath }: { label: string; manifestPath: string }) {
  const { state, previewMode } = useApiKey();
  const [manifest, setManifest] = useState<Manifest | null>(null);

  useEffect(() => {
    fetch(`${RELEASES_BASE}/${manifestPath}/latest/manifest.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setManifest(data))
      .catch(() => undefined);
  }, [manifestPath]);

  // Invite-only preview: gate downloads behind sign-in. Anonymous visitors get a
  // sign-in prompt instead of the download button. Once preview ends (previewMode
  // false) downloads are open to everyone again.
  if (previewMode && state.status === 'anonymous') {
    const currentUrl =
      typeof window !== 'undefined' ? window.location.href : '/';
    return (
      <a className="button button--primary" href={buildSignInUrl(APP_URL, currentUrl)}>
        Sign in to download
      </a>
    );
  }

  const downloadUrl = manifest?.artifacts[0]?.url;
  const versionLabel = manifest ? ` (v${manifest.version})` : '';

  return (
    <a
      href={downloadUrl ?? '#'}
      download={!!downloadUrl}
      className="button button--primary"
      style={{ pointerEvents: downloadUrl ? 'auto' : 'none', opacity: downloadUrl ? 1 : 0.7 }}
    >
      {label}{versionLabel}
    </a>
  );
}

export default function DownloadSDK() {
  return <DownloadButton label="Download Anvil SDK" manifestPath="anvil-sdk" />;
}

export function DownloadAgent() {
  return <DownloadButton label="Download Anvil Agent" manifestPath="anvil-agent" />;
}
