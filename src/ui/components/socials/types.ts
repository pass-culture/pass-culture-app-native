import { FC } from 'react'
import { Platform } from 'react-native'

import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Instagram } from 'ui/svg/icons/socialNetwork/Instagram'
import { Snapchat } from 'ui/svg/icons/socialNetwork/Snapchat'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { IconInterface } from 'ui/svg/icons/types'

export type SocialNetwork = 'facebook' | 'instagram' | 'snapchat' | 'twitter'

const facebookAndroidLink = 'fb://page/2202916773290436'
const facebookIOSLink = 'fb://page/?id=2202916773290436'

export const SocialNetworkIconsMap: Record<
  SocialNetwork,
  {
    icon: FC<IconInterface>
    link: string
  }
> = {
  facebook: {
    icon: Facebook,
    link: Platform.OS === 'ios' ? facebookIOSLink : facebookAndroidLink,
  },

  instagram: { icon: Instagram, link: 'https://www.instagram.com/passcultureofficiel/?hl=fr' },
  snapchat: { icon: Snapchat, link: 'https://www.snapchat.com/add/pass.culture' },
  twitter: { icon: Twitter, link: 'https://twitter.com/pass_Culture' },
}
