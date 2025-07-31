import * as ActualSentryModule from '@sentry/react-native'

const MockedSentryModule =
  jest.createMockFromModule<typeof ActualSentryModule>('@sentry/react-native')

module.exports = {
  ...MockedSentryModule,
}
