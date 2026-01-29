import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { getTabPropConfig } from 'features/navigation/TabBar/getTabPropConfig'
import { CategoryButtonProps } from 'shared/categoryButton/CategoryButton'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

type SubPage = {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
  isLoggedIn: boolean
}

type SiteMap = SubPage & { subPages: SubPage[] }

export const getSiteMapLinks = (
  sortedCategories: Pick<CategoryButtonProps, 'label' | 'navigateTo'>[]
): SiteMap[] => [
  {
    wording: 'Accueil',
    navigateTo: getTabPropConfig('Home'),
    isLoggedIn: false,
    subPages: [],
  },
  {
    wording: 'Recherche',
    navigateTo: getTabPropConfig('SearchStackNavigator'),
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
    navigateTo: getTabPropConfig('Bookings'),
    isLoggedIn: true,
    subPages: [],
  },
  {
    wording: 'Favoris',
    navigateTo: getTabPropConfig('Favorites'),
    isLoggedIn: true,
    subPages: [],
  },
  {
    wording: 'Profil',
    navigateTo: getTabPropConfig('Profile'),
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
        navigateTo: getProfilePropConfig('Achievements'),
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
        wording: 'Apparence',
        navigateTo: getProfilePropConfig('Appearance'),
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
