import { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    coverageThreshold: {
      global: {
        branches: 96,
        functions: 100,
        lines: 98,
        statements: 98,
      },
    },
    setupFiles: ['<rootDir>/jest/jest.setup.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest/jest.setupFilesAfterEnv.ts'],
    testRegex: '.(?:test|spec).(?:tsx?|js)$',
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  }
}
