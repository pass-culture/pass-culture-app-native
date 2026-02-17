import {
  LoggedInContentConfig,
  LoggedInContentParams,
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
  HelpButton,
  LocationButton,
  ShareBanner,
  SocialNetwork,
}: LoggedInContentParams): LoggedInContentConfig[] => [
  {
    section: 'Profil',
    items: [
      { title: 'Mes succès', screen: 'Achievements', params: { from: 'profile' }, icon: Trophy },
      { title: 'Informations personnelles', screen: 'PersonalData', icon: Profile },
    ],
  },
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
      { component: ChatbotButton, key: 'ChatbotButton' },
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
      { component: FeedbackInAppButton, key: 'FeedbackInAppButton' },
    ],
  },
  {
    section: 'Partager le pass Culture',
    items: [{ component: ShareBanner, key: 'ShareBanner' }],
  },
  {
    section: 'Suivre le pass Culture',
    items: [{ component: SocialNetwork, key: 'SocialNetwork' }],
  },
]
