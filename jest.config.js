module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest/jest.setup.js', './node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['./src/tests/setupTests.js'],
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-navigation|react-navigation|@react-native-community/masked-view|@sentry/react-native|react-native-geolocation-service/async-storage/(?!(lib)))',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  cacheDirectory: '.jest/cache',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/environment', '/src/locales'],
  collectCoverage: false,
}
