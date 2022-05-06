import { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    coverageThreshold: {
      global: {
        branches: 66,
        functions: 95,
        lines: 92,
        statements: 92,
      },
    },
    setupFiles: ['<rootDir>/jest/jest.setup.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest/jest.setupFilesAfterEnv.ts'],
    testRegex: '.(?:test|spec).(?:tsx?|js)$',
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  }
}
