import { useEffect, useState } from 'react'
import DeviceInfo from 'react-native-device-info'

import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'

export interface DeviceInformations {
  deviceId: string
  deviceModel?: string
  deviceOS?: string
  deviceBrand?: string
}

export const useDeviceInfos = (): DeviceInformations => {
  const [deviceModel, setDeviceModel] = useState('')
  const [deviceBrand, setDeviceBrand] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [deviceOs, setDeviceOs] = useState('')

  useEffect(() => {
    setDeviceModel(DeviceInfo.getModel())
    setDeviceBrand(DeviceInfo.getBrand())
    getUniqueId().then((deviceId) => setDeviceId(deviceId))
    DeviceInfo.getBaseOs().then((baseOs) => setDeviceOs(baseOs))
  }, [])

  return {
    deviceId,
    deviceModel: deviceModel !== 'unknown' ? deviceModel : undefined,
    deviceBrand: deviceBrand !== 'unknown' ? deviceBrand : undefined,
    deviceOS: deviceOs !== 'unknown' ? deviceOs : undefined,
  }
}
