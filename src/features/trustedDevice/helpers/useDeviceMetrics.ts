import { useState, useEffect } from 'react'
import { PixelRatio, Platform, useWindowDimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { DeviceMetrics } from 'features/trustedDevice/types'

const isWeb = Platform.OS === 'web'

export const useDeviceMetrics = (): DeviceMetrics => {
  const { width, height } = useWindowDimensions()

  const [metrics, setMetrics] = useState<DeviceMetrics>({
    resolution: `${width}x${height}`,
    fontScale: 1,
    screenZoomLevel: undefined,
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      const fontScaleRaw = isWeb ? PixelRatio.getFontScale() : await DeviceInfo.getFontScale()
      setMetrics({
        resolution: `${width}x${height}`,
        fontScale: Number.parseFloat(fontScaleRaw.toFixed(3)),
        screenZoomLevel: isWeb ? PixelRatio.get() : undefined,
      })
    }

    void fetchMetrics()
  }, [width, height])

  return metrics
}
