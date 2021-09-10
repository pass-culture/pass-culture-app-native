import { Route, useNavigationState } from '@react-navigation/native'
import { Linking, Platform } from 'react-native'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { getScreenFromDeeplink } from 'features/deeplinks/getScreenFromDeeplink'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'

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

export async function openExternalUrl(
  url: string,
  logEvent: boolean | undefined = true,
  fallbackUrl?: string | undefined
) {
  const isAppUrl = url.match('^' + WEBAPP_NATIVE_REDIRECTION_URL) || url.match('^' + WEBAPP_V2_URL)
  if (isAppUrl) {
    try {
      const { screen, params } = getScreenFromDeeplink(url)
      return navigationRef.current?.navigate(screen, params)
    } catch {
      // If an error is thrown, that means that no routes were matched
      return navigateToHome()
    }
  }

  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) {
    Linking.openURL(url).then(() => {
      if (logEvent) {
        analytics.logOpenExternalUrl(url)
      }
    })
  } else if (fallbackUrl) {
    const canOpenFallBackUrl = await Linking.canOpenURL(fallbackUrl)
    if (canOpenFallBackUrl) {
      Linking.openURL(fallbackUrl).then(() => logEvent && analytics.logOpenExternalUrl(fallbackUrl))
    }
  }
}

export async function openExternalPhoneNumber(phone: string) {
  let phoneNumber = phone

  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`
  } else {
    phoneNumber = `tel:${phone}`
  }

  const canOpen = await Linking.canOpenURL(phoneNumber)
  if (canOpen) Linking.openURL(phoneNumber)
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
