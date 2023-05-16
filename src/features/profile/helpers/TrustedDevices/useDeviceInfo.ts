import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import DeviceInfo from 'react-native-device-info'

import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'

export interface DeviceInformation {
  id?: string
  os?: string
  source?: string
}

export const useDeviceInfo = (): DeviceInformation => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformation>({
    id: undefined,
    os: undefined,
    source: undefined,
  })

  useEffect(() => {
    const getDeviceInfo = async () => {
      const [deviceId, osWeb] = await Promise.all([getUniqueId(), DeviceInfo.getBaseOs()])
      const osNative = DeviceInfo.getSystemName()
      const modelNative = DeviceInfo.getModel()

      setDeviceInfo({
        id: deviceId,
        os: osNative !== 'unknown' ? osNative : osWeb,
        source: modelNative !== 'unknown' ? modelNative : browserName,
      })
    }
    getDeviceInfo()
  }, [])

  return deviceInfo
}
