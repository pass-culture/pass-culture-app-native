import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { CategoryButtonProps } from 'shared/categoryButton/CategoryButton'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

type SubPage = {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
  isLoggedIn: boolean
}

type SiteMap = SubPage & { subPages: SubPage[] }

const toInternalNavigationProps = ([screen, params]: ReturnType<typeof getTabNavConfig>) => ({
  screen,
  params,
})

export const getSiteMapLinks = (
  sortedCategories: Pick<CategoryButtonProps, 'label' | 'navigateTo'>[]
): SiteMap[] => [
  {
    wording: 'Accueil',
    navigateTo: toInternalNavigationProps(getTabNavConfig('Home')),
    isLoggedIn: false,
    subPages: [],
  },
  {
    wording: 'Recherche',
    navigateTo: toInternalNavigationProps(getTabNavConfig('SearchStackNavigator')),
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
    navigateTo: toInternalNavigationProps(getTabNavConfig('Bookings')),
    isLoggedIn: true,
    subPages: [],
  },
  {
    wording: 'Favoris',
    navigateTo: toInternalNavigationProps(getTabNavConfig('Favorites')),
    isLoggedIn: true,
    subPages: [],
  },
  {
    wording: 'Profil',
    navigateTo: toInternalNavigationProps(getTabNavConfig('Profile')),
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
        navigateTo: getProfileNavConfig('NotificationsSettings'),
        isLoggedIn: false,
      },
      {
        wording: 'Comment ça marche\u00a0?',
        navigateTo: getProfileNavConfig('ProfileTutorialAgeInformationCredit'),
        isLoggedIn: false,
      },
      {
        wording: 'Informations personnelles',
        navigateTo: getProfileNavConfig('PersonalData'),
        isLoggedIn: true,
      },
      {
        wording: 'Préférence d’affichage',
        navigateTo: getProfileNavConfig('DisplayPreference'),
        isLoggedIn: false,
      },
      {
        wording: 'Accessibilité',
        navigateTo: getProfileNavConfig('Accessibility'),
        isLoggedIn: false,
      },
      {
        wording: 'Faire une suggestion',
        navigateTo: getProfileNavConfig('FeedbackInApp'),
        isLoggedIn: false,
      },
      {
        wording: 'Informations légales',
        navigateTo: getProfileNavConfig('LegalNotices'),
        isLoggedIn: false,
      },
      {
        wording: 'Confidentialité',
        navigateTo: getProfileNavConfig('ConsentSettings'),
        isLoggedIn: false,
      },
      {
        wording: 'Débuggage',
        navigateTo: getProfileNavConfig('DebugScreen'),
        isLoggedIn: true,
      },
    ],
  },
]
