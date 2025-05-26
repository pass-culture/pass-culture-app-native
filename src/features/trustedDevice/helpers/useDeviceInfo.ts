import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import { useWindowDimensions, PixelRatio } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { TrustedDevice } from 'api/gen'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

export type DeviceInformation = TrustedDevice & {
  resolution?: string
  screenZoomLevel?: number
}

export const useDeviceInfo = (): DeviceInformation | undefined => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformation | undefined>()
  const { width, height } = useWindowDimensions()

  useEffect(() => {
    const getDeviceInfo = async () => {
      const [deviceId, osWeb] = await Promise.all([getDeviceId(), DeviceInfo.getBaseOs()])

      const osNative = DeviceInfo.getSystemName()
      const modelNative = await DeviceInfo.getModel()
      const source = modelNative === 'unknown' ? browserName : modelNative

      const resolution = `${width}x${height}`
      const screenZoomLevel = PixelRatio.get()

      setDeviceInfo({
        deviceId,
        os: osNative === 'unknown' ? osWeb : osNative,
        source,
        resolution,
        screenZoomLevel,
      })
    }

    getDeviceInfo()
  }, [width, height])

  return deviceInfo
}
