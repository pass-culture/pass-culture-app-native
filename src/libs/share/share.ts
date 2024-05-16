import { Linking, Platform, Share, ShareAction } from 'react-native'
import SocialShare from 'react-native-share'

import { mapNetworkToSocial } from 'libs/share/mapNetworkToSocial'

import { Network, ShareContent, ShareMode } from './types'

type Arguments = {
  content: ShareContent
  mode: ShareMode
  logAnalyticsEvent?: (shareAction: ShareAction) => void
}

const shareSocial = async ({ content, mode }: { content: ShareContent; mode: `${Network}` }) => {
  const { shouldEncodeURI, supportsURL, webUrl: _, ...options } = mapNetworkToSocial[mode]

  const rawMessage = supportsURL
    ? `${content.body}\u00a0:\n`
    : `${content.body}\u00a0:\n${content.url}`
  const message = shouldEncodeURI ? encodeURIComponent(rawMessage) : rawMessage

  const rawUrl = supportsURL ? content.url : undefined
  const url = shouldEncodeURI && rawUrl ? encodeURIComponent(rawUrl) : rawUrl

  await SocialShare.shareSingle({
    ...options,
    message,
    type: 'text',
    url,
  })
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
    const body = encodeURIComponent(`${content.body}\u00a0:\n${content.url}`)
    await Linking.openURL(`sms://&body=${body}`)
  } else if (isNative) {
    await shareSocial({ content, mode })
  } else {
    const { webUrl } = mapNetworkToSocial[mode]
    const message = encodeURIComponent(`${content.body}\u00a0:\n${content.url}`)

    Linking.openURL(webUrl + message)
  }
}
