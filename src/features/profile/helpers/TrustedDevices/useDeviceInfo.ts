import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import DeviceInfo from 'react-native-device-info'

import { TrustedDevice } from 'api/gen'
import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'

export type DeviceInformation = TrustedDevice

export const useDeviceInfo = (): DeviceInformation | undefined => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformation | undefined>()

  useEffect(() => {
    const getDeviceInfo = async () => {
      const [deviceId, osWeb] = await Promise.all([getUniqueId(), DeviceInfo.getBaseOs()])
      const osNative = DeviceInfo.getSystemName()
      const modelNative = DeviceInfo.getModel()

      setDeviceInfo({
        deviceId,
        os: osNative !== 'unknown' ? osNative : osWeb,
        source: modelNative !== 'unknown' ? modelNative : browserName,
      })
    }
    getDeviceInfo()
  }, [])

  return deviceInfo
}
