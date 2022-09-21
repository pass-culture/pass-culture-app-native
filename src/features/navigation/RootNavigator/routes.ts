import { t } from '@lingui/macro'

import { DeeplinksGenerator } from 'features/_marketingAndCommunication/pages/DeeplinksGenerator'
import { UTMParameters } from 'features/_marketingAndCommunication/pages/UTMParameters'
import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { Login } from 'features/auth/login/Login'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { SignupForm } from 'features/auth/signup/SignupForm'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligiblity'
import { NotYetUnderageEligibility } from 'features/auth/signup/VerifyEligiblity/NotYetUnderageEligibility'
import { AccountReactivationSuccess } from 'features/auth/suspendedAccount/AccountReactivationSuccess/AccountReactivationSuccess'
import { FraudulentAccount } from 'features/auth/suspendedAccount/FraudulentAccount/FraudulentAccount'
import { SuspendedAccount } from 'features/auth/suspendedAccount/SuspendedAccount/SuspendedAccount'
import { SuspensionScreen } from 'features/auth/suspendedAccount/SuspensionScreen/SuspensionScreen'
import { BookingDetails } from 'features/bookings/pages/BookingDetails'
import { EndedBookings } from 'features/bookings/pages/EndedBookings'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes/CheatCodes'
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { NavigationAccountSuspension } from 'features/cheatcodes/pages/NavigationAccountSuspension'
import { NavigationNotScreensPages } from 'features/cheatcodes/pages/NavigationNotScreensPages'
import { NavigationProfile } from 'features/cheatcodes/pages/NavigationProfile'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { BannedCountryError } from 'features/errors/pages/BannedCountryError'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
import { PageNotFound } from 'features/navigation/PageNotFound'
import { culturalSurveyRoutes } from 'features/navigation/RootNavigator/culturalSurveyRoutes'
import { identityCheckRoutes } from 'features/navigation/RootNavigator/identityCheckRoutes'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/routes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { Offer, OfferDescription } from 'features/offer'
import { AfterChangeEmailValidationBuffer } from 'features/profile/pages/AfterChangeEmailValidationBuffer'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccess'
import { LegalNotices } from 'features/profile/pages/LegalNotices'
import { NotificationSettings } from 'features/profile/pages/NotificationSettings/NotificationSettings'
import { PersonalData } from 'features/profile/pages/PersonalData/PersonalData'
import { RecreditBirthdayNotification } from 'features/recreditBirthdayNotification/pages/components/RecreditBirthdayNotification'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'
import { Venue } from 'features/venue'
import { ABTestingPOC } from 'libs/firebase/remoteConfig/ABTestingPOC'
import { ShareAppModal } from 'libs/share/shareApp/ShareAppModal'

import { Route } from './types'

export const routes: Route[] = [
  ...identityCheckRoutes,
  ...culturalSurveyRoutes,
  {
    name: 'Offer',
    component: Offer,
    pathConfig: {
      path: 'offre/:id',
      deeplinkPaths: ['offer/:id', 'offre', 'offer'],
      parse: screenParamsParser['Offer'],
    },
    options: { title: t`Offre` },
  },
  {
    name: 'OfferDescription',
    component: OfferDescription,
    path: 'offre/:id/description',
    deeplinkPaths: ['offer/:id/description', 'offre/description', 'offer/description'],
    options: { title: t`Détails de l'offre` },
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
    options: { title: t`Confirmation de réservation` },
    secure: true,
  },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    path: 'anniversaire-18-ans',
    deeplinkPaths: ['eighteen'],
    options: { title: t`Anniversaire 18 ans` },
  },
  {
    name: 'ShareAppModal',
    component: ShareAppModal,
    path: 'partage-app',
    options: { title: t`Partage l'app` },
  },
  {
    name: 'RecreditBirthdayNotification',
    component: RecreditBirthdayNotification,
    path: 'recharge-credit-anniversaire',
    deeplinkPaths: ['recredit-birthday'],
    options: { title: t`Notification rechargement anniversaire` },
  },
  {
    name: 'PageNotFound',
    component: PageNotFound,
    path: '*',
    options: { title: t`Page introuvable` },
  },
  {
    name: 'AccountCreated',
    component: AccountCreated,
    path: 'creation-compte/confirmation',
    options: { title: t`Compte créé\u00a0!` },
  },
  {
    name: 'AfterChangeEmailValidationBuffer',
    component: AfterChangeEmailValidationBuffer,
    pathConfig: {
      path: 'changement-email',
      parse: screenParamsParser['AfterChangeEmailValidationBuffer'],
    },
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
    options: { title: t`Lien de modification de l'email expiré` },
  },
  { name: 'CheatCodes', component: CheatCodes, path: 'cheat-codes' },
  { name: 'CheatMenu', component: CheatMenu, path: 'cheat-menu' },
  {
    name: 'ConsentSettings',
    component: ConsentSettings,
    path: 'profil/confidentialite',
    options: { title: t`Paramètres de confidentialité` },
  },
  {
    name: 'CulturalSurvey',
    component: CulturalSurvey,
    path: 'questionnaire-culturel',
    options: { title: t`Questionnaire culturel` },
    secure: true,
  },
  {
    name: 'EndedBookings',
    component: EndedBookings,
    path: 'reservations-terminees',
    options: { title: t`Réservations terminées` },
    secure: true,
  },
  {
    name: 'FavoritesSorts',
    component: FavoritesSorts,
    path: 'favoris/tri',
    options: { title: t`Tri des favoris` },
    secure: true,
  },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    path: 'mot-de-passe-oublie',
    options: { title: t`Mot de passe oublié` },
  },
  {
    name: 'LegalNotices',
    component: LegalNotices,
    path: 'notices-legales',
    options: { title: t`Mentions légales` },
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
    options: { title: t`Compte désactivé` },
  },
  {
    name: 'SuspendedAccount',
    component: SuspendedAccount,
    path: 'compte-suspendu-a-la-demande',
    options: { title: t`Compte désactivé` },
  },
  {
    name: 'FraudulentAccount',
    component: FraudulentAccount,
    path: 'compte-suspendu-pour-fraude',
    options: { title: t`Compte suspendu` },
  },
  {
    name: 'AccountReactivationSuccess',
    component: AccountReactivationSuccess,
    path: 'compte-reactive',
    options: { title: t`Compte réactivé` },
    secure: true,
  },
  {
    name: 'ConfirmDeleteProfile',
    component: ConfirmDeleteProfile,
    path: 'profil/suppression',
    options: { title: t`Suppression de compte` },
    secure: true,
  },
  {
    name: 'DeleteProfileSuccess',
    component: DeleteProfileSuccess,
    path: 'profile/suppression/confirmation',
    options: { title: t`Suppression profil confirmée` },
  },
  {
    name: 'LocationFilter',
    component: LocationFilter,
    pathConfig: {
      path: 'recherche/localisation/filtres',
      parse: screenParamsParser['LocationFilter'],
      stringify: screenParamsStringifier['LocationFilter'],
    },
    options: { title: t`Recherche par localisation` },
  },
  {
    name: 'LocationPicker',
    component: LocationPicker,
    path: 'recherche/localisation/choisir-adresse',
    options: { title: t`Recherche par localisation` },
  },
  {
    name: 'Login',
    component: Login,
    pathConfig: {
      path: 'connexion',
      parse: screenParamsParser['Login'],
    },
    options: { title: t`Connexion` },
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
    component: NotificationSettings,
    path: 'profil/notifications',
    options: { title: t`Réglages de notifications` },
  },
  {
    name: 'PersonalData',
    component: PersonalData,
    path: 'profil/donnees-personnelles',
    options: { title: t`Mes informations personnelles` },
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
    path: 'profil/modification-mot-de-passe',
    options: { title: t`Modification du mot de passe` },
  },
  {
    name: 'ChangeEmail',
    component: ChangeEmail,
    path: 'profil/modification-email',
    options: { title: t`Modification de l'e-mail` },
  },
  {
    name: 'ReinitializePassword',
    component: ReinitializePassword,
    pathConfig: {
      path: 'mot-de-passe-perdu',
      parse: screenParamsParser['ReinitializePassword'],
    },
    options: { title: t`Réinitialiser le mot de passe` },
  },
  {
    name: 'ResetPasswordEmailSent',
    component: ResetPasswordEmailSent,
    path: 'email-modification-mot-de-passe-envoye',
    options: { title: t`Email modification mot de passe envoyé` },
  },
  {
    name: 'ResetPasswordExpiredLink',
    component: ResetPasswordExpiredLink,
    path: 'email-modification-mot-de-passe-expire',
    options: { title: t`Email modification mot de passe expiré` },
  },
  {
    name: 'SearchFilter',
    component: SearchFilter,
    path: 'recherche/filtres',
    options: { title: t`Filtres de recherche` },
  },
  {
    name: 'SignupForm',
    component: SignupForm,
    path: 'creation-compte',
    deeplinkPaths: ['creation-compte/email'],
    options: { title: t`Création de compte` },
  },
  {
    name: 'SignupConfirmationEmailSent',
    component: SignupConfirmationEmailSent,
    path: 'email-confirmation-creation-compte/envoye',
    options: { title: t`Email création de compte envoyé` },
  },
  {
    name: 'SignupConfirmationExpiredLink',
    component: SignupConfirmationExpiredLink,
    path: 'email-confirmation-creation-compte/expire',
    options: { title: t`Email création de compte expiré` },
  },
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  {
    name: 'VerifyEligibility',
    component: VerifyEligibility,
    path: 'verification-eligibilite',
    options: { title: t`Vérification éligibilité` },
  },
  {
    name: 'NotYetUnderageEligibility',
    component: NotYetUnderageEligibility,
    path: 'cest-pour-bientot',
    options: { title: t`C'est pour bientôt` },
  },

  {
    name: 'FirstTutorial',
    component: FirstTutorial,
    path: 'introduction-tutoriel',
    options: { title: t`Étape 1 sur 4 | Tutoriel "Comment ça marche"` },
  },
  {
    name: 'Venue',
    component: Venue,
    pathConfig: {
      path: 'lieu/:id',
      deeplinkPaths: ['venue/:id'],
      parse: screenParamsParser['Venue'],
    },
    options: { title: t`Lieu` },
  },
  // Internals
  {
    name: 'DeeplinksGenerator',
    component: DeeplinksGenerator,
    pathConfig: {
      path: 'liens/generateur',
    },
    options: { title: t`Générateur de lien` },
  },
  {
    name: 'UTMParameters',
    component: UTMParameters,
    pathConfig: {
      path: 'liens/utm',
    },
    options: { title: t`Paramètres UTM` },
  },
  {
    name: 'ABTestingPOC',
    component: ABTestingPOC,
    pathConfig: {
      path: 'ab-testing-poc',
    },
    options: { title: t`POC A/B Testing` },
  },
]
