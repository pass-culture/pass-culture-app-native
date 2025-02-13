import type { KnipConfig } from './node_modules/knip'

const config: KnipConfig = {
  entry: ['index.js', 'src/index.tsx', 'server/src/index.ts'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    'src/**/*.ios.*',
    'src/**/*.android.*',
    'src/**/*.web.*',
    'src/api/gen/**',
    'src/**/fixtures/**',
    'src/**/__mocks__/**',
  ],
  ignoreDependencies: ['@sentry/vite-plugin'],
  rules: {
    dependencies: 'off',
    binaries: 'off',
    unresolved: 'off',
    unlisted: 'off',
  },
}

export default config
