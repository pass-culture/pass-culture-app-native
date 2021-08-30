import { DEFAULT_REMOTE_CONFIG } from '../ABTesting.constants'
import { abTesting as actualAbTesting } from '../ABTesting.services'

export const abTesting: jest.Mocked<typeof actualAbTesting> = {
  configure: jest.fn(() => Promise.resolve()), // `() => Promise.resolve()` to simulate Promise<void> return type
  refresh: jest.fn().mockResolvedValue(true),
  getValues: jest.fn().mockReturnValue(DEFAULT_REMOTE_CONFIG),
}
