import type { CookieConsentConfig } from 'vanilla-cookieconsent';

export const PRIVACY_URL = 'https://driverforge.com/privacy';
export const TERMS_URL = 'https://driverforge.com/terms';

export const cookieConsentConfig: CookieConsentConfig = {
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {},
  },
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom left',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies',
          description:
            'We use a strictly necessary cookie to remember your consent choices. With your permission, we would also use analytics to understand how the docs are used.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          footer: `<a href="${PRIVACY_URL}">Privacy Policy</a> <a href="${TERMS_URL}">Terms &amp; Conditions</a>`,
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Your privacy choices',
              description:
                'We only enable optional analytics with your consent. You can change your choices at any time via the "Cookie preferences" link in the page footer.',
            },
            {
              title: 'Strictly necessary',
              description:
                'These cookies are essential for the site to function — including remembering the consent choices you make here — and cannot be disabled.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Analytics',
              description:
                'Helps us understand how visitors use the docs so we can improve them. The data is aggregated and not used to identify you.',
              linkedCategory: 'analytics',
            },
            {
              title: 'More information',
              description: `For any questions about our use of cookies, please email <a href="mailto:privacy@kmsgroup.com.au">privacy@kmsgroup.com.au</a> or see our <a href="${PRIVACY_URL}">Privacy Policy</a>.`,
            },
          ],
        },
      },
    },
  },
};
