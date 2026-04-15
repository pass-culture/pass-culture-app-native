const base = require('./jest.config')
const { excludeCollectCoverageFrom } = require('./jest.excludeCollectCoverageFrom.config')

module.exports = {
  ...base,
  preset: 'react-native',
  testEnvironment: 'node',
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.ts'],
  testMatch: ['**/*.test.ts'],
  globals: {
    __DEV__: true,
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    'eslint-custom-rules/*.{js,ts}',
    ...excludeCollectCoverageFrom,
  ],
}