import React from 'react'

import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import {
  LoggedInBeneficiaryContentParams,
  LoggedInContentConfig,
} from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/types'
import { env } from 'libs/environment/env'
import { Bell } from 'ui/svg/icons/Bell'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { Profile } from 'ui/svg/icons/Profile'
import { Trophy } from 'ui/svg/icons/Trophy'

export const loggedInBeneficiaryContentConfig = ({
  AppearanceButton,
  ChatbotButton,
  FeedbackInAppButton,
  LocationButton,
}: LoggedInBeneficiaryContentParams): LoggedInContentConfig[] => [
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
      { title: 'Centre d’aide', externalNav: { url: env.ACCESSIBILITY_PLAN } },
    ],
  },
  {
    section: 'Autres',
    items: [
      { title: 'Mes succès', screen: 'Achievements', params: { from: 'profile' }, icon: Trophy },
      { component: AppearanceButton, key: 'AppearanceButton' },
      { title: 'Accessibilité', screen: 'Accessibility', icon: HandicapMental },
      { component: FeedbackInAppButton, key: 'FeedbackInAppButton' },
      { title: 'Informations légales', screen: 'LegalNotices', icon: LegalNotices },
      { title: 'Confidentialité', screen: 'ConsentSettings', icon: Confidentiality },
    ],
  },
  {
    section: 'Suivre le pass Culture',
    items: [{ component: <SocialNetwork />, key: 'SocialNetwork' }],
  },
]
