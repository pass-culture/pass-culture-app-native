import { t } from '@lingui/macro'

import { DeeplinksGenerator } from 'features/_marketingAndCommunication/pages/DeeplinksGenerator'
import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { Login } from 'features/auth/login/Login'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { PhoneValidationTooManyAttempts } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManyAttempts'
import { PhoneValidationTooManySMSSent } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManySMSSent'
import { SetPhoneNumber } from 'features/auth/signup/PhoneValidation/SetPhoneNumber'
import { SetPhoneValidationCode } from 'features/auth/signup/PhoneValidation/SetPhoneValidationCode'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { SignupForm } from 'features/auth/signup/SignupForm'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligiblity'
import { NotYetUnderageEligibility } from 'features/auth/signup/VerifyEligiblity/NotYetUnderageEligibility'
import { BookingDetails } from 'features/bookings/pages/BookingDetails'
import { EndedBookings } from 'features/bookings/pages/EndedBookings'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes/CheatCodes'
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { NavigationNotScreensPages } from 'features/cheatcodes/pages/NavigationNotScreensPages'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
import { LandscapePositionPage } from 'features/landscapePosition/LandscapePositionPage'
import { PageNotFound } from 'features/navigation/PageNotFound'
import { identityCheckRoutes } from 'features/navigation/RootNavigator/identityCheckRoutes'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/routes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { Offer, OfferDescription } from 'features/offer'
import { AfterChangeEmailValidationBuffer } from 'features/profile/pages/AfterChangeEmailValidationBuffer'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ConfirmDeleteProfile } from 'features/profile/pages/ConfirmDeleteProfile'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfileSuccess'
import { LegalNotices } from 'features/profile/pages/LegalNotices'
import { NotificationSettings } from 'features/profile/pages/NotificationSettings'
import { PersonalData } from 'features/profile/pages/PersonalData'
import { RecreditBirthdayNotification } from 'features/recreditBirthdayNotification/pages/components/RecreditBirthdayNotification'
import { Categories as SearchCategories } from 'features/search/pages/Categories'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'
import { Venue } from 'features/venue'

import { Route } from './types'

export const routes: Route[] = [
  ...identityCheckRoutes,
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
    path: 'recherche/localisation/filtres',
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
    name: 'SearchCategories',
    component: SearchCategories,
    path: 'recherche/categories',
    options: { title: t`Recherche par catégorie` },
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
    name: 'SetPhoneNumber',
    component: SetPhoneNumber,
    path: 'creation-compte/telephone',
    options: { title: t`Ton numéro de téléphone` },
  },
  {
    name: 'LandscapePositionPage',
    component: LandscapePositionPage,
    path: 'position-paysage',
  },
  {
    name: 'SetPhoneValidationCode',
    component: SetPhoneValidationCode,
    path: 'creation-compte/code-de-validation-telephone',
    options: { title: t`Validation téléphone` },
  },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    path: 'creation-compte/code-de-validation-trop-d-essais',
    options: { title: t`Validation téléphone - Trop d'essais` },
  },
  {
    name: 'PhoneValidationTooManySMSSent',
    component: PhoneValidationTooManySMSSent,
    path: 'creation-compte/code-de-validation-trop-de-sms',
    options: { title: t`Validation téléphone - Trop de SMS envoyés` },
  },
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
]
