import { CaptureContext, Extras } from '@sentry/types'

import { errorMonitoring } from 'libs/errorMonitoring'

import { MonitoringError } from '../errors'

describe('MonitoringError', () => {
  it('should call errorMonitoring.captureException() on new MonitoringError instance', () => {
    const error = new MonitoringError('error')
    expect(errorMonitoring.captureException).toBeCalledWith(error, undefined)
    expect(error.name).toBe(MonitoringError.name)
  })

  it('should rename MonitoringError to RenamedError', () => {
    const error = new MonitoringError('error', 'RenamedError')
    expect(errorMonitoring.captureException).toBeCalledWith(error, undefined)
    expect(error.name).toBe('RenamedError')
  })

  it('should pass captureContext to MonitoringError as a 2nd argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', captureContext)
    expect(errorMonitoring.captureException).toBeCalledWith(error, captureContext)
    expect(error.name).toBe('MonitoringError')
  })

  it('should pass captureContext to RenamedError as a last argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', 'RenamedError', captureContext)
    expect(errorMonitoring.captureException).toBeCalledWith(error, captureContext)
    expect(error.name).toBe('RenamedError')
  })
})
