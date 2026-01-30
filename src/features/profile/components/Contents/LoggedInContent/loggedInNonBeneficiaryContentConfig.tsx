import React from 'react'

import {
  LoggedInContentConfig,
  LoggedInContentParams,
} from 'features/profile/components/Contents/LoggedInContent/types'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { env } from 'libs/environment/env'
import { Bell } from 'ui/svg/icons/Bell'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { Profile } from 'ui/svg/icons/Profile'

export const loggedInNonBeneficiaryContentConfig = ({
  HelpButton,
  AppearanceButton,
  LocationButton,
  FeedbackInAppButton,
}: LoggedInContentParams): LoggedInContentConfig[] => [
  {
    section: 'Paramètres du compte',
    items: [
      { title: 'Informations personnelles', screen: 'PersonalData', icon: Profile },
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
      { component: FeedbackInAppButton, key: 'FeedbackInAppButton' },
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
