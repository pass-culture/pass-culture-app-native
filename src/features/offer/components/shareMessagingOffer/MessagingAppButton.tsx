import React from 'react'
import { Linking, Platform } from 'react-native'
import Share, { ShareSingleOptions, Social } from 'react-native-share'

import { MessagingAppContainer } from 'features/offer/components/shareMessagingOffer/MessagingAppContainer'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { Network, ShareMessagingApp } from 'ui/components/ShareMessagingApp'

type MessagingAppsButtonProps = {
  offerId: number
  network: Network
  shareMessage: string
  shareUrl: string
}

const isWeb = Platform.OS === 'web'

export const MessagingAppButton = ({
  offerId,
  network,
  shareMessage,
  shareUrl,
}: MessagingAppsButtonProps) => {
  const {
    shouldEncodeURI,
    supportsURL = true,
    shouldEncodeURL = Platform.OS === 'ios',
    isNative,
    webUrl,
    ...options
  } = mapNetworkToSocial[network]

  // Message has to be concatenated with url if url option is not supported, and in web
  const message = supportsURL && !isWeb ? shareMessage : shareMessage + '\n' + shareUrl

  const onPress = async () => {
    try {
      analytics.logShare({ type: 'Offer', id: offerId, from: 'offer', social: options.social })
      if (isWeb && webUrl) await Linking.openURL(webUrl + encodeURIComponent(message))
      else if (isNative && options.url)
        await Linking.openURL(
          options.url + (shouldEncodeURI ? encodeURIComponent(message) : message)
        )
      else {
        await Share.shareSingle({
          message: shouldEncodeURI ? encodeURIComponent(message) : message,
          url: supportsURL
            ? shouldEncodeURL
              ? encodeURIComponent(shareUrl)
              : shareUrl
            : undefined,
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
    shouldEncodeURL?: boolean
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
    shouldEncodeURL: false,
    webUrl: 'https://api.whatsapp.com/send?text=',
  },
  [Network.telegram]: {
    social: Social.Telegram,
    supportsURL: false,
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
    shouldEncodeURI: true,
    url: 'sms://&body=',
  },
  [Network.twitter]: {
    social: Social.Twitter,
    webUrl: 'https://twitter.com/intent/tweet?text=',
  },
}
