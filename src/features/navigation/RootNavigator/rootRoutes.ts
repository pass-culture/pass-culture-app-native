import { Artist } from 'features/artist/pages/Artist'
import { ReinitializePassword } from 'features/auth/pages/forgottenPassword/ReinitializePassword/ReinitializePassword'
import { Login } from 'features/auth/pages/login/Login'
import { AfterSignupEmailValidationBuffer } from 'features/auth/pages/signup/AfterSignupEmailValidationBuffer/AfterSignupEmailValidationBuffer'
import { SignupForm } from 'features/auth/pages/signup/SignupForm'
import { EighteenBirthday } from 'features/birthdayNotifications/pages/EighteenBirthday'
import { RecreditBirthdayNotification } from 'features/birthdayNotifications/pages/RecreditBirthdayNotification'
import { BookingDetails } from 'features/bookings/pages/BookingDetails/BookingDetails'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { BannedCountryError } from 'features/errors/pages/BannedCountryError'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { DeeplinksGenerator } from 'features/internal/pages/DeeplinksGenerator'
import { UTMParameters } from 'features/internal/pages/UTMParameters'
import { culturalSurveyRoutes } from 'features/navigation/RootNavigator/culturalSurveyRoutes'
import { temporaryRootStackConfig } from 'features/navigation/RootNavigator/linking/temporaryRootStackConfig'
import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'
import { trustedDeviceRoutes } from 'features/navigation/RootNavigator/trustedDeviceRoutes'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/tabBarRoutes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { VenuePreviewCarousel } from 'features/venue/pages/VenuePreviewCarousel/VenuePreviewCarousel'

import { RootRoute, RootScreenNames } from './types'

export const rootRoutes: RootRoute[] = [
  ...culturalSurveyRoutes,
  ...subscriptionRoutes,
  ...trustedDeviceRoutes,
  {
    name: 'OfferPreview',
    component: OfferPreview,
    pathConfig: {
      path: 'offre/:id/apercu',
      deeplinkPaths: ['offer/:id/apercu', 'offre/apercu', 'offer/apercu'],
      parse: screenParamsParser['OfferPreview'],
    },
    options: { title: 'Aperçu de l’offre' },
  },
  {
    name: 'BookingDetails',
    component: BookingDetails,
    pathConfig: {
      path: 'reservation/:id/details',
      deeplinkPaths: ['booking/:id/details'],
      parse: screenParamsParser['BookingDetails'],
    },
    secure: true,
  },
  {
    name: 'BookingConfirmation',
    component: BookingConfirmation,
    pathConfig: {
      path: 'reservation/:offerId/confirmation',
      deeplinkPaths: ['booking/:offerId/confirmation'],
      parse: screenParamsParser['BookingConfirmation'],
    },
    options: { title: 'Confirmation de réservation' },
    secure: true,
  },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    path: 'anniversaire-18-ans',
    deeplinkPaths: ['eighteen'],
    options: { title: 'Anniversaire 18 ans' },
  },
  {
    name: 'RecreditBirthdayNotification',
    component: RecreditBirthdayNotification,
    path: 'recharge-credit-anniversaire',
    deeplinkPaths: ['recredit-birthday'],
    options: { title: 'Notification rechargement anniversaire' },
  },
  {
    name: 'AfterSignupEmailValidationBuffer',
    component: AfterSignupEmailValidationBuffer,
    pathConfig: {
      path: 'signup-confirmation',
      deeplinkPaths: ['creation-compte/validation-email'],
      parse: screenParamsParser['AfterSignupEmailValidationBuffer'],
    },
  },
  {
    name: 'BannedCountryError',
    component: BannedCountryError,
    hoc: withAsyncErrorBoundary,
    path: 'erreur-pays',
  },
  {
    name: 'Login',
    component: Login,
    pathConfig: {
      path: 'connexion',
      parse: screenParamsParser['Login'],
    },
    options: { title: 'Connexion' },
  },
  {
    name: 'ReinitializePassword',
    component: ReinitializePassword,
    pathConfig: {
      path: 'mot-de-passe-perdu',
      parse: screenParamsParser['ReinitializePassword'],
    },
    options: { title: 'Réinitialiser le mot de passe' },
  },
  {
    name: 'SignupForm',
    component: SignupForm,
    path: 'creation-compte',
    deeplinkPaths: ['creation-compte/email'],
    options: { title: 'Création de compte' },
  },
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  // SearchFilter could have been in TabNavigator > SearchStackNavigator but we don't want a tabBar on this screen
  {
    name: 'SearchFilter',
    component: SearchFilter,
    pathConfig: {
      path: 'recherche/filtres',
      parse: screenParamsParser['SearchFilter'],
      stringify: screenParamsStringifier['SearchFilter'],
    },
    options: { title: 'Filtres de recherche' },
  },
  {
    name: 'Venue',
    component: Venue,
    pathConfig: {
      path: 'lieu/:id',
      deeplinkPaths: ['venue/:id'],
      parse: screenParamsParser['Venue'],
    },
    options: { title: 'Lieu' },
  },
  {
    name: 'VenuePreviewCarousel',
    component: VenuePreviewCarousel,
    pathConfig: {
      path: 'lieu/:id/apercu',
      deeplinkPaths: ['venue/:id/apercu', 'lieu/apercu', 'venue/apercu'],
      parse: screenParamsParser['VenuePreviewCarousel'],
    },
    options: { title: 'Aperçu du lieu' },
  },
  {
    name: 'Artist',
    component: Artist,
    path: 'artiste/:id',
    deeplinkPaths: ['artist/:id'],
    options: { title: 'Artiste' },
  },
  // Internals
  {
    name: 'DeeplinksGenerator',
    component: DeeplinksGenerator,
    pathConfig: {
      path: 'liens/generateur',
    },
    options: { title: 'Générateur de lien' },
  },
  {
    name: 'UTMParameters',
    component: UTMParameters,
    pathConfig: {
      path: 'liens/utm',
    },
    options: { title: 'Paramètres UTM' },
  },
  {
    name: 'ThematicHome',
    component: ThematicHome,
    pathConfig: {
      path: 'accueil-thematique',
      deeplinkPaths: ['thematic-home'],
      parse: screenParamsParser['ThematicHome'],
    },
    options: { title: 'Page d’accueil thématique' },
  },
  {
    name: 'Chronicles',
    component: Chronicles,
    pathConfig: {
      path: 'avis-du-book-club/:offerId/:chronicleId',
      deeplinkPaths: ['chronicles/:offerId/:chronicleId'],
      parse: screenParamsParser['Chronicles'],
    },
    options: { title: 'Avis du book club' },
  },
]

export function isRootStackScreen(screen: string): screen is RootScreenNames {
  const screensRemovedFromRootRoutes = Object.keys(temporaryRootStackConfig)
  const rootStackRouteNames = rootRoutes.map((route): string => route.name)
  return [...rootStackRouteNames, ...screensRemovedFromRootRoutes].includes(screen)
}
