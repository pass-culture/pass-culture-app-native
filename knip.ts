import type { KnipConfig } from './node_modules/knip'

const isProduction = process.env.NODE_ENV === 'production'

const defaultConfig: KnipConfig = {
  entry: ['index.js!', 'src/index.tsx!', 'server/src/index.ts!'],
  project: ['src/**/*.{ts,tsx}!'], // if you change this line, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
  ignore: [
    'src/**/*.stories.old.tsx', // TODO(PC-35376): should delete this line
    'src/features/bookings/components/BookingListItem.tsx', // TODO(PC-35897): remove
    'src/features/bookings/components/BookingListItemLabel.tsx', // TODO(PC-35897): remove
    'src/ui/designSystem/Banner/**', // TODO(PC-38130): remove
    'src/ui/designSystem/RadioButton/**', // TODO(PC-37009): remove
    'src/ui/designSystem/RadioButtonGroup/**', // TODO(PC-37009): remove
    'src/ui/svg/CutoutVertical.tsx', // TODO(PC-35897): remove
    'src/ui/svg/StrokeVertical.tsx', // TODO(PC-35897): remove
    'src/ui/designSystem/Snackbar/**', // TODO(PC-39606): remove
    // TODO(PC-36439): should delete those lines
    'src/features/bookings/queries/useOngoingOrEndedBookingQuery.ts',
    'src/queries/bookings/useUserHasBookingsQuery.ts',
    'src/**/*.ios.*',
    '.storybook/**/*',
    'src/**/*.android.*',
    'src/**/*.web.*',
    'src/api/gen/**',
    'src/**/fixtures/**',
    'src/**/__mocks__/**',
    'src/features/offerRefacto/**',
    'src/shared/useABSegment/**',
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
    '!src/**/{tests,storybook,__tests__}/**/*.{ts,tsx}',
    '!src/**/*.{test, stories}.{ts,tsx}',
  ],
  ignore: [
    ...(defaultConfig.ignore || []),
    'src/features/bookings/components/Ticket/ControlComponent.tsx',
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
