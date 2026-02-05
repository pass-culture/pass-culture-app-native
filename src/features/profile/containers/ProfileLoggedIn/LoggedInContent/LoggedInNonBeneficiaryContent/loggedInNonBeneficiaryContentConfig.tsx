import React from 'react'

import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import {
  LoggedInContentConfig,
  LoggedInNonBeneficiaryContentParams,
} from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/types'
import { env } from 'libs/environment/env'
import { Bell } from 'ui/svg/icons/Bell'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { Profile } from 'ui/svg/icons/Profile'

export const loggedInNonBeneficiaryContentConfig = ({
  AppearanceButton,
  ChatbotButton,
  FeedbackInAppButton,
  HelpButton,
  LocationButton,
}: LoggedInNonBeneficiaryContentParams): LoggedInContentConfig[] => [
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
      { component: ChatbotButton, key: 'ChatbotButton' },
      { component: HelpButton, key: 'HelpButton' },
      { title: 'Centre d’aide', externalNav: { url: env.ACCESSIBILITY_PLAN } },
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
    items: [{ component: <ShareBanner />, key: 'ShareBanner' }],
  },
  {
    section: 'Suivre le pass Culture',
    items: [{ component: <SocialNetwork />, key: 'SocialNetwork' }],
  },
]
