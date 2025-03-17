const { excludeCollectCoverageFrom } = require('./jest.excludeCollectCoverageFrom.config')

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
    'android.tsx',
    'android.ts',
    'android.jsx',
    'android.js',
  ],
  testEnvironment: process.env.RUN_ALLURE === 'true' ? 'allure-jest/node' : undefined,
  testEnvironmentOptions: { customExportConditions: [''] },
  moduleNameMapper: {
    // if you change those lines, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
    '^__mocks__(.*)$': '<rootDir>/__mocks__$1',
    '^api(.*)$': '<rootDir>/src/api$1',
    '^cheatcodes(.*)$': '<rootDir>/src/cheatcodes$1',
    '^features(.*)$': '<rootDir>/src/features$1',
    '^fixtures(.*)$': '<rootDir>/src/fixtures$1',
    '^libs(.*)$': '<rootDir>/src/libs$1',
    '^queries(.*)$': '<rootDir>/src/queries$1',
    '^shared(.*)$': '<rootDir>/src/shared$1',
    '^tests(.*)$': '<rootDir>/src/tests$1',
    '^theme(.*)$': '<rootDir>/src/theme$1',
    '^types(.*)$': '<rootDir>/src/types$1',
    '^ui(.*)$': '<rootDir>/src/ui$1',
  },
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-native.js',
  setupFiles: [
    '<rootDir>/jest/jest.setup.ts',
    'react-native-gesture-handler/jestSetup.js',
    '@react-native-google-signin/google-signin/jest/build/setup.js',
  ],
  setupFilesAfterEnv: ['./src/tests/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-navigation' +
      '|@react-native' +
      '|@ptomasroos/react-native-multi-slider' +
      '|react-navigation' +
      '|@react-native-firebase/analytics' +
      '|@react-native-firebase/app' +
      '|@react-native-firebase/remote-config' +
      '|@sentry/react-native' +
      '|react-native-geolocation-service' +
      '|instantsearch.js' +
      '/(?!(lib)))',
  ],
  testMatch: ['**/*(?<!.(web|perf)).(?:test|spec).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '\\.snap$',
    '\\.native-snap$',
    '\\.web-snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/server/',
  ],
  cacheDirectory: '.jest/cache',
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'eslint-custom-rules/*.{js,jsx,ts,tsx}',
    '!src/**/*.web.{js,jsx,ts,tsx}',
    ...excludeCollectCoverageFrom,
  ],
  coveragePathIgnorePatterns: ['\\.web\\.(test|spec)', '/node_modules/', '/src/environment'],
  collectCoverage: false,
  // TODO(PC-20887): Investigate how to avoid timeouts in CI without increasing default timeout
  testTimeout: 10_000,
}
