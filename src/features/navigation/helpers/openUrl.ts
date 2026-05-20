import { Alert, Linking, NativeModules, Platform } from 'react-native'

import { getScreenFromDeeplink } from 'features/deeplinks/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { OfferAnalyticsData } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'

import { isAppUrl } from './isAppUrl'
import { navigateToHome } from './navigateToHome'

const openAppUrl = (url: string) => {
  try {
    const { screen, params } = getScreenFromDeeplink(url)
    return navigateFromRef(screen, params)
  } catch (error) {
    eventMonitoring.captureException(error)
    // If an error is thrown, that means that no routes were matched
    return navigateToHome()
  }
}

export type UrlParamsProps = {
  shouldLogEvent?: boolean
  fallbackUrl?: string
  analyticsData?: OfferAnalyticsData
}

const { DefaultBrowserModule } = NativeModules

const openExternalUrlOnAndroid = async (url: string) => {
  // This module has been created to open app links in browser, even if user has chosen to open them inside the app (in Android settings).
  if (url.startsWith('https://') && (await Linking.canOpenURL(url))) {
    // If link can be is valid, open it with custom module
    await DefaultBrowserModule.openUrl(url)
  } else {
    // If link can be is not valid, open it with Linking who will handle the error message displayed
    await Linking.openURL(url)
  }
}

const openExternalUrl = async (
  url: string,
  { shouldLogEvent = true, fallbackUrl, analyticsData }: UrlParamsProps
) => {
  try {
    if (Platform.OS === 'android') {
      await openExternalUrlOnAndroid(url)
    } else {
      await Linking.openURL(url)
    }
    if (shouldLogEvent) analytics.logOpenExternalUrl(url, { ...analyticsData })
    return
  } catch (error) {
    // Intentionally left empty to ignore errors
  }

  if (fallbackUrl) {
    try {
      await Linking.openURL(fallbackUrl)
      if (shouldLogEvent) analytics.logOpenExternalUrl(fallbackUrl, { ...analyticsData })
      return
    } catch (error) {
      // Intentionally left empty to ignore errors
    }
  }
  showAlert(url)
}

const showAlert = (url: string) => {
  const alertTitle = 'Problème technique'
  const alertMessage = `Nous n’arrivons pas à ouvrir ce lien\u00a0: ${url}`
  const alertButtons = undefined
  const alertAndroidOptions = { cancelable: true }
  Alert.alert(alertTitle, alertMessage, alertButtons, alertAndroidOptions)
}

export async function openUrl(
  url: string,
  { shouldLogEvent = true, fallbackUrl, analyticsData }: UrlParamsProps = {},
  isExternal?: boolean
) {
  if (isAppUrl(url) && !isExternal) {
    return openAppUrl(url)
  }

  return openExternalUrl(url, { shouldLogEvent, fallbackUrl, analyticsData })
}
