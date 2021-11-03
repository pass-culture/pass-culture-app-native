import {
  DocumentTitleOptions,
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
  Theme,
} from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
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

  const [isNavigationReady, setIsNavigationReady] = useState(false)
  const [initialNavigationState, setInitialNavigationState] = useState<NavigationState>()

  useEffect(() => {
    async function restoreState() {
      try {
        if (Platform.OS !== 'web') return // Only restore state if we're on web
        const state = await storage.readObject<NavigationState>('react_navigation_persistence')
        if (state) setInitialNavigationState(state)
      } finally {
        setIsNavigationReady(true)
      }
    }
    restoreState()
    return () => {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = false
    }
  }, [])

  useEffect(() => {
    if (isNavigationReady) {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = true
      hideSplashScreen && hideSplashScreen()
    }
  }, [isNavigationReady, hideSplashScreen])

  function setRef(ref: NavigationContainerRef | null) {
    if (ref) {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      navigationRef.current = ref
    }
  }

  if (!isNavigationReady) {
    return <LoadingPage />
  }
  return (
    <NavigationContainer
      linking={linking}
      initialState={initialNavigationState}
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
