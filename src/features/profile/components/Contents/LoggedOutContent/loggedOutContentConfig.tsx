import React from 'react'

import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { SectionItem } from 'features/profile/containers/createProfileContent'
import { env } from 'libs/environment/env'
import { Bell } from 'ui/svg/icons/Bell'
import { Bulb } from 'ui/svg/icons/Bulb'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'

type LoggedOutContentConfig = {
  section: string
  items: SectionItem[]
}

type LoggedOutContentParams = {
  HelpButton: React.ReactNode
} & {
  AppearanceButton: React.ReactNode
} & {
  LocationButton: React.ReactNode
}

export const loggedOutContentConfig = ({
  HelpButton,
  AppearanceButton,
  LocationButton,
}: LoggedOutContentParams): LoggedOutContentConfig[] => [
  {
    section: 'Paramètres de l’application',
    items: [
      { title: 'Notifications', screen: 'NotificationsSettings', icon: Bell },
      { component: LocationButton, key: 'LocationButton' },
    ],
  },
  {
    section: 'Aides',
    items: [
      { component: HelpButton, key: 'HelpButton' },
      { title: 'Center d’aide', externalNav: { url: env.ACCESSIBILITY_PLAN } },
    ],
  },
  {
    section: 'Autres',
    items: [
      { component: AppearanceButton, key: 'AppearanceButton' },
      { title: 'Accessibilité', screen: 'Accessibility', icon: HandicapMental },
      { title: 'Faire une suggestion', screen: 'FeedbackInApp', icon: Bulb },
      { title: 'Informations légales', screen: 'LegalNotices', icon: LegalNotices },
      { title: 'Confidentialité', screen: 'ConsentSettings', icon: Confidentiality },
    ],
  },
  {
    section: 'Partager le pass Culture',
    items: [{ component: <ShareBanner />, key: 'ShareBanner', excludePlatforms: ['web'] }],
  },
  {
    section: 'Suivre le pass Culture',
    items: [{ component: <SocialNetwork />, key: 'SocialNetwork' }],
  },
]
