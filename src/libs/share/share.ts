import { Platform, Share, ShareAction } from 'react-native'

import { analytics } from 'libs/firebase/analytics'

export type ShareContent = {
  title?: string
  message: string
  url: string
}

type ShareOptions = Parameters<typeof Share.share>[1]

export async function share(content: ShareContent, options: ShareOptions): Promise<void> {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // The only place where it's ok to deactivate the eslint rule is here.
    // Never use Share.share() outside this module.
    // eslint-disable-next-line no-restricted-properties
    const shareAction = await Share.share(content, options)
    logShareAnalytics(shareAction)
  }
  // On web, the share feature is supported by the WebShareModal component.
}

const logShareAnalytics = (shareAction: ShareAction) => {
  if (Platform.OS === 'ios') {
    if (shareAction.action === Share.sharedAction) {
      const activityType = shareAction.activityType?.replace('com.apple.', '') || ''
      analytics.logHasSharedApp(activityType)
    } else {
      analytics.logHasDismissedAppSharingModal()
    }
  }
}
