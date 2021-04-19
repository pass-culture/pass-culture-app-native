import { CaptureContext } from '@sentry/types'

import { errorMonitoring } from 'libs/errorMonitoring/services'

export class MonitoringError extends Error {
  constructor(message: string, name?: string | CaptureContext, captureContext?: CaptureContext) {
    super(message)
    let ctx = captureContext
    if (name && typeof name === 'string') {
      this.name = name
    } else if (name) {
      ctx = name as CaptureContext
    }
    errorMonitoring.captureException(this, ctx)
  }
}

MonitoringError.prototype.name = 'MonitoringError'

export class AsyncError extends MonitoringError {
  retry?: () => Promise<unknown>
  constructor(
    message: string,
    retry?: () => Promise<unknown>,
    name: string | CaptureContext = 'AsyncError',
    captureContext?: CaptureContext
  ) {
    super(message, name, captureContext)
    this.retry = retry
  }
}
