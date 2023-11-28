import { Linking, Platform, Share, ShareAction } from 'react-native'
import SocialShare from 'react-native-share'

import { mapNetworkToSocial } from 'libs/share/mapNetworkToSocial'

import { ShareContent, ShareMode } from './types'

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
  } else if (mode === 'iMessage') {
    await Linking.openURL(`sms://&body=${content.body}\u00a0:\n${content.url}`)
  } else if (!isNative) {
    const { webUrl } = mapNetworkToSocial[mode]
    const message = encodeURIComponent(`${content.body}\u00a0:\n${content.url}`)

    Linking.openURL(webUrl + message)
  } else {
    const { shouldEncodeURI, supportsURL = true, ...options } = mapNetworkToSocial[mode]

    const rawMessage = supportsURL
      ? `${content.body}\u00a0:\n`
      : `${content.body}\u00a0:\n${content.url}`
    const message = shouldEncodeURI ? encodeURIComponent(rawMessage) : rawMessage

    const rawUrl = supportsURL ? content.url : undefined
    const url = shouldEncodeURI && rawUrl ? encodeURIComponent(rawUrl) : rawUrl

    SocialShare.shareSingle({
      ...options,
      message,
      type: 'text',
      url,
    })
  }
}
