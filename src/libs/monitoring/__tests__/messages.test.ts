import { Severity } from '@sentry/react-native'

import { eventMonitoring } from 'libs/monitoring'

import { MonitoringMessage } from '../messages'

describe('MonitoringMessage', () => {
  const message = 'message'
  it('should call eventMonitoring.captureMessage() on new MonitoringMessage instance with default info level', () => {
    new MonitoringMessage(message)
    expect(eventMonitoring.captureMessage).toBeCalledWith(message, { level: Severity.Info })
  })
})
