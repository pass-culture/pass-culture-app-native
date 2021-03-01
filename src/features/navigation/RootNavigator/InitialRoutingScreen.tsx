import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { useListenDeepLinksEffect } from 'features/deeplinks'
import { useSplashScreenContext } from 'libs/splashscreen'

import { UseNavigationType } from './types'
import { useGetInitialScreenConfig } from './useGetInitialScreenConfig'

export const InitialRoutingScreen: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { hideSplashScreen } = useSplashScreenContext()
  const initialScreenConfig = useGetInitialScreenConfig()

  useEffect(() => {
    if (!initialScreenConfig || !hideSplashScreen) {
      return
    }
    navigate(initialScreenConfig.screen, initialScreenConfig.params)
    hideSplashScreen()
  }, [initialScreenConfig, hideSplashScreen])

  useListenDeepLinksEffect()

  return null
}
