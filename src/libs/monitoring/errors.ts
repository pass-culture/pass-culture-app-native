import { t } from '@lingui/macro'
import { CaptureContext } from '@sentry/types'
import { ComponentType } from 'react'

import { eventMonitoring } from 'libs/monitoring/services'

export class MonitoringError extends Error {
  constructor(message: string, name?: string | CaptureContext, captureContext?: CaptureContext) {
    super(message)
    let ctx = captureContext
    if (name && typeof name === 'string') {
      this.name = name
    } else if (name) {
      ctx = name as CaptureContext
    }
    eventMonitoring.captureException(this, ctx)
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

export class OfferNotFoundError extends MonitoringError {
  constructor(offerId: number | undefined, captureContext?: CaptureContext) {
    const message = offerId ? t`Offer ${offerId} could not be retrieved` : t`offerId is undefined`
    const name = 'OfferNotFoundError'
    super(message, name, captureContext)
  }
}

export type ScreenErrorProps = {
  resetErrorBoundary: () => void
}

export class ScreenError extends Error {
  Screen: ComponentType<ScreenErrorProps>
  constructor(message: string, Screen: ComponentType<ScreenErrorProps>) {
    super(message)
    this.Screen = Screen
  }
}

ScreenError.prototype.name = 'ScreenError'
