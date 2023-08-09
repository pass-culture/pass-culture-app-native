import { CaptureContext, Extras } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'

import { MonitoringError } from '../errors'

describe('MonitoringError', () => {
  it('should call eventMonitoring.captureException() on new MonitoringError instance', () => {
    const error = new MonitoringError('error')
    expect(eventMonitoring.captureException).toBeCalledWith(error, undefined)
    expect(error.name).toBe(MonitoringError.name)
  })

  it('should rename MonitoringError to RenamedError', () => {
    const error = new MonitoringError('error', { name: 'RenamedError' })
    expect(eventMonitoring.captureException).toBeCalledWith(error, undefined)
    expect(error.name).toBe('RenamedError')
  })

  it('should pass captureContext to MonitoringError as a 2nd argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', { captureContext })
    expect(eventMonitoring.captureException).toBeCalledWith(error, captureContext)
    expect(error.name).toBe('MonitoringError')
  })

  it('should pass captureContext to RenamedError as a last argument', () => {
    const extra: Extras = { userId: 1000 }
    const captureContext: CaptureContext = {
      extra,
    }
    const error = new MonitoringError('error', { name: 'RenamedError', captureContext })
    expect(eventMonitoring.captureException).toBeCalledWith(error, captureContext)
    expect(error.name).toBe('RenamedError')
  })
})
