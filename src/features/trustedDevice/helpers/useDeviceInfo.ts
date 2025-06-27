import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import { useWindowDimensions, PixelRatio, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { TrustedDevice } from 'api/gen'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

export type DeviceInformation = TrustedDevice & {
  resolution: string
  fontScale: number
  screenZoomLevel?: number
}

const isWeb = Platform.OS === 'web'

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
      const screenZoomLevel = isWeb ? PixelRatio.get() : undefined
      const fontScaleRaw = isWeb ? PixelRatio.getFontScale() : await DeviceInfo.getFontScale()
      const fontScale = parseFloat(fontScaleRaw.toFixed(3))

      setDeviceInfo({
        deviceId,
        os: osNative === 'unknown' ? osWeb : osNative,
        source,
        resolution,
        screenZoomLevel,
        fontScale,
      })
    }

    getDeviceInfo()
  }, [width, height, deviceInfo?.screenZoomLevel])

  return deviceInfo
}
