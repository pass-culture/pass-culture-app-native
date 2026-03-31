import { useEffect, useState } from 'react'
import { PixelRatio, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

const DEFAULT_FONT_SCALE = 1
const isWeb = Platform.OS === 'web'

// We use 1.5 as threshold because 2.0 font scale is quite extreme and
// would break too much the UI. 1.5 is already a quite zoomed font size
// that can impact the UI but is still acceptable for most of the users.
const MOBILE_ZOOM_THRESHOLD = 1.5

// We use 150 as threshold because 150% zoom is quite extreme and
// would break too much the UI. 150% is already a quite zoomed font size
// that can impact the UI but is still acceptable for most of the users
const WEB_ZOOM_THRESHOLD = 150

/* Get device font scale (in order to adapt the display).
 * The value is rounded to 3 decimals to limit rendering variations.
 */
const useMobileFontScale = (): { mobileFontScale: number } => {
  const [mobileFontScale, setMobileFontScale] = useState<number>(DEFAULT_FONT_SCALE)

  useEffect(() => {
    const fetchFontScale = async () => {
      try {
        const rawFontScale = isWeb ? PixelRatio.getFontScale() : await DeviceInfo.getFontScale()
        setMobileFontScale(Number.parseFloat(rawFontScale.toFixed(3)))
      } catch (error) {
        eventMonitoring.captureException(
          `Failed to get fontScale in useMobileFontScale: ${getErrorMessage(error)}`,
          { extra: { error }, level: 'info' }
        )
        setMobileFontScale(DEFAULT_FONT_SCALE)
      }
    }

    fetchFontScale()
  }, [])

  return { mobileFontScale }
}

type ZoomedValue<T> = {
  default: T
  at200PercentZoom: T
}

/**
 * Value hook to get the adapted value according to the device font zoom.
 * if the `fontScale` is above the threshold (`1.5`), we consider the display
 * to be heavily zoomed and return the value for 200% zoom,
 *  which is a key value in digital accessibility.
 */
export const useMobileFontScaleToDisplay = <T>({
  default: at100PercentZoom,
  at200PercentZoom,
}: ZoomedValue<T>): T => {
  const { mobileFontScale } = useMobileFontScale()
  return mobileFontScale >= MOBILE_ZOOM_THRESHOLD ? at200PercentZoom : at100PercentZoom
}

export const useZoomInPercent = () => {
  const deviceInfo = useDeviceInfo()
  return deviceInfo?.screenZoomLevel ? Math.round(deviceInfo.screenZoomLevel * 100) / 2 : undefined
}

/**
 * Value hook to get the adapted value according to the web zoom.
 * if the `zoomPercent` is above the threshold (`150`), we consider the display
 * to be heavily zoomed and return the value for 200% zoom,
 *  which is a key value in digital accessibility.
 */
export const useWebZoomToDisplay = <T>({
  default: at100PercentZoom,
  at200PercentZoom,
}: ZoomedValue<T>): T => {
  const zoomPercent = useZoomInPercent()
  const isZoomedWeb = zoomPercent && zoomPercent > WEB_ZOOM_THRESHOLD
  return isZoomedWeb ? at200PercentZoom : at100PercentZoom
}
