import { CaptureContext } from '@sentry/types'
import { ComponentType } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { eventMonitoring } from 'libs/monitoring/services'

export class MonitoringError extends Error {
  constructor(
    message: string,
    name?: string | CaptureContext | boolean,
    captureContext?: CaptureContext | boolean
  ) {
    super(message)
    let skipLogging = false
    let ctx = captureContext

    if (name && typeof name === 'string') {
      this.name = name
    } else if (name && typeof name === 'boolean') {
      skipLogging = name
    } else if (name) {
      ctx = name as CaptureContext
    }
    if (typeof captureContext === 'boolean' && !skipLogging) {
      skipLogging = true
    }

    if (!skipLogging) {
      eventMonitoring.captureException(this, ctx as CaptureContext)
    }
  }
}

MonitoringError.prototype.name = 'MonitoringError'

export const captureMonitoringError = (message: string, name?: string) => {
  class CaptureError extends Error {}
  CaptureError.prototype.name = name || 'MonitoringError'
  eventMonitoring.captureException(new CaptureError(message))
}

export class AsyncError extends MonitoringError {
  retry?: () => Promise<unknown> | (() => void)
  constructor(
    message: string,
    retry?: () => Promise<unknown> | (() => void),
    name: string | CaptureContext = 'AsyncError',
    captureContext?: CaptureContext | boolean
  ) {
    super(message, name, captureContext)
    this.retry = retry
  }
}

export type ScreenErrorProps = {
  callback?: () => Promise<unknown> | (() => void)
} & FallbackProps

export class ScreenError extends AsyncError {
  Screen: ComponentType<ScreenErrorProps>
  constructor(
    message: string,
    Screen: ComponentType<ScreenErrorProps>,
    callback?: () => Promise<unknown> | (() => void),
    name?: string,
    skipLogging?: boolean
  ) {
    super(message, callback, name ?? 'ScreenError', skipLogging ?? false)
    this.Screen = Screen
  }
}

ScreenError.prototype.name = 'ScreenError'

export class OfferNotFoundError extends ScreenError {
  constructor(
    offerId: number | undefined,
    Screen: ComponentType<ScreenErrorProps>,
    callback?: () => void
  ) {
    const message = offerId ? `Offer ${offerId} could not be retrieved` : 'offerId is undefined'
    super(message, Screen, callback ? async () => callback() : undefined)
  }
}
export class VenueNotFoundError extends ScreenError {
  constructor(
    venueId: number | undefined,
    Screen: ComponentType<ScreenErrorProps>,
    callback?: () => void
  ) {
    const message = venueId ? `Venue ${venueId} could not be retrieved` : 'venueId is undefined'
    super(message, Screen, callback ? async () => callback() : undefined)
  }
}
