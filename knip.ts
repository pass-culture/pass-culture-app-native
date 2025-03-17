import type { KnipConfig } from './node_modules/knip'

const config: KnipConfig = {
  entry: ['index.js', 'src/index.tsx', 'server/src/index.ts'],
  project: ['src/**/*.{ts,tsx}'], // if you change this line, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
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
