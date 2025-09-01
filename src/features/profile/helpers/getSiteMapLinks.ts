import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { CategoryButtonProps } from 'shared/categoryButton/CategoryButton'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

type SubPage = {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
  isLoggedIn: boolean
}

export type SiteMap = SubPage & { subPages: SubPage[] }

const toInternalNavigationProps = ([screen, params]: ReturnType<typeof getTabHookConfig>) => ({
  screen,
  params,
})

export const getSiteMapLinks = (
  sortedCategories: Pick<CategoryButtonProps, 'label' | 'navigateTo'>[]
): SiteMap[] => [
  {
    wording: 'Accueil',
    navigateTo: toInternalNavigationProps(getTabHookConfig('Home')),
    isLoggedIn: false,
    subPages: [],
  },
  {
    wording: 'Recherche',
    navigateTo: toInternalNavigationProps(getTabHookConfig('SearchStackNavigator')),
    isLoggedIn: false,
    subPages: [
      { wording: 'Explore la carte', navigateTo: { screen: 'VenueMap' }, isLoggedIn: false },
      ...sortedCategories.map((category) => ({
        wording: category.label,
        navigateTo: category.navigateTo,
        isLoggedIn: false,
      })),
    ],
  },
  {
    wording: 'Réservations',
    navigateTo: toInternalNavigationProps(getTabHookConfig('Bookings')),
    isLoggedIn: true,
    subPages: [],
  },
  {
    wording: 'Favoris',
    navigateTo: toInternalNavigationProps(getTabHookConfig('Favorites')),
    isLoggedIn: true,
    subPages: [],
  },
  {
    wording: 'Profil',
    navigateTo: toInternalNavigationProps(getTabHookConfig('Profile')),
    isLoggedIn: false,
    subPages: [
      {
        wording: 'Créer un compte',
        navigateTo: { screen: 'SignupForm' },
        isLoggedIn: false,
      },
      {
        wording: 'Se connecter',
        navigateTo: { screen: 'Login' },
        isLoggedIn: false,
      },
      {
        wording: 'Mes succès',
        navigateTo: { screen: 'Achievements' },
        isLoggedIn: true,
      },
      {
        wording: 'Notifications',
        navigateTo: getProfilePropConfig('NotificationsSettings'),
        isLoggedIn: false,
      },
      {
        wording: 'Comment ça marche\u00a0?',
        navigateTo: getProfilePropConfig('ProfileTutorialAgeInformationCredit'),
        isLoggedIn: false,
      },
      {
        wording: 'Informations personnelles',
        navigateTo: getProfilePropConfig('PersonalData'),
        isLoggedIn: true,
      },
      {
        wording: 'Préférence d’affichage',
        navigateTo: getProfilePropConfig('DisplayPreference'),
        isLoggedIn: false,
      },
      {
        wording: 'Accessibilité',
        navigateTo: getProfilePropConfig('Accessibility'),
        isLoggedIn: false,
      },
      {
        wording: 'Faire une suggestion',
        navigateTo: getProfilePropConfig('FeedbackInApp'),
        isLoggedIn: false,
      },
      {
        wording: 'Informations légales',
        navigateTo: getProfilePropConfig('LegalNotices'),
        isLoggedIn: false,
      },
      {
        wording: 'Confidentialité',
        navigateTo: getProfilePropConfig('ConsentSettings'),
        isLoggedIn: false,
      },
      {
        wording: 'Débuggage',
        navigateTo: getProfilePropConfig('DebugScreen'),
        isLoggedIn: true,
      },
    ],
  },
]
