import { Severity } from '@sentry/react-native'

import { eventMonitoring } from 'libs/monitoring/services'

export class MonitoringMessage {
  constructor(message: string) {
    eventMonitoring.captureMessage(message, { level: Severity.Info })
  }
}
