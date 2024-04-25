const { excludeCollectCoverageFrom } = require('./jest.excludeCollectCoverageFrom.config')
const fs = require("node:fs");
const swcrc = JSON.parse(fs.readFileSync(".swcrc", "utf8"));

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^api(.*)$': '<rootDir>/src/api$1',
    '^features(.*)$': '<rootDir>/src/features$1',
    '^fixtures(.*)$': '<rootDir>/src/fixtures$1',
    '^libs(.*)$': '<rootDir>/src/libs$1',
    '^shared(.*)$': '<rootDir>/src/shared$1',
    '^theme(.*)$': '<rootDir>/src/theme$1',
    '^types(.*)$': '<rootDir>/src/types$1',
    '^tests(.*)$': '<rootDir>/src/tests$1',
    '^ui(.*)$': '<rootDir>/src/ui$1',
    '^web/(.*)$': '<rootDir>/src/web/$1',
    '^__mocks__(.*)$': '<rootDir>/__mocks__$1',
  },
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-native.js',
  setupFiles: [
    '<rootDir>/jest/jest.setup.ts',
    'react-native-gesture-handler/jestSetup.js',
    '@react-native-google-signin/google-signin/jest/build/setup.js',
  ],
  setupFilesAfterEnv: ['./src/tests/setupTests.js'],
  transform: {
    '^.+/((@)?react-native)/.+\\.(js|jsx)$': 'babel-jest',
    '^.+/react-native-linear-gradient/.+\\.(js|jsx)$': 'babel-jest',
    '^.+/react-native-maps/.+\\.(js|jsx)$': 'babel-jest',
    '^.+/src/ui/components/touchableLink/ExternalTouchableLink.tsx$': 'babel-jest',
    '^.+src/ui/components/SectionRow.tsx$': 'babel-jest',
    '^.+\\.(js|ts|jsx|tsx)$': ["@swc/jest", swcrc],
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
    '!src/**/*.web.{js,jsx,ts,tsx}',
    ...excludeCollectCoverageFrom,
  ],
  coveragePathIgnorePatterns: ['\\.web\\.(test|spec)', '/node_modules/', '/src/environment'],
  collectCoverage: false,
  // TODO(PC-20887): Investigate how to avoid timeouts in CI without increasing default timeout
  testTimeout: 10_000,
}
