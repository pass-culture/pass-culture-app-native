import { errorMonitoring as actualErrorMonitoring } from 'libs/errorMonitoring/services'

export const errorMonitoring: typeof actualErrorMonitoring = {
    captureException: jest.fn(),
    init: jest.fn(),
}
