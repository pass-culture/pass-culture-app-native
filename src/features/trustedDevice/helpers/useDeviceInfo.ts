import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import DeviceInfo from 'react-native-device-info'

import { TrustedDevice } from 'api/gen'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

export type DeviceInformation = TrustedDevice

export const useDeviceInfo = (): DeviceInformation | undefined => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformation | undefined>()

  useEffect(() => {
    const getDeviceInfo = async () => {
      const [deviceId, osWeb] = await Promise.all([getDeviceId(), DeviceInfo.getBaseOs()])
      const osNative = DeviceInfo.getSystemName()
      const modelNative = DeviceInfo.getModel()

      setDeviceInfo({
        deviceId,
        os: osNative === 'unknown' ? osWeb : osNative,
        source: modelNative === 'unknown' ? browserName : modelNative,
      })
    }
    getDeviceInfo()
  }, [])

  return deviceInfo
}
