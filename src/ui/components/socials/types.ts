import { FC } from 'react'

import { Facebook } from 'ui/svg/icons/Facebook'
import { Instagram } from 'ui/svg/icons/Instagram'
import { Snapchat } from 'ui/svg/icons/Snapchat'
import { Twitter } from 'ui/svg/icons/Twitter'
import { IconInterface } from 'ui/svg/icons/types'

export type SocialNetwork = 'facebook' | 'instagram' | 'snapchat' | 'twitter'

export const SocialNetworkIconsMap: Record<
  SocialNetwork,
  {
    icon: FC<IconInterface>
    link: string
  }
> = {
  facebook: { icon: Facebook, link: 'https://www.facebook.com/passCultureofficiel/' },
  instagram: { icon: Instagram, link: 'https://www.instagram.com/passcultureofficiel/?hl=fr' },
  snapchat: { icon: Snapchat, link: 'https://www.snapchat.com/add/pass.culture' },
  twitter: { icon: Twitter, link: 'https://twitter.com/pass_Culture' },
}
