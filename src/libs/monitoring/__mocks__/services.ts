import { eventMonitoring as actualErrorMonitoring } from 'libs/monitoring/services'

export const eventMonitoring: typeof actualErrorMonitoring = {
  captureException: jest.fn(),
  captureEvent: jest.fn(),
  captureMessage: jest.fn(),
  init: jest.fn(),
  configureScope: jest.fn(),
  setUser: jest.fn(),
}
