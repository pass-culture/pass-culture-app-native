import { eventMonitoring as actualErrorMonitoring } from 'libs/monitoring/services'

export const eventMonitoring: typeof actualErrorMonitoring = {
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
  init: jest.fn(),
  configureScope: jest.fn(),
  setExtras: jest.fn(),
  setUser: jest.fn(),
  withProfiler: jest.fn(),
  wrap: jest.fn(),
}
