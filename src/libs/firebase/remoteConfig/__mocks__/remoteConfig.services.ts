import { DEFAULT_REMOTE_CONFIG } from '../remoteConfig.constants'
import { remoteConfig as actualRemoteConfig } from '../remoteConfig.services'

export const remoteConfig: jest.Mocked<typeof actualRemoteConfig> = {
  configure: jest.fn(() => Promise.resolve()), // `() => Promise.resolve()` to simulate Promise<void> return type
  refresh: jest.fn().mockResolvedValue(true),
  getValues: jest.fn().mockReturnValue(DEFAULT_REMOTE_CONFIG),
}
