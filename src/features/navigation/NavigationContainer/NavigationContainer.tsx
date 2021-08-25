import { NavigationContainer, NavigationContainerRef, Theme } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { useSplashScreenContext } from 'libs/splashscreen'
import { LoadingPage } from 'ui/components/LoadingPage'
import { ColorsEnum } from 'ui/theme'

import { isNavigationReadyRef, navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

const NAV_THEME_CONFIG = { colors: { background: ColorsEnum.WHITE } } as Theme

export const AppNavigationContainer = () => {
  const { hideSplashScreen } = useSplashScreenContext()

  useEffect(() => {
    return () => {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = false
    }
  }, [])

  const onReady = useCallback(() => {
    /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
    isNavigationReadyRef.current = true
    hideSplashScreen && hideSplashScreen()
  }, [hideSplashScreen])

  function setRef(ref: NavigationContainerRef | null) {
    if (ref) {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      navigationRef.current = ref
    }
  }

  return (
    <NavigationContainer
      linking={linking}
      onStateChange={onNavigationStateChange}
      fallback={<LoadingPage />}
      ref={setRef}
      onReady={onReady}
      theme={NAV_THEME_CONFIG}>
      <RootNavigator />
    </NavigationContainer>
  )
}
