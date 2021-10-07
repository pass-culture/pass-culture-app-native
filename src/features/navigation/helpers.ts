import { t } from '@lingui/macro'
import { Route, useNavigationState } from '@react-navigation/native'
import { Alert, Linking } from 'react-native'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { getScreenFromDeeplink } from 'features/deeplinks/getScreenFromDeeplink'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'

import { navigationRef } from './navigationRef'

export const homeNavigateConfig = getTabNavConfig('Home')

export function navigateToHome() {
  navigationRef.current?.navigate(...homeNavigateConfig)
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

  try {
    await Linking.openURL(url)
    if (logEvent) analytics.logOpenExternalUrl(url)
    return
  } catch (error) {
    new MonitoringError(error.message, 'OpenExternalUrlError')
  }

  if (fallbackUrl) {
    try {
      await Linking.openURL(fallbackUrl)
      if (logEvent) analytics.logOpenExternalUrl(fallbackUrl)
      return
    } catch (error) {
      new MonitoringError(error.message, 'OpenExternalUrlError_FallbackUrl')
    }
  }

  const alertTitle = t`Problème technique ;(`
  const alertMessage = t`Nous n'arrivons pas à ouvrir ce lien : ${url}`
  const alertButtons = undefined
  const alertAndroidOptions = { cancelable: true }
  Alert.alert(alertTitle, alertMessage, alertButtons, alertAndroidOptions)
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
