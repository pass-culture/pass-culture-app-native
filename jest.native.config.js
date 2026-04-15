const base = require('./jest.config')

module.exports = {
  ...base,
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-native.js',
  testMatch: ['**/*(?<!.(web|perf)).test.tsx'],
  testPathIgnorePatterns: [
    '\\.snap$',
    '\\.native-snap$',
    '\\.web-snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/server/',
    '\\.test\\.ts$',
  ],
}