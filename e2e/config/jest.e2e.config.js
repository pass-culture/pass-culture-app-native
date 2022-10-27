module.exports = {
  rootDir: '..',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.e2e.setupFilesAfterEnv.js'],
  testTimeout: 60000,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  }
}
