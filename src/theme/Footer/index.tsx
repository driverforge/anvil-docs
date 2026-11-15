import React from 'react';
import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { DOCS_BLURB, SITE_FOOTER_COLUMNS, SITE_URLS } from '../../site-chrome';

/**
 * A redaction bar `width` characters wide, for something not yet named (the
 * marketplace). The bar is decorative. With `stampHref` the stamp links out
 * (new tab), looking the same at rest and going YouTube red on hover.
 */
function Redacted({
  width,
  stamp,
  stampHref,
  stampLabel,
}: {
  width: number;
  stamp?: string;
  stampHref?: string;
  stampLabel?: string;
}): React.JSX.Element {
  return (
    <span className="df-redacted">
      <span className="df-redacted__bar" aria-hidden="true" style={{ width: `${width}ch` }} />
      {stamp &&
        (stampHref ? (
          <a
            className="df-redacted__stamp"
            href={stampHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={stampLabel}
          >
            {stamp}
          </a>
        ) : (
          <span className="df-redacted__stamp" aria-hidden="true">
            {stamp}
          </span>
        ))}
    </span>
  );
}

/**
 * The footer the public driverforge.com properties share, rebuilt for
 * Docusaurus because the docs site can't import the UI kit: the brand lockup
 * and blurb, the link columns from src/site-chrome.ts (redacted ones drawn as
 * bars), cookie preferences at the end of Company, and the copyright from
 * docusaurus.config.ts. Styled in src/css/site-chrome.css.
 */
export default function Footer(): React.JSX.Element | null {
  const { footer } = useThemeConfig();
  const tile = useBaseUrl('/img/logo-tile.svg');
  if (!footer) return null;

  return (
    <footer className="df-footer">
      <div className="df-footer__container">
        <div
          className="df-footer__grid"
          style={{ '--df-footer-columns': SITE_FOOTER_COLUMNS.length } as React.CSSProperties}
        >
          <div className="df-footer__brand">
            <span className="df-lockup" role="img" aria-label="Driverforge">
              <img className="df-lockup__tile" src={tile} alt="" aria-hidden="true" />
              <span className="df-lockup__word">Driverforge</span>
            </span>
            <p className="df-footer__blurb">{DOCS_BLURB}</p>
          </div>
          {SITE_FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} className="df-footer__column" aria-label={column.heading}>
              <h3 className="df-footer__heading">
                {column.redactedWidth ? (
                  <>
                    <span className="df-sr-only">{column.heading}</span>
                    <Redacted
                      width={column.redactedWidth}
                      stamp="Soon"
                      stampHref={SITE_URLS.soonSong}
                      stampLabel="Soon (a song on YouTube)"
                    />
                  </>
                ) : (
                  column.heading
                )}
              </h3>
              {column.links.map((link, index) => (
                <Link
                  key={`${link.href}-${index}`}
                  className="df-footer__link"
                  href={link.href}
                  aria-label={link.redactedWidth ? link.label : undefined}
                >
                  {link.redactedWidth ? <Redacted width={link.redactedWidth} /> : link.label}
                </Link>
              ))}
              {column.cookiePreferences && (
                <button
                  type="button"
                  className="footer__link-item footer__cookie-preferences"
                  data-cc="show-preferencesModal"
                >
                  Cookie Preferences
                </button>
              )}
            </nav>
          ))}
        </div>
        {footer.copyright && (
          <div className="df-footer__bottom">
            <p>{footer.copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
