import { t } from '@lingui/macro'
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
  retry?: () => Promise<unknown> | (() => void)
} & FallbackProps

export class ScreenError extends AsyncError {
  Screen: ComponentType<ScreenErrorProps>
  constructor(
    message: string,
    Screen: ComponentType<ScreenErrorProps>,
    retry?: () => Promise<unknown> | (() => void)
  ) {
    const skipLogging = false
    super(message, retry, 'ScreenError', skipLogging)
    this.Screen = Screen
  }
}

ScreenError.prototype.name = 'ScreenError'

export class OfferNotFoundError extends ScreenError {
  constructor(
    offerId: number | undefined,
    Screen: ComponentType<ScreenErrorProps>,
    retry?: () => void
  ) {
    const message = offerId ? t`Offer ${offerId} could not be retrieved` : t`offerId is undefined`
    super(message, Screen, retry ? async () => retry() : undefined)
  }
}
