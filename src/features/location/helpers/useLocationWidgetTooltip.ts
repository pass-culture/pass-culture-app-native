import React, { useCallback, useEffect } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'

import { ScreenOrigin } from 'features/location/enums'
import { useLocation } from 'libs/location'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'

const START_OFFSET = 1000
const TOOLTIP_DISPLAY_DURATION = 8000

export const useLocationWidgetTooltip = (screenOrigin: ScreenOrigin) => {
  const touchableRef = React.useRef<HTMLButtonElement>()

  const { isSplashScreenHidden } = useSplashScreenContext()
  const isNativeSplashScreenHidden = isSplashScreenHidden || Platform.OS === 'web'

  const [widgetWidth, setWidgetWidth] = React.useState<number | undefined>()
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)
  const hideTooltip = useCallback(() => setIsTooltipVisible(false), [setIsTooltipVisible])

  const { geolocPosition } = useLocation()

  const enableTooltip = screenOrigin === ScreenOrigin.HOME

  // native resizing on layout
  const onWidgetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout
      setWidgetWidth(width)
    },
    [setWidgetWidth]
  )

  // web resizing on layout
  useEffect(() => {
    if (Platform.OS === 'web' && touchableRef.current) {
      const { width } = touchableRef.current.getBoundingClientRect()
      setWidgetWidth(width)
    }
  }, [])

  useEffect(() => {
    /**
     * Patch for web: On the web we are not directly geolocated,
     * we need a little time to recover the user's geolocation.
     * This condition allows that when the location is retrieved,
     * the tooltip is directly hidden
     */
    if (geolocPosition) {
      hideTooltip()
      return
    }

    if (!isNativeSplashScreenHidden || !enableTooltip) return

    const displayTooltipIfNeeded = async () => {
      const timesLocationTooltipHasBeenDisplayed = Number(
        await storage.readString('times_location_tooltip_has_been_displayed')
      )
      setIsTooltipVisible(timesLocationTooltipHasBeenDisplayed < 1 || !geolocPosition)
      await storage.saveString(
        'times_location_tooltip_has_been_displayed',
        String(timesLocationTooltipHasBeenDisplayed + 1)
      )
    }

    const timeoutOn = setTimeout(displayTooltipIfNeeded, START_OFFSET)
    const timeoutOff = setTimeout(hideTooltip, START_OFFSET + TOOLTIP_DISPLAY_DURATION)

    return () => {
      clearTimeout(timeoutOn)
      clearTimeout(timeoutOff)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should only be called on startup
  }, [isNativeSplashScreenHidden, geolocPosition])

  return {
    isTooltipVisible,
    hideTooltip,
    widgetWidth,
    onWidgetLayout,
    touchableRef,
    enableTooltip,
  }
}
