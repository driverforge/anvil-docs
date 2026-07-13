import type { Translation } from 'vanilla-cookieconsent';
import {
  cookieConsentConfig,
  PRIVACY_URL,
  TERMS_URL,
} from '../../src/lib/cookieConsentConfig';

const en = cookieConsentConfig.language.translations.en as Translation;

describe('cookieConsentConfig.ts', () => {
  it('marks the necessary category as always-on and read-only', () => {
    expect(cookieConsentConfig.categories.necessary).toEqual({
      enabled: true,
      readOnly: true,
    });
  });

  it('keeps analytics opt-in (disabled by default, not read-only)', () => {
    const analytics = cookieConsentConfig.categories.analytics;
    expect(analytics).toBeDefined();
    expect(analytics.enabled).toBeUndefined();
    expect(analytics.readOnly).toBeUndefined();
  });

  it('gives Reject all equal weight with Accept all (CNIL/EDPB guidance)', () => {
    expect(cookieConsentConfig.guiOptions?.consentModal?.equalWeightButtons).toBe(true);
    expect(cookieConsentConfig.guiOptions?.preferencesModal?.equalWeightButtons).toBe(true);
  });

  it('links the driverforge.com privacy and terms pages from the consent modal footer', () => {
    expect(PRIVACY_URL).toBe('https://driverforge.com/privacy');
    expect(TERMS_URL).toBe('https://driverforge.com/terms');
    const footer = en.consentModal.footer;
    expect(footer).toContain(`href="${PRIVACY_URL}"`);
    expect(footer).toContain(`href="${TERMS_URL}"`);
  });

  it('links each category to a toggle section in the preferences modal', () => {
    const sections = en.preferencesModal.sections;
    const linked = sections.map((s) => s.linkedCategory).filter(Boolean);
    expect(linked).toEqual(['necessary', 'analytics']);
  });
});
