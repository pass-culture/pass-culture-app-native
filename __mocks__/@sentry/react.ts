import * as ActualSentryModule from '@sentry/react'

const MockedSentryModule = jest.genMockFromModule<typeof ActualSentryModule>('@sentry/react')

module.exports = {
  ...MockedSentryModule,
}
