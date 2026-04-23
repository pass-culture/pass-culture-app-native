import { useEffect, useState } from 'react'
import { useWindowDimensions, PixelRatio, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { DeviceInfoV2 } from 'api/gen'
import { getDeviceInfo as fetchBaseDeviceInfo } from 'features/trustedDevice/helpers/getDeviceInfo'

export type DeviceInformation = DeviceInfoV2 & {
  resolution: string
  fontScale: number
  screenZoomLevel?: number
}

const isWeb = Platform.OS === 'web'

export const useDeviceInfo = (): DeviceInformation | undefined => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformation | undefined>()
  const { width, height } = useWindowDimensions()

  useEffect(() => {
    const fetchFullDeviceInfo = async () => {
      const baseInfo = await fetchBaseDeviceInfo()

      const resolution = `${width}x${height}`
      const screenZoomLevel = isWeb ? PixelRatio.get() : undefined
      const fontScaleRaw = isWeb ? PixelRatio.getFontScale() : await DeviceInfo.getFontScale()
      const fontScale = Number.parseFloat(fontScaleRaw.toFixed(3))

      setDeviceInfo({
        ...baseInfo,
        resolution,
        screenZoomLevel,
        fontScale,
      })
    }

    void fetchFullDeviceInfo()
  }, [width, height])

  return deviceInfo
}
