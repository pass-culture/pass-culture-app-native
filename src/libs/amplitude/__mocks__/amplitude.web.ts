import { AmplitudeClient } from '../types'

export const amplitude: AmplitudeClient = {
  logEvent: jest.fn().mockResolvedValue(undefined),
  enableCollection: jest.fn(),
  disableCollection: jest.fn(),
}
