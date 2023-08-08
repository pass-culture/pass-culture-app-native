const base = require('./jest.config')
const { excludeCollectCoverageFrom } = require('./jest.excludeCollectCoverageFrom.config')

module.exports = {
  ...base,
  preset: '',
  testEnvironment: 'jest-environment-jsdom',
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-web.js',
  setupFiles: [...base.setupFiles, '<rootDir>/jest/jest.web.setup.ts'],
  setupFilesAfterEnv: [...base.setupFilesAfterEnv, '<rootDir>/jest/jest.web.setupAfterEnv.ts'],
  testMatch: ['**/*(?<!.(?:native|ios|android|perf)).(?:test|spec).[jt]s?(x)'],
  moduleFileExtensions: ['web.tsx', 'web.ts', 'web.js', 'web.jsx', ...base.moduleFileExtensions],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^react-native$': 'react-native-web',
    '^react-native-svg$': 'react-native-svg-web',
    '^react-native-linear-gradient$': 'react-native-web-linear-gradient',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.ts',

    // temporary mock things until implemented
    'react-native-fast-image': '<rootDir>/__mocks__/fragmentMock.ts',
  },
  collectCoverageFrom: ['src/**/*.web.{js,jsx,ts,tsx}', ...excludeCollectCoverageFrom],
  testPathIgnorePatterns: [
    ...base.testPathIgnorePatterns,
    '.*(/tests?/.*.(native|ios|android).(test|spec)).(tsx?)$',
  ],
  transform: { ...base.transform },
  transformIgnorePatterns: [
    'node_modules/(?!' +
      'firebase' +
      '|@firebase' +
      '|@ptomasroos/react-native-multi-slider' +
      '|react-native-svg-web' +
      '|react-native-animatable' +
      '|react-native-web' +
      '|react-native-modal' +
      '|react-native-calendars' +
      '|react-native-swipe-gestures' +
      '|react-native-permissions' +
      '|react-native-qrcode-svg' +
      '|react-native-country-picker-modal' +
      '|instantsearch.js' +
      ')',
  ],
  verbose: true,
  globals: {
    __DEV__: true,
  },
}
