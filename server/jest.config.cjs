module.exports = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ['<rootDir>/jest/jest.setup.ts'],
  testRegex: '.(?:test|spec).(?:tsx?|js)$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|rettime|@open-draft|type-fest|headers-polyfill|strict-event-emitter|is-node-process|outvariant|until-async)/)',
  ],
  testEnvironment: 'node',
  testEnvironmentOptions: { settings: { fetch: { disableSameOriginPolicy: true } } },
}
