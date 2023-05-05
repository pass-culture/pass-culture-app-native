import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import DeviceInfo from 'react-native-device-info'

import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'

export interface DeviceInformations {
  id?: string
  os?: string
  source?: string
}

export const useDeviceInfos = (): DeviceInformations => {
  const [deviceInfos, setDeviceInfos] = useState<DeviceInformations>({
    id: undefined,
    os: undefined,
    source: undefined,
  })

  useEffect(() => {
    const getDeviceInfo = async () => {
      const [deviceId, osWeb] = await Promise.all([getUniqueId(), DeviceInfo.getBaseOs()])
      const osNative = DeviceInfo.getSystemName()
      const modelNative = DeviceInfo.getModel()

      setDeviceInfos({
        id: deviceId,
        os: osNative !== 'unknown' ? osNative : osWeb,
        source: modelNative !== 'unknown' ? modelNative : browserName,
      })
    }
    getDeviceInfo()
  }, [])

  return deviceInfos
}
