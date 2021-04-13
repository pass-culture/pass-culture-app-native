import { errorMonitoring } from 'libs/errorMonitoring/services'

export class MonitoringError extends Error {
  constructor(message: string, name?: string) {
    super(message)
    if (name) {
      this.name = name
    }
    errorMonitoring.captureException(this)
  }
}

MonitoringError.prototype.name = 'MonitoringError'
