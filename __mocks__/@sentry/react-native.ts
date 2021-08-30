import * as ActualSentryModule from '@sentry/react-native'

const MockedSentryModule = jest.genMockFromModule<typeof ActualSentryModule>('@sentry/react-native')

module.exports = {
  ...MockedSentryModule,
}
