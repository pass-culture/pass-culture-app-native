import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import {
  DocumentTitleOptions,
  NavigationContainer,
  NavigationState,
  Theme,
} from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Platform, StatusBar } from 'react-native'
import { DefaultTheme, useTheme } from 'styled-components/native'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking/linking'
import { useSplashScreenContext } from 'libs/splashscreen/splashscreen'
import { storage } from 'libs/storage'
import { useColorScheme } from 'libs/styled/useColorScheme'
import { LoadingPage } from 'ui/pages/LoadingPage'

import { author } from '../../../../package.json'
import { navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

const getNavThemeConfig = (theme: DefaultTheme) =>
  ({
    colors: { background: theme.designSystem.color.background.default },
  }) as Theme
const SECONDARY_TITLE = author?.name || 'pass Culture'
const DOCUMENT_TITLE_OPTIONS: DocumentTitleOptions = {
  formatter(options, _route) {
    if (options?.title) {
      return `${String(options.title)} | ${SECONDARY_TITLE}`
    }
    return SECONDARY_TITLE
  },
}

export const AppNavigationContainer = () => {
  const t0 = performance.now()
  console.log(`Most nested of App (AppNavigationContainer) start ${t0}`)
  const colorScheme = useColorScheme()
  const { hideSplashScreen } = useSplashScreenContext()
  const theme = useTheme()

  useReduxDevToolsExtension(navigationRef)

  const [isNavReady, setIsNavReady] = useState(false)
  const [initialNavigationState, setInitialNavigationState] = useState<NavigationState>()

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
  }, [])

  useEffect(() => {
    if (isNavReady) {
      hideSplashScreen?.()
    }
  }, [isNavReady, hideSplashScreen])

  if (!isNavReady) {
    return <LoadingPage />
  }

  return (
    <NavigationContainer
      linking={linking}
      initialState={initialNavigationState}
      onStateChange={onNavigationStateChange}
      fallback={<LoadingPage />}
      ref={navigationRef}
      documentTitle={DOCUMENT_TITLE_OPTIONS}
      theme={getNavThemeConfig(theme)}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={
          colorScheme === 'dark'
            ? theme.designSystem.color.background.lockedInverted
            : theme.designSystem.color.background.locked
        }
      />
      <RootNavigator />
    </NavigationContainer>
  )
}

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
