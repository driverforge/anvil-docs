import '@testing-library/jest-dom';

// Mirror what docusaurus-plugin-dotenv injects at build time.
process.env.APP_URL = 'https://app.driverforge.test';
