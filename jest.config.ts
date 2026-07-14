module.exports = {
  displayName: 'anvil-docs',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
          target: 'es2022',
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/anvil-docs',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/spec/**/*.spec.ts', '<rootDir>/spec/**/*.spec.tsx'],
  moduleNameMapper: {
    // CSS modules — proxy so any class name is accessible
    '\\.(css|less|scss)$': '<rootDir>/spec/__mocks__/styleMock.js',
    // Pin React to the docs workspace copy so @testing-library/react
    // and the provider see the same singleton. Without this, nested
    // workspace hoisting can produce two Reacts and `useState` is null.
    '^react$': '<rootDir>/node_modules/react',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
  },
};
