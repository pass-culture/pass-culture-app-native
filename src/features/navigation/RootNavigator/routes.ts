import { ForgottenPassword } from 'features/auth/pages/forgottenPassword/ForgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/pages/forgottenPassword/ReinitializePassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/forgottenPassword/ResetPasswordEmailSent/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/pages/forgottenPassword/ResetPasswordExpiredLink/ResetPasswordExpiredLink'
import { Login } from 'features/auth/pages/login/Login'
import { AccountCreated } from 'features/auth/pages/signup/AccountCreated/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/pages/signup/AfterSignupEmailValidationBuffer/AfterSignupEmailValidationBuffer'
import { NotYetUnderageEligibility } from 'features/auth/pages/signup/NotYetUnderageEligibility/NotYetUnderageEligibility'
import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { SignupConfirmationExpiredLink } from 'features/auth/pages/signup/SignupConfirmationExpiredLink/SignupConfirmationExpiredLink'
import { SignupForm } from 'features/auth/pages/signup/SignupForm'
import { VerifyEligibility } from 'features/auth/pages/signup/VerifyEligiblity/VerifyEligibility'
import { AccountReactivationSuccess } from 'features/auth/pages/suspendedAccount/AccountReactivationSuccess/AccountReactivationSuccess'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { SuspendedAccountUponUserRequest } from 'features/auth/pages/suspendedAccount/SuspendedAccountUponUserRequest/SuspendedAccountUponUserRequest'
import { SuspensionScreen } from 'features/auth/pages/suspendedAccount/SuspensionScreen/SuspensionScreen'
import { EighteenBirthday } from 'features/birthdayNotifications/pages/EighteenBirthday'
import { RecreditBirthdayNotification } from 'features/birthdayNotifications/pages/RecreditBirthdayNotification'
import { BookingDetails } from 'features/bookings/pages/BookingDetails/BookingDetails'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { BannedCountryError } from 'features/errors/pages/BannedCountryError'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { AppComponents } from 'features/internal/cheatcodes/pages/AppComponents/AppComponents'
import { CheatCodes } from 'features/internal/cheatcodes/pages/CheatCodes/CheatCodes'
import { CheatMenu } from 'features/internal/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/internal/cheatcodes/pages/Navigation'
import { NavigationAccountSuspension } from 'features/internal/cheatcodes/pages/NavigationAccountSuspension'
import { NavigationNotScreensPages } from 'features/internal/cheatcodes/pages/NavigationNotScreensPages'
import { NavigationProfile } from 'features/internal/cheatcodes/pages/NavigationProfile'
import { NavigationShareApp } from 'features/internal/cheatcodes/pages/NavigationShareApp/NavigationShareApp'
import { NavigationSubscription } from 'features/internal/cheatcodes/pages/NavigationSubscription/NavigationSubscription'
import { CategoryThematicHomeHeaderCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/CategoryThematicHomeHeaderCheatcode'
import { DefaultThematicHomeHeaderCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/DefaultThematicHomeHeaderCheatcode'
import { HighlightThematicHomeHeaderCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/HighlightThematicHomeHeaderCheatcode'
import { ThematicHeaders } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/ThematicHeaders'
import { ThematicHomeWithSubscribeCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/ThematicHomeWithSubscribeCheatcode'
import { DeeplinksGenerator } from 'features/internal/marketingAndCommunication/pages/DeeplinksGenerator'
import { UTMParameters } from 'features/internal/marketingAndCommunication/pages/UTMParameters'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { accessibilityRoutes } from 'features/navigation/RootNavigator/accessibilityRoutes'
import { culturalSurveyRoutes } from 'features/navigation/RootNavigator/culturalSurveyRoutes'
import { tutorialRoutes } from 'features/navigation/RootNavigator/onboardingRoutes'
import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'
import { trustedDeviceRoutes } from 'features/navigation/RootNavigator/trustedDeviceRoutes'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/routes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccess'
import { LegalNotices } from 'features/profile/pages/LegalNotices/LegalNotices'
import { NewEmailSelection } from 'features/profile/pages/NewEmailSelection/NewEmailSelection'
import { NotificationSettingsDeprecated } from 'features/profile/pages/NotificationSettings/NotificationSettingsDeprecated'
import { PersonalData } from 'features/profile/pages/PersonalData/PersonalData'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { ProfileTutorialAgeInformation } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformation'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import { ABTestingPOC } from 'libs/firebase/remoteConfig/ABTestingPOC'

import { RootRoute } from './types'

export const routes: RootRoute[] = [
  ...accessibilityRoutes,
  ...culturalSurveyRoutes,
  ...tutorialRoutes,
  ...subscriptionRoutes,
  ...trustedDeviceRoutes,
  {
    name: 'Offer',
    component: Offer,
    pathConfig: {
      path: 'offre/:id',
      deeplinkPaths: ['offer/:id', 'offre', 'offer'],
      parse: screenParamsParser['Offer'],
    },
    options: { title: 'Offre' },
  },
  {
    name: 'OfferPreview',
    component: OfferPreview,
    path: 'offre/:id/apercu',
    deeplinkPaths: ['offer/:id/apercu', 'offre/apercu', 'offer/apercu'],
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
    name: 'PageNotFound',
    component: PageNotFound,
    path: '*',
    options: { title: 'Page introuvable' },
  },
  {
    name: 'AccountCreated',
    component: AccountCreated,
    path: 'creation-compte/confirmation',
    options: { title: 'Compte créé\u00a0!' },
  },
  {
    name: 'ConfirmChangeEmail',
    component: ConfirmChangeEmail,
    path: 'changement-email/confirmation',
    options: { title: 'Confirmation de changement d’email ' },
  },
  {
    name: 'ValidateEmailChange',
    component: ValidateEmailChange,
    path: 'changement-email/validation',
    options: { title: 'Confirmation de changement d’email ' },
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
  { name: 'AppComponents', component: AppComponents, path: 'composants-app' },
  {
    name: 'BannedCountryError',
    component: BannedCountryError,
    hoc: withAsyncErrorBoundary,
    path: 'erreur-pays',
  },
  {
    name: 'ChangeEmailExpiredLink',
    component: ChangeEmailExpiredLink,
    path: 'lien-modification-email-expire',
    options: { title: 'Lien de modification de l’email expiré' },
  },
  { name: 'CheatCodes', component: CheatCodes, path: 'cheat-codes' },
  { name: 'CheatMenu', component: CheatMenu, path: 'cheat-menu' },
  {
    name: 'ConsentSettings',
    component: ConsentSettings,
    path: 'profil/confidentialite',
    options: { title: 'Paramètres de confidentialité' },
  },
  {
    name: 'EndedBookings',
    component: EndedBookings,
    path: 'reservations-terminees',
    options: { title: 'Réservations terminées' },
    secure: true,
  },
  {
    name: 'FavoritesSorts',
    component: FavoritesSorts,
    path: 'favoris/tri',
    options: { title: 'Tri des favoris' },
    secure: true,
  },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    path: 'mot-de-passe-oublie',
    options: { title: 'Mot de passe oublié' },
  },
  {
    name: 'LegalNotices',
    component: LegalNotices,
    path: 'notices-legales',
    options: { title: 'Informations légales' },
  },
  {
    // debug route: in navigation component
    name: 'NavigationAccountSuspension',
    component: NavigationAccountSuspension,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-account-suspension',
  },
  {
    name: 'SuspensionScreen',
    component: SuspensionScreen,
    path: 'compte-desactive',
    options: { title: 'Compte désactivé' },
  },
  {
    name: 'SuspendedAccountUponUserRequest',
    component: SuspendedAccountUponUserRequest,
    path: 'compte-suspendu-a-la-demande',
    options: { title: 'Compte désactivé' },
  },
  {
    name: 'FraudulentSuspendedAccount',
    component: FraudulentSuspendedAccount,
    path: 'compte-suspendu-pour-fraude',
    options: { title: 'Compte suspendu' },
  },
  {
    name: 'AccountReactivationSuccess',
    component: AccountReactivationSuccess,
    path: 'compte-reactive',
    options: { title: 'Compte réactivé' },
    secure: true,
  },
  {
    name: 'ConfirmDeleteProfile',
    component: ConfirmDeleteProfile,
    path: 'profil/suppression',
    options: { title: 'Suppression de compte' },
    secure: true,
  },
  {
    name: 'DeleteProfileSuccess',
    component: DeleteProfileSuccess,
    path: 'profile/suppression/confirmation',
    options: { title: 'Suppression profil confirmée' },
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
    name: 'Navigation',
    component: Navigation,
    path: 'cheat-navigation',
  },
  {
    name: 'NavigationNotScreensPages',
    component: NavigationNotScreensPages,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-not-screens-pages',
  },
  {
    name: 'NavigationProfile',
    component: NavigationProfile,
    path: 'cheat-navigation-profile',
  },
  {
    name: 'NotificationSettings',
    component: NotificationSettingsDeprecated,
    path: 'profil/notifications',
    options: { title: 'Réglages de notifications' },
  },
  {
    name: 'NavigationShareApp',
    component: NavigationShareApp,
    path: 'cheat-navigation-share-app',
  },
  {
    name: 'NavigationSubscription',
    component: NavigationSubscription,
    path: 'cheat-navigation-subscription',
  },
  {
    name: 'PersonalData',
    component: PersonalData,
    path: 'profil/donnees-personnelles',
    options: { title: 'Mes informations personnelles' },
  },
  {
    name: 'ChangeEmail',
    component: ChangeEmail,
    path: 'profil/modification-email',
    options: { title: 'Modification de l’e-mail' },
  },
  {
    name: 'TrackEmailChange',
    component: TrackEmailChange,
    path: 'profil/suivi-modification-email',
    options: { title: 'Suivi de ton changement d’e-mail' },
    secure: true,
  },
  {
    name: 'NewEmailSelection',
    component: NewEmailSelection,
    path: 'profil/nouvelle-adresse-email',
    options: { title: 'Nouvelle adresse e-mail' },
    secure: true,
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
    path: 'profil/modification-mot-de-passe',
    options: { title: 'Modification du mot de passe' },
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
    name: 'ResetPasswordEmailSent',
    component: ResetPasswordEmailSent,
    path: 'email-modification-mot-de-passe-envoye',
    options: { title: 'Email modification mot de passe envoyé' },
  },
  {
    name: 'ResetPasswordExpiredLink',
    component: ResetPasswordExpiredLink,
    path: 'email-modification-mot-de-passe-expire',
    options: { title: 'Email modification mot de passe expiré' },
  },
  {
    name: 'SuspendAccountConfirmation',
    component: SuspendAccountConfirmation,
    path: 'suspension-compte/confirmation',
    options: { title: 'Suspension de compte' },
  },
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
    name: 'SignupForm',
    component: SignupForm,
    path: 'creation-compte',
    deeplinkPaths: ['creation-compte/email'],
    options: { title: 'Création de compte' },
  },
  {
    name: 'SignupConfirmationEmailSent',
    component: SignupConfirmationEmailSentPage,
    path: 'email-confirmation-creation-compte/envoye',
    options: { title: 'Email création de compte envoyé' },
  },
  {
    name: 'SignupConfirmationExpiredLink',
    component: SignupConfirmationExpiredLink,
    path: 'email-confirmation-creation-compte/expire',
    options: { title: 'Email création de compte expiré' },
  },
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  {
    name: 'VerifyEligibility',
    component: VerifyEligibility,
    path: 'verification-eligibilite',
    options: { title: 'Vérification éligibilité' },
  },
  {
    name: 'NotYetUnderageEligibility',
    component: NotYetUnderageEligibility,
    path: 'cest-pour-bientot',
    options: { title: 'C’est pour bientôt' },
  },
  {
    name: 'Tutorial',
    component: ProfileTutorialAgeInformation,
    path: 'comment-ca-marche',
    options: { title: 'Tutoriel "Comment ça marche"' },
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
    name: 'VenueMap',
    component: VenueMap,
    pathConfig: {
      path: 'carte-des-lieux',
      parse: screenParamsParser['VenueMap'],
      stringify: screenParamsStringifier['VenueMap'],
    },
    options: { title: 'Carte des lieux' },
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
    name: 'ABTestingPOC',
    component: ABTestingPOC,
    pathConfig: {
      path: 'ab-testing-poc',
    },
    options: { title: 'POC A/B Testing' },
  },
  {
    // debug route: in navigation component
    name: 'DefaultThematicHomeHeaderCheatcode',
    component: DefaultThematicHomeHeaderCheatcode,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-default-home-header',
  },
  {
    // debug route: in navigation component
    name: 'HighlightThematicHomeHeaderCheatcode',
    component: HighlightThematicHomeHeaderCheatcode,
    path: 'cheat-highlight-home-header',
  },
  {
    // debug route: in navigation component
    name: 'CategoryThematicHomeHeaderCheatcode',
    component: CategoryThematicHomeHeaderCheatcode,
    path: 'cheat-category-home-header',
  },
  {
    // debug route: in navigation component
    name: 'ThematicHomeWithSubscribeCheatcode',
    component: ThematicHomeWithSubscribeCheatcode,
    path: 'cheat-category-home-header-with-subscribe',
  },
  {
    // debug route: in navigation component
    name: 'ThematicHeaders',
    component: ThematicHeaders,
    path: 'cheat-thematic-home-header',
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
]
