import { Platform, Share, ShareAction } from 'react-native'

import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'
import { share } from 'libs/share/shareBest'

const shareAppTitle = 'Profite toi aussi de tous les bons plans du pass Culture'

export const shareApp = (utmMedium: string) => {
  const url = `${WEBAPP_V2_URL}/accueil`
  const urlWithUtmParams = `${url}?utm_gen=product&utm_campaign=share_app&utm_medium=${utmMedium}`

  const shareAppContent = {
    url: urlWithUtmParams,
    body: shareAppTitle,
    subject: shareAppTitle,
  }
  return share({
    content: shareAppContent,
    mode: 'default',
    logAnalyticsEvent: logShareAppAnalytics,
  })
}

const logShareAppAnalytics = (shareAction: ShareAction) => {
  if (Platform.OS === 'ios') {
    if (shareAction.action === Share.sharedAction) {
      const activityType = shareAction.activityType?.replace('com.apple.', '') || ''
      analytics.logHasSharedApp(activityType)
    } else {
      analytics.logHasDismissedAppSharingModal()
    }
  }
}
