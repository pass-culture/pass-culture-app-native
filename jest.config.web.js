// eslint-disable-next-line @typescript-eslint/no-var-requires
const nativeJestConfig = require('./jest.config')

module.exports = {
  ...nativeJestConfig,
  preset: 'react-native-web',
  testEnvironment: 'jsdom',
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-web.js',
  testRegex: '.(?:test|spec)(?:.web)?.(?:tsx?|js)$',
  moduleFileExtensions: ['web.tsx', 'web.ts', ...nativeJestConfig.moduleFileExtensions],
  moduleNameMapper: {
    ...nativeJestConfig.moduleNameMapper,
    '^react-native$': 'react-native-web',
    '^react-native-modal$': 'modal-enhanced-react-native-web',
    '^react-native-svg$': 'react-native-svg-web',
    '^lottie-react-native$': 'react-native-web-lottie',
  },
  collectCoverageFrom: [...nativeJestConfig.collectCoverageFrom, '!**/*.(native|ios|android).*'],
  testPathIgnorePatterns: [
    ...nativeJestConfig.testPathIgnorePatterns,
    '.*(/tests?/.*.(test|spec)).(native|ios|android).(tsx?)$',
  ],
  transform: {
    ...nativeJestConfig.transform,
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  globals: {
    __DEV__: true,
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
    },
  },
}
