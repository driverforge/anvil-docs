import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

interface ScreenshotProps {
  name: string;
  alt: string;
}

export default function Screenshot({ name, alt }: ScreenshotProps) {
  const { colorMode } = useColorMode();
  const suffix = colorMode === 'dark' ? 'dark' : 'light';
  const src = `/img/platform/${name}-${suffix}.png`;

  const borderColor = colorMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        borderRadius: '8px',
        border: `2px solid ${borderColor}`,
      }}
      loading="lazy"
    />
  );
}
