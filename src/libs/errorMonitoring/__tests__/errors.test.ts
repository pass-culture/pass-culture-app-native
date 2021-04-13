import { errorMonitoring } from 'libs/errorMonitoring'

import { MonitoringError } from '../errors'

describe('MonitoringError', () => {
  it('should call errorMonitoring.captureException() on new MonitoringError instance', () => {
    const error = new MonitoringError('error')
    expect(errorMonitoring.captureException).toBeCalledWith(error)
    expect(error.name).toBe(MonitoringError.name)
  })

  it('should rename MonitoringError to RenamedError', () => {
    const error = new MonitoringError('error', 'RenamedError')
    expect(errorMonitoring.captureException).toBeCalledWith(error)
    expect(error.name).toBe('RenamedError')
  })
})
