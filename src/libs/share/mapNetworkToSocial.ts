import { Platform } from 'react-native'
import { ShareSingleOptions, Social } from 'react-native-share'

export enum RNShareNetwork {
  googleMessages = 'SMS',
  instagram = 'Instagram',
  messenger = 'Messenger',
  snapchat = 'Snapchat',
  telegram = 'Telegram',
  twitter = 'Twitter',
  viber = 'Viber',
  whatsapp = 'WhatsApp',
}

export const mapNetworkToSocial: Record<
  RNShareNetwork,
  ShareSingleOptions & {
    shouldEncodeURI?: boolean
    supportsURL?: boolean
    webUrl?: string
  }
> = {
  [RNShareNetwork.instagram]: {
    social: Social.Instagram,
    supportsURL: false,
    shouldEncodeURI: Platform.OS === 'ios',
    type: 'text',
  },
  [RNShareNetwork.messenger]: { social: Social.Messenger, shouldEncodeURI: Platform.OS === 'ios' },
  [RNShareNetwork.snapchat]: { social: Social.Snapchat },
  [RNShareNetwork.googleMessages]: {
    social: Social.Sms,
    recipient: '',
  },
  [RNShareNetwork.whatsapp]: {
    social: Social.Whatsapp,
    webUrl: 'https://api.whatsapp.com/send?text=',
  },
  [RNShareNetwork.telegram]: {
    social: Social.Telegram,
    webUrl: 'https://telegram.me/share/msg?url=',
    supportsURL: false,
  },
  [RNShareNetwork.viber]: {
    social: Social.Viber,
    supportsURL: false,
  },
  [RNShareNetwork.twitter]: {
    social: Social.Twitter,
    webUrl: 'https://twitter.com/intent/tweet?text=',
  },
}
