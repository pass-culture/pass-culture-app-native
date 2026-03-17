import {
  LinkingOptions,
  PathConfigMap,
  createPathConfigForStaticNavigation,
} from '@react-navigation/native'

import {
  screenParamsParser,
  screenParamsStringifier,
} from 'features/navigation/helpers/screenParamsUtils'
import { CheatcodesStackNavigator } from 'features/navigation/navigators/CheatcodesStackNavigator/CheatcodesStackNavigator'
import { OnboardingStackNavigator } from 'features/navigation/navigators/OnboardingStackNavigator/OnboardingStackNavigator'
import { ProfileStackNavigator } from 'features/navigation/navigators/ProfileStackNavigator/ProfileStackNavigator'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { SubscriptionStackNavigator } from 'features/navigation/navigators/SubscriptionStackNavigator/SubscriptionStackNavigator'
import { BottomTabNavigator } from 'features/navigation/navigators/TabNavigator/TabStackNavigator'

const rootStackNavigatorPathDefinition: PathConfigMap<RootStackParamList> = {
  // Account
  AccountCreated: {
    path: 'creation-compte/confirmation',
  },
  AfterSignupEmailValidationBuffer: {
    path: 'signup-confirmation',
    parse: screenParamsParser.AfterSignupEmailValidationBuffer,
    alias: ['creation-compte/validation-email'],
  },
  AccountStatusScreenHandler: {
    path: 'compte-desactive',
  },
  SuspendedAccountUponUserRequest: {
    path: 'compte-suspendu-a-la-demande',
  },
  FraudulentSuspendedAccount: {
    path: 'compte-suspendu-pour-fraude',
  },
  AccountReactivationSuccess: {
    path: 'compte-reactive',
  },
  AccountSecurityBuffer: {
    path: 'securisation-compte',
  },
  AccountSecurity: {
    path: 'securisation-compte/choix',
    parse: screenParamsParser.ReinitializePassword,
  },
  MandatoryUpdatePersonalData: {},
  Achievements: {
    path: 'profil/succes',
  },
  OnboardingSubscription: {
    path: 'choix-abonnement',
  },
  BannedCountryError: {
    path: 'erreur-pays',
  },
  // Authentication
  ChangeEmailExpiredLink: {
    path: 'lien-modification-email-expire',
    parse: screenParamsParser.ReinitializePassword,
  },
  ForgottenPassword: {
    path: 'mot-de-passe-oublie',
    parse: screenParamsParser.ReinitializePassword,
  },
  Login: {
    path: 'connexion',
    parse: screenParamsParser.Login,
  },
  ReinitializePassword: {
    path: 'mot-de-passe-perdu',
    parse: screenParamsParser.ReinitializePassword,
  },
  ResetPasswordEmailSent: {
    path: 'email-modification-mot-de-passe-envoye',
  },
  ResetPasswordExpiredLink: {
    path: 'email-modification-mot-de-passe-expire',
  },
  SignupForm: {
    path: 'creation-compte',
    alias: ['creation-compte/email'],
  },
  SignupConfirmationEmailSent: {
    path: 'email-confirmation-creation-compte/envoye',
  },
  SignupConfirmationExpiredLink: {
    path: 'email-confirmation-creation-compte/expire',
  },
  // Birthday
  EighteenBirthday: {
    path: 'anniversaire-18-ans',
    alias: ['eighteen'],
  },
  RecreditBirthdayNotification: {
    path: 'recharge-credit-anniversaire',
    alias: ['recredit-birthday'],
  },
  VerifyEligibility: {
    path: 'verification-eligibilite',
  },
  NotYetUnderageEligibility: {
    path: 'cest-pour-bientot',
  },
  // Booking
  BookingDetails: {
    path: 'reservation/:id/details',
    parse: screenParamsParser.BookingDetails,
    alias: ['booking/:id/details'],
  },
  BookingConfirmation: {
    path: 'reservation/:offerId/confirmation',
    parse: screenParamsParser.BookingConfirmation,
    alias: ['booking/:offerId/confirmation'],
  },
  // Misc
  FavoritesSorts: {
    path: 'favoris/tri',
  },
  SearchFilter: {
    path: 'recherche/filtres',
    parse: screenParamsParser.SearchFilter,
    stringify: screenParamsStringifier.SearchFilter,
  },
  ThematicHome: {
    path: 'accueil-thematique',
    parse: screenParamsParser.ThematicHome,
    alias: ['thematic-home'],
  },
  Artist: {
    path: 'artiste/:id',
    alias: ['artist/:id'],
  },
  ArtistWebview: {
    path: 'artiste/wikipedia/:id',
    alias: ['artist/wikipedia/:id'],
  },
  // Offer
  Offer: {
    path: 'offre/:id',
    parse: screenParamsParser.Offer,
    alias: ['offer/:id', 'offre', 'offer'],
  },
  OfferPreview: {
    path: 'offre/:id/apercu',
    parse: screenParamsParser.OfferPreview,
    alias: ['offer/:id/apercu', 'offre/apercu', 'offer/apercu'],
  },
  OfferVideoPreview: {
    path: 'offre/:id/video',
    parse: screenParamsParser.OfferVideoPreview,
  },
  // Suspension
  SuspensionChoice: {
    path: 'securisation-compte/suspension',
  },
  SuspensionChoiceExpiredLink: {
    path: 'securisation-compte/lien-suspension-compte-expire',
  },
  SuspiciousLoginSuspendedAccount: {
    path: 'securisation-compte/suspension-confirmee',
  },
  // Tools
  DeeplinksGenerator: {
    path: 'liens/generateur',
  },
  UTMParameters: {
    path: 'liens/utm',
  },
  PageNotFound: {
    path: '*',
  },
  // Venue
  Venue: {
    path: 'lieu/:id',
    parse: screenParamsParser.Venue,
    alias: ['venue/:id'],
  },
  VenueMap: {
    path: 'carte-des-lieux',
  },
  VenuePreviewCarousel: {
    path: 'lieu/:id/apercu',
    parse: screenParamsParser.VenuePreviewCarousel,
    alias: ['venue/:id/apercu', 'lieu/apercu', 'venue/apercu'],
  },
}

export const rootStackNavigatorPathConfig = {
  screens: {
    TabNavigator: {
      screens: createPathConfigForStaticNavigation(BottomTabNavigator),
    },
    CheatcodesStackNavigator: {
      screens: createPathConfigForStaticNavigation(CheatcodesStackNavigator),
    },
    ProfileStackNavigator: {
      screens: createPathConfigForStaticNavigation(ProfileStackNavigator),
    },
    OnboardingStackNavigator: {
      screens: createPathConfigForStaticNavigation(OnboardingStackNavigator),
    },
    SubscriptionStackNavigator: {
      screens: createPathConfigForStaticNavigation(SubscriptionStackNavigator),
    },
    ...rootStackNavigatorPathDefinition,
  },
} satisfies LinkingOptions<RootStackParamList>['config']
