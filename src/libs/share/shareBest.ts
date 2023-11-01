import { Platform, Share, ShareAction } from 'react-native'

import { Network } from 'ui/components/ShareMessagingApp'

type ShareContent = {
  url: string
  body: string
  subject?: string
}
type ShareMode = 'default' | `${Network}`

type Arguments = {
  content: ShareContent
  mode: ShareMode
  logAnalyticsEvent?: (shareAction: ShareAction) => void
}

export const share = async ({ content, mode, logAnalyticsEvent }: Arguments) => {
  const isIos = Platform.OS === 'ios'
  const isNative = isIos || Platform.OS === 'android'

  if (mode === 'default') {
    if (isNative) {
      const shareContent = isIos
        ? {
            message: `${content.body}\u00a0:\n`,
            url: content.url,
          }
        : {
            title: content.subject,
            message: `${content.body}\u00a0:\n${content.url}`,
          }

      const shareOptions = isIos
        ? {
            subject: content.subject,
          }
        : { dialogTitle: content.subject }

      // The only place where it's ok to deactivate the eslint rule is here.
      // Never use Share.share() outside this module.
      // eslint-disable-next-line no-restricted-properties
      const shareAction = await Share.share(shareContent, shareOptions)
      logAnalyticsEvent?.(shareAction)
    }
    // On web, the share feature is supported by the WebShareModal component.
  }
}
