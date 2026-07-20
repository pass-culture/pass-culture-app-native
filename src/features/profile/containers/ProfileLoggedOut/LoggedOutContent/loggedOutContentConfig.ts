import { SectionItem } from 'features/profile/helpers/createProfileContent'
import { env } from 'libs/environment/env'
import { Bell } from 'ui/svg/icons/Bell'
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
  ShareBanner: React.ReactNode
} & {
  SocialNetwork: React.ReactNode
} & {
  BugReportButton: React.ReactNode
}

export const loggedOutContentConfig = ({
  AppearanceButton,
  HelpButton,
  ShareBanner,
  SocialNetwork,
  BugReportButton,
}: LoggedOutContentParams): LoggedOutContentConfig[] => [
  {
    section: 'Paramètres',
    items: [
      { component: AppearanceButton, key: 'AppearanceButton' },
      {
        title: 'Notifications et thèmes suivis',
        screen: 'NotificationsSettings',
        icon: Bell,
      },
    ],
  },
  {
    section: 'Aide',
    items: [
      { component: HelpButton, key: 'HelpButton' },
      { title: 'Chercher une info', externalNav: { url: env.FAQ_LINK } },
      { component: BugReportButton, key: 'BugReportButton' },
    ],
  },
  {
    section: 'Autres',
    items: [
      { title: 'Confidentialité', screen: 'ConsentSettings', icon: Confidentiality },
      { title: 'Accessibilité', screen: 'Accessibility', icon: HandicapMental },
      { title: 'Informations légales', screen: 'LegalNotices', icon: LegalNotices },
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
