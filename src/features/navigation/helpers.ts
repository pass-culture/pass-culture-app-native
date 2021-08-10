import { Route, useNavigationState } from '@react-navigation/native'
import { Linking } from 'react-native'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { getScreenFromDeeplink } from 'features/deeplinks/useDeeplinkUrlHandler'
import { analytics } from 'libs/analytics'

import { navigationRef } from './navigationRef'

interface HomeNavigateConfig {
  screen: 'TabNavigator'
  params: {
    screen: 'Home'
    params: undefined
  }
}

export const homeNavigateConfig: HomeNavigateConfig = {
  screen: 'TabNavigator',
  params: {
    screen: 'Home',
    params: undefined,
  },
}

export function navigateToHome() {
  navigationRef.current?.navigate(homeNavigateConfig.screen, homeNavigateConfig.params)
}

export function navigateToBooking(bookingId: number) {
  navigationRef.current?.navigate('BookingDetails', { id: bookingId })
}

export async function openExternalUrl(url: string, logEvent: boolean | undefined = true) {
  if (url.match('^' + WEBAPP_NATIVE_REDIRECTION_URL)) {
    const { screen, params } = getScreenFromDeeplink(url)
    return navigationRef.current?.navigate(screen, params)
  }

  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) {
    Linking.openURL(url).then(() => {
      if (logEvent) {
        analytics.logOpenExternalUrl(url)
      }
    })
  }
}

export function usePreviousRoute(): Route<string> | null {
  return useNavigationState((state) => {
    const numberOfRoutes = state.routes.length
    if (numberOfRoutes > 1) {
      const previousRoute = state.routes[numberOfRoutes - 2]
      return previousRoute
    }
    return null
  })
}

export function useCurrentRoute(): Route<string> | null {
  return useNavigationState((state) => {
    const numberOfRoutes = state.routes.length
    if (numberOfRoutes > 0) {
      return state.routes[numberOfRoutes - 1]
    }
    return null
  })
}
