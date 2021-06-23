// eslint-disable-next-line @typescript-eslint/no-var-requires
const nativeJestConfig = require('./jest.config')

module.exports = {
  ...nativeJestConfig,
  snapshotResolver: '<rootDir>/jest/custom-snapshot-resolver-web.ts',
}
