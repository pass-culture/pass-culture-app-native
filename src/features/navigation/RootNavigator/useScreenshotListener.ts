import { useIsFocused, useRoute } from '@react-navigation/core'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { addScreenshotListener } from 'react-native-detector'

import { ScreenNames, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'

export const useScreenshotListener = () => {
  const isFocused = useIsFocused()
  const { name, params } = useRoute<UseRouteType<ScreenNames>>()

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const unsubscribe = addScreenshotListener(() => onScreenshot({ isFocused, name, params }))
      return () => {
        unsubscribe()
      }
    }

    return
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
  if (name !== 'TabNavigator' && isFocused) {
    const id = 'id' in params ? Number(params.id) : undefined
    analytics.logScreenshot({ from: name, id })
  }
}
