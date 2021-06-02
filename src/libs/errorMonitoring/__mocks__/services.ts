import { errorMonitoring as actualErrorMonitoring } from 'libs/errorMonitoring/services'

export const errorMonitoring: typeof actualErrorMonitoring = {
  captureException: jest.fn(),
  captureEvent: jest.fn(),
  captureMessage: jest.fn(),
  init: jest.fn(),
  configureScope: jest.fn(),
  setUser: jest.fn(),
}
