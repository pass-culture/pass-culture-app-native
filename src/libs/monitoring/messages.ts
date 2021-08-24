import { Severity } from '@sentry/react-native'

import { eventMonitoring } from 'libs/monitoring/services'

export class MonitoringMessage {
  constructor(message: string, messageLevel?: Severity) {
    eventMonitoring.captureMessage(message, { level: messageLevel || 'info' })
  }
}
