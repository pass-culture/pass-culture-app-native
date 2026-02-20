import React from 'react'

import { SectionItem } from 'features/profile/helpers/createProfileContent'
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
} & {
  SocialNetwork: React.ReactNode
}

export const loggedOutContentConfig = ({
  AppearanceButton,
  HelpButton,
  LocationButton,
  SocialNetwork,
}: LoggedOutContentParams): LoggedOutContentConfig[] => [
  {
    section: 'Paramètres',
    items: [
      { component: LocationButton, key: 'LocationButton' },
      { component: AppearanceButton, key: 'AppearanceButton' },
      {
        title: 'Notifications et thèmes et suivis',
        screen: 'NotificationsSettings',
        icon: Bell,
      },
    ],
  },
  {
    section: 'Aide',
    items: [
      { component: HelpButton, key: 'HelpButton' },
      { title: 'Chercher une info', externalNav: { url: env.ACCESSIBILITY_PLAN } },
    ],
  },
  {
    section: 'Autres',
    items: [
      { title: 'Confidentialité', screen: 'ConsentSettings', icon: Confidentiality },
      { title: 'Accessibilité', screen: 'Accessibility', icon: HandicapMental },
      { title: 'Informations légales', screen: 'LegalNotices', icon: LegalNotices },
      { title: 'Faire une suggestion', screen: 'FeedbackInApp', icon: Bulb },
    ],
  },
  {
    section: 'Suivre le pass Culture',
    items: [{ component: SocialNetwork, key: 'SocialNetwork' }],
  },
]
