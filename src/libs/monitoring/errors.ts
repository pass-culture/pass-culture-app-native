import { ScopeContext } from '@sentry/types'
import { ComponentType } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { eventMonitoring } from 'libs/monitoring/services'

type ErrorInfo = {
  name?: string
  captureContext?: Partial<ScopeContext>
  skipLogging?: boolean
  shouldCaptureAsInfo?: boolean
}

export class MonitoringError extends Error {
  constructor(
    message: string,
    { name, captureContext, skipLogging = false, shouldCaptureAsInfo }: ErrorInfo = {}
  ) {
    super(message)
    if (name) {
      this.name = name
    }

    if (shouldCaptureAsInfo) {
      eventMonitoring.captureMessage(this.message, 'info')
    }

    if (!skipLogging && !shouldCaptureAsInfo) {
      eventMonitoring.captureException(this, captureContext)
    }
  }
}

MonitoringError.prototype.name = 'MonitoringError'

export const captureMonitoringError = (message: string, name?: string) => {
  class CaptureError extends Error {}
  CaptureError.prototype.name = name || 'MonitoringError'
  eventMonitoring.captureException(new CaptureError(message))
}

type AsyncErrorInfo = ErrorInfo & {
  retry?: () => Promise<unknown> | void
}

export class AsyncError extends MonitoringError {
  retry?: () => Promise<unknown> | void
  constructor(
    message: string,
    { name = 'AsyncError', captureContext, retry, shouldCaptureAsInfo }: AsyncErrorInfo = {}
  ) {
    super(message, { name, captureContext, shouldCaptureAsInfo })
    this.retry = retry
  }
}

export type ScreenErrorProps = {
  callback?: () => Promise<unknown> | void
} & FallbackProps

type ScreenErrorInfo = ErrorInfo & {
  Screen: ComponentType<ScreenErrorProps>
  callback?: () => Promise<unknown> | void
  name?: string
}

export class ScreenError extends AsyncError {
  Screen: ComponentType<ScreenErrorProps>
  constructor(
    message: string,
    { name = 'ScreenError', Screen, skipLogging, shouldCaptureAsInfo }: ScreenErrorInfo
  ) {
    super(message, { name, skipLogging, shouldCaptureAsInfo })
    this.Screen = Screen
  }
}

ScreenError.prototype.name = 'ScreenError'

export class OfferNotFoundError extends ScreenError {
  constructor(
    offerId: number | undefined,
    { Screen, callback, shouldCaptureAsInfo }: ScreenErrorInfo
  ) {
    const message = offerId ? `Offer ${offerId} could not be retrieved` : 'offerId is undefined'
    super(message, { Screen, callback, shouldCaptureAsInfo })
  }
}

export class VenueNotFoundError extends ScreenError {
  constructor(venueId: number | undefined, { Screen, callback }: ScreenErrorInfo) {
    const message = venueId ? `Venue ${venueId} could not be retrieved` : 'venueId is undefined'
    super(message, { Screen, callback })
  }
}
