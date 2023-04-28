import { useEffect, useState } from 'react'
import DeviceInfo from 'react-native-device-info'

import { getDeviceModelFromUserAgent } from 'features/profile/helpers/TrustedDevices/getDeviceModelFromUserAgent'
import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'

export interface DeviceInformations {
  deviceId: string
  deviceOS: string
  deviceModel: string
}

export const useDeviceInfos = (): DeviceInformations => {
  const [deviceInfos, setDeviceInfos] = useState<DeviceInformations>({
    deviceId: '',
    deviceOS: '',
    deviceModel: '',
  })

  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceId = await getUniqueId()
      const deviceOsWeb = await DeviceInfo.getBaseOs()
      const deviceOsNative = DeviceInfo.getSystemName()
      const deviceModelWeb = getDeviceModelFromUserAgent()
      const deviceModelNative = DeviceInfo.getModel()

      setDeviceInfos({
        deviceId,
        deviceOS: deviceOsNative !== 'unknown' ? deviceOsNative : deviceOsWeb,
        deviceModel: deviceModelNative !== 'unknown' ? deviceModelNative : deviceModelWeb,
      })
    }
    getDeviceInfo()
  }, [])

  return deviceInfos
}
