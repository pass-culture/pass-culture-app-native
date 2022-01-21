import { FC } from 'react'
import { Platform } from 'react-native'

import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Instagram } from 'ui/svg/icons/socialNetwork/Instagram'
import { Snapchat } from 'ui/svg/icons/socialNetwork/Snapchat'
import { TikTok } from 'ui/svg/icons/socialNetwork/TikTok'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { IconInterface } from 'ui/svg/icons/types'

export type SocialNetwork = 'facebook' | 'instagram' | 'snapchat' | 'twitter' | 'tiktok'

const FACEBOOK_ID = '2202916773290436'
const FACEBOOK_WEB_URL = 'https://www.facebook.com/passCultureofficiel/'
const FACEBOOK_URL = Platform.select({
  default: FACEBOOK_WEB_URL,
  ios: `fb://page/?id=${FACEBOOK_ID}`,
  android: `fb://page/${FACEBOOK_ID}`,
})

export const SocialNetworkIconsMap: Record<
  SocialNetwork,
  {
    icon: FC<IconInterface>
    link: string
    fallbackLink?: string
  }
> = {
  facebook: { icon: Facebook, link: FACEBOOK_URL, fallbackLink: FACEBOOK_WEB_URL },
  instagram: { icon: Instagram, link: 'https://www.instagram.com/passcultureofficiel/?hl=fr' },
  snapchat: { icon: Snapchat, link: 'https://story.snapchat.com/@pass.culture' },
  twitter: { icon: Twitter, link: 'https://twitter.com/pass_Culture' },
  tiktok: { icon: TikTok, link: 'https://www.tiktok.com/@passcultureofficiel' },
}
