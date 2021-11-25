import { t } from '@lingui/macro'
import { Alert, Linking } from 'react-native'

import { getScreenFromDeeplink } from 'features/deeplinks/getScreenFromDeeplink'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsData } from 'libs/analytics/analytics'
import { MonitoringError } from 'libs/monitoring'

import { isAppUrl } from './isAppUrl'
import { navigateToHome } from './navigateToHome'

const openAppUrl = (url: string) => {
  try {
    const { screen, params } = getScreenFromDeeplink(url)
    return navigateFromRef(screen, params)
  } catch {
    // If an error is thrown, that means that no routes were matched
    return navigateToHome()
  }
}

type paramsProps = {
  shouldLogEvent?: boolean
  fallbackUrl?: string
  analyticsData?: OfferAnalyticsData
}

const openExternalUrl = async (
  url: string,
  { shouldLogEvent = true, fallbackUrl, analyticsData }: paramsProps
) => {
  try {
    await Linking.openURL(url)
    if (shouldLogEvent) analytics.logOpenExternalUrl(url, { ...analyticsData })
    return
  } catch (error) {
    if (error instanceof Error) new MonitoringError(error.message, 'OpenExternalUrlError')
  }

  if (fallbackUrl) {
    try {
      await Linking.openURL(fallbackUrl)
      if (shouldLogEvent) analytics.logOpenExternalUrl(fallbackUrl, { ...analyticsData })
      return
    } catch (error) {
      if (error instanceof Error)
        new MonitoringError(error.message, 'OpenExternalUrlError_FallbackUrl')
    }
  }
  showAlert(url)
}

const showAlert = (url: string) => {
  const alertTitle = t`Problème technique ;(`
  const alertMessage = t`Nous n'arrivons pas à ouvrir ce lien : ${url}`
  const alertButtons = undefined
  const alertAndroidOptions = { cancelable: true }
  Alert.alert(alertTitle, alertMessage, alertButtons, alertAndroidOptions)
}

export async function openUrl(
  url: string,
  { shouldLogEvent = true, fallbackUrl, analyticsData }: paramsProps = {}
) {
  if (isAppUrl(url)) {
    return openAppUrl(url)
  }

  openExternalUrl(url, { shouldLogEvent, fallbackUrl, analyticsData })
}
