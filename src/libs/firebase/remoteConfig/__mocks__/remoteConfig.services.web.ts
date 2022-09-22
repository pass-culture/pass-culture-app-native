import { DEFAULT_REMOTE_CONFIG } from '../remoteConfig.constants'
// .web extension until universal interface is supported by react-native-firebase
// See https://github.com/invertase/react-native-firebase/discussions/6562
import { remoteConfig as actualRemoteConfig } from '../remoteConfig.services.web'

export const remoteConfig: jest.Mocked<typeof actualRemoteConfig> = {
  refresh: jest.fn().mockResolvedValue(true),
  getValues: jest.fn().mockReturnValue(DEFAULT_REMOTE_CONFIG),
}
