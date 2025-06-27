import { useEffect, useState } from 'react'
import { PixelRatio, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

const DEFAULT_FONT_SCALE = 1
const isWeb = Platform.OS === 'web'

export const useGetFontScale = (): { fontScale: number } => {
  const [fontScale, setFontScale] = useState<number>(DEFAULT_FONT_SCALE)

  useEffect(() => {
    const fetchFontScale = async () => {
      try {
        const rawFontScale = isWeb ? PixelRatio.getFontScale() : await DeviceInfo.getFontScale()
        setFontScale(parseFloat(rawFontScale.toFixed(3)))
      } catch (error) {
        eventMonitoring.captureException(
          `Failed to get fontScale in useGetFontScale: ${getErrorMessage(error)}`,
          { extra: { error }, level: 'info' }
        )
        setFontScale(DEFAULT_FONT_SCALE)
      }
    }

    fetchFontScale()
  }, [])

  return { fontScale }
}
