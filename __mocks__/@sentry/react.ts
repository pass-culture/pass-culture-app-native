import * as ActualSentryModule from '@sentry/react'

const MockedSentryModule = jest.createMockFromModule<typeof ActualSentryModule>('@sentry/react')

module.exports = {
  ...MockedSentryModule,
}
