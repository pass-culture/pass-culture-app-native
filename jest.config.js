module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest/jest.setup.ts', './node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['./src/tests/setupTests.js'],
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-navigation' +
      '|@ptomasroos/react-native-multi-slider' +
      '|react-navigation' +
      '|@react-native-community/masked-view' +
      '|@react-native-firebase/analytics' +
      '|@react-native-firebase/app' +
      '|@react-native-firebase/remote-config' +
      '|@sentry/react-native' +
      '|react-native-geolocation-service' +
      '|@pass-culture/id-check' +
      '/(?!(lib)))',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  cacheDirectory: '.jest/cache',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/environment', '/src/locales'],
  collectCoverage: false,
}
