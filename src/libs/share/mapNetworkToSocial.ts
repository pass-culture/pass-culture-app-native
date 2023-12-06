import { Platform } from 'react-native'
import { ShareSingleOptions, Social } from 'react-native-share'

import { Network } from 'libs/share/types'

export const mapNetworkToSocial: Record<
  Network,
  ShareSingleOptions & {
    shouldEncodeURI?: boolean
    supportsURL?: boolean
    webUrl?: string
  }
> = {
  [Network.instagram]: {
    social: Social.Instagram,
    supportsURL: false,
    shouldEncodeURI: Platform.OS === 'ios',
    type: 'text',
  },
  [Network.messenger]: { social: Social.Messenger, shouldEncodeURI: Platform.OS === 'ios' },
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
    supportsURL: false,
  },
  [Network.viber]: {
    social: Social.Viber,
    supportsURL: false,
  },
  [Network.twitter]: {
    social: Social.Twitter,
    webUrl: 'https://twitter.com/intent/tweet?text=',
  },
  [Network.imessage]: {
    social: Social.Sms,
    supportsURL: false,
    url: 'sms://&body=',
  },
}
