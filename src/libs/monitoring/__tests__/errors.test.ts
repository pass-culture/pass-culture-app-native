import { CaptureContext, Extras } from '@sentry/types'

import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { eventMonitoring } from 'libs/monitoring'

import { MonitoringError, OfferNotFoundError, VenueNotFoundError } from '../errors'

describe('MonitoringError', () => {
  it('should call eventMonitoring.captureException() on new MonitoringError instance', () => {
    const error = new MonitoringError('error')

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, undefined)
    expect(error.name).toBe(MonitoringError.name)
  })

  it('should rename MonitoringError to RenamedError', () => {
    const error = new MonitoringError('error', { name: 'RenamedError' })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, undefined)
    expect(error.name).toBe('RenamedError')
  })

  it('should pass captureContext to MonitoringError as a 2nd argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', { captureContext })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, captureContext)
    expect(error.name).toBe('MonitoringError')
  })

  it('should pass captureContext to RenamedError as a last argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', { name: 'RenamedError', captureContext })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, captureContext)
    expect(error.name).toBe('RenamedError')
  })

  it('should call eventMonitoring.captureMessage() on new MonitoringError instance when shouldBeCapturedAsInfo is true', () => {
    const error = new MonitoringError('error', { shouldBeCapturedAsInfo: true })

    expect(eventMonitoring.captureMessage).toHaveBeenNthCalledWith(1, error.message, 'info')
  })

  it('should not call eventMonitoring.captureMessage() on new MonitoringError instance when shouldBeCapturedAsInfo is false', () => {
    new MonitoringError('error', { shouldBeCapturedAsInfo: false })

    expect(eventMonitoring.captureMessage).not.toHaveBeenCalled()
  })

  it('should not call eventMonitoring.captureMessage() on new MonitoringError instance when shouldBeCapturedAsInfo is undefined', () => {
    new MonitoringError('error')

    expect(eventMonitoring.captureMessage).not.toHaveBeenCalled()
  })
})

describe('OfferNotFoundError', () => {
  it('should return message with offer id when it defined', () => {
    const error = new OfferNotFoundError(10000, { Screen: PageNotFound })

    expect(error.message).toBe('Offer 10000 could not be retrieved')
  })

  it('should return message without offer id when it undefined', () => {
    const error = new OfferNotFoundError(undefined, { Screen: PageNotFound })

    expect(error.message).toBe('offerId is undefined')
  })
})

describe('VenueNotFoundError', () => {
  it('should return message with offer id when it defined', () => {
    const error = new VenueNotFoundError(5000, { Screen: PageNotFound })

    expect(error.message).toBe('Venue 5000 could not be retrieved')
  })

  it('should return message without offer id when it undefined', () => {
    const error = new VenueNotFoundError(undefined, { Screen: PageNotFound })

    expect(error.message).toBe('venueId is undefined')
  })
})
