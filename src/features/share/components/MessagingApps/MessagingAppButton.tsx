import React from 'react'
import { Linking, Platform } from 'react-native'
import Share, { ShareSingleOptions, Social } from 'react-native-share'

import { MessagingAppContainer } from 'features/share/components/MessagingApps/MessagingAppContainer'
import { eventMonitoring } from 'libs/monitoring'
import { Network, ShareMessagingApp } from 'ui/components/ShareMessagingApp'

type MessagingAppsButtonProps = {
  network: Network
  shareMessage: string
  shareUrl: string
  onPressAnalytics: (social: Social) => void
}

const isWeb = Platform.OS === 'web'

export const MessagingAppButton = ({
  network,
  shareMessage,
  shareUrl,
  onPressAnalytics,
}: MessagingAppsButtonProps) => {
  const {
    shouldEncodeURI,
    supportsURL = true,
    isNative,
    webUrl,
    ...options
  } = mapNetworkToSocial[network]

  // Message has to be concatenated with url if url option is not supported, and in web
  const message = supportsURL && !isWeb ? shareMessage : shareMessage + '\n' + shareUrl

  const onPress = async () => {
    try {
      onPressAnalytics(options.social)
      if (isWeb && webUrl) await Linking.openURL(webUrl + encodeURIComponent(message))
      else if (isNative && options.url) await Linking.openURL(options.url + message)
      else {
        await Share.shareSingle({
          message: shouldEncodeURI ? encodeURI(message) : message,
          url: supportsURL ? shareUrl : undefined,
          ...options,
        })
      }
    } catch (e) {
      eventMonitoring.captureException(`MessagingApp click: ${e}`)
    }
  }

  return (
    <MessagingAppContainer>
      <ShareMessagingApp network={network} onPress={onPress} />
    </MessagingAppContainer>
  )
}

const mapNetworkToSocial: Record<
  Network,
  ShareSingleOptions & {
    shouldEncodeURI?: boolean
    supportsURL?: boolean
    isNative?: boolean
    webUrl?: string
  }
> = {
  [Network.instagram]: {
    social: Social.Instagram,
    supportsURL: false,
    shouldEncodeURI: Platform.OS === 'ios',
    type: 'text',
  },
  [Network.messenger]: { social: Social.Messenger },
  [Network.snapchat]: { social: Social.Snapchat },
  [Network.googleMessages]: {
    social: Social.Sms,
    recipient: '',
  },
  [Network.whatsapp]: {
    social: Social.Whatsapp,
    webUrl: 'https://api.whatsapp.com/send?text=',
  },
  [Network.telegram]: {
    social: Social.Telegram,
    webUrl: 'https://telegram.me/share/msg?url=',
  },
  [Network.viber]: {
    social: Social.Viber,
    supportsURL: false,
  },
  [Network.imessage]: {
    social: Social.Sms,
    isNative: true,
    supportsURL: false,
    url: 'sms://&body=',
  },
  [Network.twitter]: {
    social: Social.Twitter,
    webUrl: 'https://twitter.com/intent/tweet?text=',
  },
}
