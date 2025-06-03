import { CaptureContext, Extras } from '@sentry/types'

import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { eventMonitoring } from 'libs/monitoring/services'

import { LogTypeEnum, MonitoringError, OfferNotFoundError, VenueNotFoundError } from './errors'

jest.mock('libs/firebase/analytics/analytics')

describe('MonitoringError', () => {
  it('should call eventMonitoring.captureException() on new MonitoringError instance', () => {
    const error = new MonitoringError('error')

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, undefined)
    expect(error.name).toBe(MonitoringError.name)
  })

  it('should rename MonitoringError to RenamedError', () => {
    const error = new MonitoringError('error', { name: 'RenamedError', logType: LogTypeEnum.ERROR })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, undefined)
    expect(error.name).toBe('RenamedError')
  })

  it('should pass captureContext to MonitoringError as a 2nd argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', { captureContext, logType: LogTypeEnum.ERROR })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, captureContext)
    expect(error.name).toBe('MonitoringError')
  })

  it('should pass captureContext to RenamedError as a last argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', {
      name: 'RenamedError',
      captureContext,
      logType: LogTypeEnum.ERROR,
    })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, captureContext)
    expect(error.name).toBe('RenamedError')
  })

  it('should captureMessage as info on new MonitoringError instance when log type is info', () => {
    const error = new MonitoringError('error', { logType: LogTypeEnum.INFO })

    expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(1, error.message, {
      level: 'info',
    })
  })

  it('should not captureMessage on new MonitoringError instance when log type is ignored', () => {
    new MonitoringError('error', { logType: LogTypeEnum.IGNORED })

    expect(eventMonitoring.captureException).not.toHaveBeenCalledWith('error', {
      level: 'info',
    })
  })
})

describe('OfferNotFoundError', () => {
  it('should return message with offer id when it defined', () => {
    const error = new OfferNotFoundError(10000, {
      Screen: PageNotFound,
      logType: LogTypeEnum.IGNORED,
    })

    expect(error.message).toBe('Offer 10000 could not be retrieved')
  })

  it('should return message without offer id when it undefined', () => {
    const error = new OfferNotFoundError(undefined, {
      Screen: PageNotFound,
      logType: LogTypeEnum.IGNORED,
    })

    expect(error.message).toBe('offerId is undefined')
  })
})

describe('VenueNotFoundError', () => {
  it('should return message with offer id when it defined', () => {
    const error = new VenueNotFoundError(5000, {
      Screen: PageNotFound,
      logType: LogTypeEnum.IGNORED,
    })

    expect(error.message).toBe('Venue 5000 could not be retrieved')
  })

  it('should return message without offer id when it undefined', () => {
    const error = new VenueNotFoundError(undefined, {
      Screen: PageNotFound,
      logType: LogTypeEnum.IGNORED,
    })

    expect(error.message).toBe('venueId is undefined')
  })
})
