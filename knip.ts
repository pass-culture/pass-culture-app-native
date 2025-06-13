import type { KnipConfig } from './node_modules/knip'

const isProduction = process.env.NODE_ENV === 'production'

const defaultConfig: KnipConfig = {
  entry: ['index.js!', 'src/index.tsx!', 'server/src/index.ts!'],
  project: ['src/**/*.{ts,tsx}!'], // if you change this line, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
  ignore: [
    // PC-35376 - should delete this line
    'src/**/*.stories.old.tsx',
    // PC-36439 - should delete those lines
    'src/features/bookings/queries/useOngoingOrEndedBookingQuery.ts',
    'src/queries/bookings/useUserHasBookingsQuery.ts',
    'src/**/*.ios.*',
    '.storybook/**/*',
    'src/**/*.android.*',
    'src/**/*.web.*',
    'src/api/gen/**',
    'src/**/fixtures/**',
    'src/**/__mocks__/**',
    'src/features/bookings/components/BookingListItem.tsx', // TODO(PC-35897): remove
    'src/features/bookings/components/BookingListItemLabel.tsx', // TODO(PC-35897): remove
    'src/features/navigation/CheatcodesStackNavigator/CheatcodesStackNavigatorConfig.tsx', // PC-35664
    'src/features/navigation/RootNavigator/types.ts', // PC-35664
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
    '!src/**/{tests,storybook}/**/*.{ts,tsx}',
    '!src/**/*.{test, stories}.{ts,tsx}',
  ],
  ignore: [
    ...(defaultConfig.ignore || []),
    'src/features/bookings/components/Ticket/ControlComponent.tsx',
    'src/libs/tick.ts', // only used in a codepush button appearing in cheatcodes, should be deleted soon
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
