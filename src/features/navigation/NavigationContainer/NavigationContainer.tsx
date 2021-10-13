import {
  DocumentTitleOptions,
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
  Theme,
} from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { NavigationStateChangeProvider } from 'features/navigation/RootNavigator/NavigationStateChangeContext'
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
  const [state, setState] = useState<NavigationState | undefined>()

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

  function onStateChange(state: NavigationState | undefined) {
    onNavigationStateChange(state)
    setState(state)
  }

  return (
    <NavigationStateChangeProvider state={state}>
      <NavigationContainer
        linking={linking}
        onStateChange={onStateChange}
        fallback={<LoadingPage />}
        ref={setRef}
        onReady={onReady}
        documentTitle={DOCUMENT_TITLE_OPTIONS}
        theme={NAV_THEME_CONFIG}>
        <RootNavigator />
      </NavigationContainer>
    </NavigationStateChangeProvider>
  )
}

export default AppNavigationContainer
