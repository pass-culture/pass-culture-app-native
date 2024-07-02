import { ScopeContext } from '@sentry/types'
import { ComponentType } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { eventMonitoring } from 'libs/monitoring/services'

export enum LogTypeEnum {
  'INFO' = 'info',
  'ERROR' = 'error',
  'IGNORED' = 'ignored',
}

type ErrorInfo = {
  logType: LogTypeEnum
  name?: string
  captureContext?: Partial<ScopeContext>
}

export class MonitoringError extends Error {
  constructor(
    message: string,
    { logType, name, captureContext }: ErrorInfo = { logType: LogTypeEnum.ERROR }
  ) {
    super(message)
    if (name) {
      this.name = name
    }

    if (logType === LogTypeEnum.INFO) {
      eventMonitoring.captureException(this.message, { level: logType })
    }

    if (logType === LogTypeEnum.ERROR) {
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
    { name = 'AsyncError', captureContext, retry, logType }: AsyncErrorInfo = {
      logType: LogTypeEnum.IGNORED,
    }
  ) {
    super(message, { name, captureContext, logType })
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
    { name = 'ScreenError', Screen, logType = LogTypeEnum.INFO }: ScreenErrorInfo
  ) {
    super(message, { name, logType })
    this.Screen = Screen
  }
}

ScreenError.prototype.name = 'ScreenError'

export class OfferNotFoundError extends ScreenError {
  constructor(
    offerId: number | undefined | number[],
    { Screen, callback, logType = LogTypeEnum.INFO }: ScreenErrorInfo
  ) {
    const message = offerId ? `Offer ${offerId} could not be retrieved` : 'offerId is undefined'
    super(message, { Screen, callback, logType })
  }
}

export class VenueNotFoundError extends ScreenError {
  constructor(
    venueId: number | undefined,
    { Screen, callback, logType = LogTypeEnum.INFO }: ScreenErrorInfo
  ) {
    const message = venueId ? `Venue ${venueId} could not be retrieved` : 'venueId is undefined'
    super(message, { Screen, callback, logType })
  }
}
