// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('./jest.config')

module.exports = {
  ...base,
  preset: 'react-native-web',
  testEnvironment: 'jest-environment-jsdom',
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-web.js',
  setupFiles: ['react-native-web/jest/setup.js', ...base.setupFiles],
  testRegex: '.(?:test|spec)(?:.web)?.(?:tsx?|js)$',
  moduleFileExtensions: ['web.tsx', 'web.ts', 'web.js', 'web.jsx', ...base.moduleFileExtensions],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^react-native$': 'react-native-web',
    '^react-native-modal$': 'modal-enhanced-react-native-web',
    '^react-native-svg$': 'react-native-svg-web',
    '^lottie-react-native$': 'react-native-web-lottie',
    '^react-native-linear-gradient$': 'react-native-web-linear-gradient',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.ts',

    // temporary mock things until implemented
    'react-native-dash': '<rootDir>/__mocks__/fragmentMock.ts',
    'react-native-fast-image': '<rootDir>/__mocks__/fragmentMock.ts',
  },
  collectCoverageFrom: [...base.collectCoverageFrom, '!**/*.(native|ios|android).*'],
  testPathIgnorePatterns: [
    ...base.testPathIgnorePatterns,
    '.*(/tests?/.*.(test|spec)).(native|ios|android).(tsx?)$',
  ],
  transform: {
    ...base.transform,
  },
  verbose: true,
  globals: {
    __DEV__: true,
  },
}
