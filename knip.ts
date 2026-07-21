import type { KnipConfig } from './node_modules/knip'

const isProduction = process.env.NODE_ENV === 'production'

const defaultConfig: KnipConfig = {
  entry: ['src/index.tsx!', 'server/src/index.ts!', 'src/tests/setupTests.js!'],
  project: ['src/**/*.{ts,tsx}!'], // if you change this line, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
  ignore: [
    // setup
    'src/**/*.web.*',
    'src/api/gen/**',
    'src/**/fixtures/**',
    'src/tests/utils/web.tsx',
    // temporary ignore
    'src/**/*.stories.old.tsx', // TODO(PC-35376): should delete this line
    'src/ui/designSystem/RadioButton/**', // TODO(PC-37009): remove
  ],
  ignoreDependencies: ['@sentry/vite-plugin'],
  rules: {
    dependencies: 'off',
    binaries: 'off',
    unresolved: 'off',
    unlisted: 'off',
  },
}

const productionConfig: KnipConfig = {
  ...defaultConfig,
  project: [
    'src/**/*.{ts,tsx}!',
    '!src/**/*[fF]ixture*.{ts,tsx}',
    '!src/**/*.{test, stories}.{ts,tsx}',
  ],
  ignore: [
    ...(defaultConfig.ignore || []),
    'src/types.ts',
    'src/**/tests/**/*',
    'src/**/storybook/**/*',
    'src/shared/useABSegment/**/*',
  ],
  rules: {
    dependencies: 'off',
    binaries: 'off',
    unresolved: 'off',
    unlisted: 'off',
    types: 'off',
    exports: 'off',
    enumMembers: 'off',
  },
}

const config = isProduction ? productionConfig : defaultConfig

export default config
