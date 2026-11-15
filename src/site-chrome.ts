/**
 * The shared driverforge.com header and footer content, for the docs site.
 *
 * The other public properties render this from Driverforge's UI kit. The docs
 * site can't import the kit, so it keeps this copy, which the Driverforge
 * monorepo checks against the kit's. Change it there and here
 * together.
 */

export const SITE_URLS = {
  home: 'https://driverforge.com',
  anvil: 'https://driverforge.com/anvil',
  blog: 'https://driverforge.com/blog',
  docs: 'https://docs.driverforge.com',
  roadmap: 'https://driverforge.canny.io/',
  contact: 'https://driverforge.com/contact',
  privacy: 'https://driverforge.com/privacy',
  terms: 'https://driverforge.com/terms',
  github: 'https://github.com/driverforge',
  youtube: 'https://www.youtube.com/@driverforge',
  support: 'mailto:support@driverforge.com',
  whatsNew: 'https://driverforge.canny.io/changelog',
  feedback: 'https://driverforge.canny.io/feature-requests',
  // The footer's Soon stamp links here: Ob-La-Di, Ob-La-Da ("Desmond has a
  // barrow in the marketplace").
  soonSong: 'https://www.youtube.com/watch?v=9x5WY_jmsko&list=RD9x5WY_jmsko',
  login: 'https://id.driverforge.com/login',
  waitlist: 'https://driverforge.com/anvil/#waitlist',
} as const;

export interface SiteFooterLink {
  label: string;
  href: string;
  /**
   * Drawn as a redaction bar this many characters wide; `label` stays as its
   * accessible name. For the marketplace, until it launches.
   */
  redactedWidth?: number;
}

export interface SiteFooterLinkColumn {
  heading: string;
  /**
   * Draws the heading as a redaction bar this many characters wide, stamped
   * Soon; `heading` stays for screen readers.
   */
  redactedWidth?: number;
  links: SiteFooterLink[];
  /** Ends the column with the cookie-preferences action. */
  cookiePreferences?: boolean;
}

const COMING_SOON = 'Coming soon';

/** A docs section's landing page. */
const docsSection = (section: string) => `${SITE_URLS.docs}/${section}/overview/`;

/** The footer's link columns. Company ends with the cookie-preferences action. */
export const SITE_FOOTER_COLUMNS: SiteFooterLinkColumn[] = [
  // The marketplace, unnamed until it launches: a redacted heading stamped
  // Soon over four redacted links home, of different lengths. At launch it
  // becomes a real column, or a { label: 'Marketplace' } link in Developers.
  {
    heading: 'Something new, coming soon',
    redactedWidth: 9,
    links: [
      { label: COMING_SOON, href: SITE_URLS.home, redactedWidth: 10 },
      { label: COMING_SOON, href: SITE_URLS.home, redactedWidth: 7 },
      { label: COMING_SOON, href: SITE_URLS.home, redactedWidth: 12 },
      { label: COMING_SOON, href: SITE_URLS.home, redactedWidth: 8 },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Anvil', href: SITE_URLS.anvil },
      { label: 'SDK', href: docsSection('sdk') },
      { label: 'CLI', href: docsSection('cli') },
      { label: 'CI/CD', href: docsSection('cicd') },
      { label: 'Coding Agents', href: docsSection('coding-agents') },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Docs', href: SITE_URLS.docs },
      { label: "What's New", href: SITE_URLS.whatsNew },
      { label: 'Roadmap', href: SITE_URLS.roadmap },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Blog', href: SITE_URLS.blog },
      { label: 'Contact', href: SITE_URLS.contact },
      { label: 'Privacy', href: SITE_URLS.privacy },
      { label: 'Terms', href: SITE_URLS.terms },
    ],
    cookiePreferences: true,
  },
  {
    heading: 'Connect',
    links: [
      { label: 'GitHub', href: SITE_URLS.github },
      { label: 'YouTube', href: SITE_URLS.youtube },
      { label: 'Support', href: SITE_URLS.support },
      { label: 'Share Feedback', href: SITE_URLS.feedback },
    ],
  },
];

export const SITE_COPYRIGHT_HOLDER = 'Driverforge Pty Ltd';

/** The footer's one copyright line, the same on every property. */
export function siteCopyright(year = new Date().getUTCFullYear()): string {
  return `Copyright © ${year} ${SITE_COPYRIGHT_HOLDER}. All rights reserved.`;
}

export const SITE_WAITLIST_LABEL = 'Join the Anvil waitlist';

/** The docs site's footer blurb; the other properties each have their own. */
export const DOCS_BLURB =
  'Guides and reference for Anvil: the platform, CLI, SDK, agent and CI/CD.';
