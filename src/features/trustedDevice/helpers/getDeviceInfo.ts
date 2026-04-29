// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import DeviceInfo from 'react-native-device-info'

import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

export const getDeviceInfo = async () => {
  const [deviceId, osWeb] = await Promise.all([getDeviceId(), DeviceInfo.getBaseOs()])

  const osNative = DeviceInfo.getSystemName()
  const modelNative = DeviceInfo.getModel()

  return {
    deviceId,
    os: osNative === 'unknown' ? osWeb : osNative,
    source: modelNative === 'unknown' ? browserName : modelNative,
  }
}
