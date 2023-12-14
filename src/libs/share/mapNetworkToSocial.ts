import { Platform } from 'react-native'
import { ShareSingleOptions, Social } from 'react-native-share'

import { Network } from 'libs/share/types'

type NetworkOptions = ShareSingleOptions & {
  shouldEncodeURI?: boolean
  supportsURL: boolean
  webUrl?: string
}

export const mapNetworkToSocial: Record<Network, NetworkOptions> = {
  [Network.instagram]: {
    social: Social.Instagram,
    shouldEncodeURI: Platform.OS === 'ios',
    supportsURL: false,
    type: 'text',
  },
  [Network.messenger]: {
    social: Social.Messenger,
    shouldEncodeURI: Platform.OS === 'ios',
    supportsURL: true,
  },
  [Network.snapchat]: { social: Social.Snapchat, supportsURL: true },
  [Network.googleMessages]: {
    social: Social.Sms,
    recipient: '',
    supportsURL: true,
  },
  [Network.whatsapp]: {
    social: Social.Whatsapp,
    supportsURL: true,
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
  [Network.twitter]: {
    social: Social.Twitter,
    supportsURL: true,
    webUrl: 'https://twitter.com/intent/tweet?text=',
  },
  [Network.imessage]: {
    social: Social.Sms,
    supportsURL: false,
    url: 'sms://&body=',
  },
}
