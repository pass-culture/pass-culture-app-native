import {
  DocumentTitleOptions,
  NavigationContainer,
  NavigationContainerRef,
  Theme,
} from '@react-navigation/native'
import React, { useEffect } from 'react'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { useSplashScreenContext } from 'libs/splashscreen'
import { LoadingPage } from 'ui/components/LoadingPage'
import { ColorsEnum } from 'ui/theme'

import { author } from '../../../../package.json'
import { isNavigationReadyRef, navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

const NAV_THEME_CONFIG = { colors: { background: ColorsEnum.WHITE } } as Theme
const SECONDARY_TITLE = author?.name || 'pass Culture'
const DOCUMENT_TITLE_OPTIONS: DocumentTitleOptions = {
  formatter(options, _route) {
    if (options?.title) {
      return `${options.title} | ${SECONDARY_TITLE}`
    }
    return SECONDARY_TITLE
  },
}

export const AppNavigationContainer = () => {
  const { hideSplashScreen } = useSplashScreenContext()

  useEffect(() => {
    /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
    isNavigationReadyRef.current = true
    return () => {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = false
    }
  }, [])

  useEffect(() => {
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
      // @ts-expect-error the typing of onNavigationStateChange() is good enough
      onStateChange={onNavigationStateChange}
      fallback={<LoadingPage />}
      ref={setRef}
      documentTitle={DOCUMENT_TITLE_OPTIONS}
      theme={NAV_THEME_CONFIG}>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default AppNavigationContainer
