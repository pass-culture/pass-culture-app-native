import { eventMonitoring as actualErrorMonitoring } from 'libs/monitoring/services'

export const eventMonitoring: typeof actualErrorMonitoring = {
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
  captureEvent: jest.fn(),
  captureMessage: jest.fn(),
  init: jest.fn(),
  configureScope: jest.fn(),
  setUser: jest.fn(),
  startTransaction: jest.fn().mockReturnValue({ name: 'transaction1' }),
  withProfiler: jest.fn(),
  wrap: jest.fn(),
}
