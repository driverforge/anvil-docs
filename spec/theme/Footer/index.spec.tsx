import React from 'react';
import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';

import { siteCopyright } from '../../../src/site-chrome';

mock.module('@docusaurus/theme-common', () => ({
  useThemeConfig: () => ({ footer: { copyright: siteCopyright(2026) } }),
}));
mock.module('@docusaurus/useBaseUrl', () => ({ default: (path: string) => path }));
mock.module('@docusaurus/Link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const Footer = require('../../../src/theme/Footer').default;

describe('Footer', () => {
  it('renders the brand lockup and the docs blurb', () => {
    render(<Footer />);

    expect(screen.getByRole('img', { name: 'Driverforge' })).toBeInTheDocument();
    expect(screen.getByText(/Guides and reference for Anvil/)).toBeInTheDocument();
  });

  it('renders the classified column, then Developers, Company, Legal and Connect', () => {
    render(<Footer />);

    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Something new, coming soonSoon',
      'Developers',
      'Company',
      'Legal',
      'Connect',
    ]);
    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveAttribute(
      'href',
      'https://driverforge.canny.io/',
    );
  });

  it('draws the classified column as redaction bars: three links home, of different lengths', () => {
    const { container } = render(<Footer />);

    const links = screen.getAllByRole('link', { name: 'Coming soon' });
    expect(links).toHaveLength(3);
    for (const link of links) expect(link).toHaveAttribute('href', 'https://driverforge.com');
    const widths = links.map(
      (link) => (link.querySelector('.df-redacted__bar') as HTMLElement).style.width,
    );
    expect(new Set(widths).size).toBe(3);
    expect(container.textContent?.toLowerCase()).not.toContain('marketplace');
  });

  it('keeps the cookie preferences trigger and the shared copyright line', () => {
    render(<Footer />);

    expect(screen.getByRole('button', { name: 'Cookie preferences' })).toHaveAttribute(
      'data-cc',
      'show-preferencesModal',
    );
    expect(
      screen.getByText('Copyright © 2026 Driverforge Pty Ltd. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it("links the classified heading's Soon stamp to the song, in a new tab", () => {
    render(<Footer />);

    const stamp = screen.getByRole('link', { name: 'Soon (a song on YouTube)' });
    expect(stamp).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=9x5WY_jmsko&list=RD9x5WY_jmsko',
    );
    expect(stamp).toHaveAttribute('target', '_blank');
    expect(stamp).toHaveAttribute('rel', 'noopener noreferrer');
    expect(stamp).toHaveClass('df-redacted__stamp');
  });
});
