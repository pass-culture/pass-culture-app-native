import {
  DocumentTitleOptions,
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
  Theme,
} from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { LoadingPage } from 'ui/components/LoadingPage'
import { ColorsEnum } from 'ui/theme'
import { useServiceWorker } from 'web/useServiceWorker'

import { author } from '../../../../package.json'
import { isNavigationReadyRef, navigationRef } from '../navigationRef'
import { onNavigationStateChange as onNavigationStateChangeService } from '../services'

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

  const [isNavReady, setIsNavReady] = useState(false)
  const [initialNavigationState, setInitialNavigationState] = useState<NavigationState>()
  const sw = useServiceWorker()

  const onNavigationStateChange = useCallback(
    (state: NavigationState) => {
      onNavigationStateChangeService(state, { serviceWorkerStatus: sw.serviceWorkerStatus })
    },
    [sw.serviceWorkerStatus]
  )
  useEffect(() => {
    async function restoreNavStateOnReload() {
      try {
        if (Platform.OS !== 'web') return // Only restore state if we're on web
        if (!hasWindowReloaded()) return // Only restore state if we can detect window reload

        const savedState = await storage.readObject<NavigationState>('react_navigation_persistence')
        if (!savedState) return // Only restore state if there is a saved state

        setInitialNavigationState(savedState)
      } finally {
        setIsNavReady(true)
      }
    }
    restoreNavStateOnReload()
    return () => {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = false
    }
  }, [])

  useEffect(() => {
    if (isNavReady) {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = true
      hideSplashScreen && hideSplashScreen()
    }
  }, [isNavReady, hideSplashScreen])

  function setRef(ref: NavigationContainerRef | null) {
    if (ref) {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      navigationRef.current = ref
    }
  }

  if (!isNavReady) {
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

function hasWindowReloaded() {
  if (Platform.OS !== 'web') return false

  const performance = globalThis?.performance

  if (performance?.getEntriesByType) {
    const perfEntries = performance.getEntriesByType('navigation')
    // @ts-expect-error PerformanceEntry.type does exist
    const perfEntryType = perfEntries.length > 0 ? perfEntries[0].type : null
    if (perfEntryType === 'reload') {
      return true
    }
  }

  // Deprecated version for older browsers
  // See doc : https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigation/type
  if (performance?.navigation?.type) {
    return performance.navigation.type === 1
  }

  return false
}
