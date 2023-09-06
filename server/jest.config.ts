import { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
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
    testEnvironment: '@happy-dom/jest-environment',
  }
}
