import { useIsFocused, useRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { addScreenshotListener } from 'react-native-detector'

import { ScreenNames, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'

export const useScreenshotListener = () => {
  const isFocused = useIsFocused()
  const { name, params } = useRoute<UseRouteType<ScreenNames>>()

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const unsubscribe = addScreenshotListener(() => onScreenshot({ isFocused, name, params }))
      return () => {
        unsubscribe()
      }
    } else return
  }, [isFocused, name, params])
}

export const onScreenshot = ({
  isFocused,
  name,
  params = {},
}: {
  isFocused: boolean
  name: string
  params?: UseRouteType<ScreenNames>['params']
}) => {
  // We only track current screens that are focused, and we do not track TabBar
  if (name == 'TabNavigator' || !isFocused) {
    return
  }

  const analyticsParams = { from: name }
  if ('id' in params) {
    const id = Number(params.id)
    switch (name) {
      case 'Offer':
      case 'OfferDescription':
        Object.assign(analyticsParams, { offerId: id })
        break
      case 'Venue':
        Object.assign(analyticsParams, { venueId: id })
        break
      case 'BookingDetails':
        Object.assign(analyticsParams, { bookingId: id })
    }
  }

  analytics.logScreenshot(analyticsParams)
}
