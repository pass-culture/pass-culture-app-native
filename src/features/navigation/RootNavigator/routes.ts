import { t } from '@lingui/macro'
import {
  routes as idCheckRoutes,
  initialRouteName as idCheckInitialRouteName,
  withAsyncErrorBoundary as withIdCheckAsyncErrorBoundary,
} from '@pass-culture/id-check'

import { DeeplinksGenerator } from 'features/_marketingAndCommunication/pages/DeeplinksGenerator'
import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { IdCheckUnavailable } from 'features/auth/IdcheckUnavailable'
import { Login } from 'features/auth/login/Login'
import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { BeneficiaryRequestSent } from 'features/auth/signup/BeneficiaryRequestSent'
import { IdCheckV2 } from 'features/auth/signup/IdCheckV2'
import { NextBeneficiaryStep } from 'features/auth/signup/NextBeneficiaryStep'
import { PhoneValidationTooManyAttempts } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManyAttempts'
import { PhoneValidationTooManySMSSent } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManySMSSent'
import { SetPhoneNumber } from 'features/auth/signup/PhoneValidation/SetPhoneNumber'
import { SetPhoneValidationCode } from 'features/auth/signup/PhoneValidation/SetPhoneValidationCode'
import { SetBirthday } from 'features/auth/signup/SetBirthday'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { SetName } from 'features/auth/signup/SetName/SetName'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { SelectSchool } from 'features/auth/signup/underageSignup/SelectSchool'
import { SelectSchoolHome } from 'features/auth/signup/underageSignup/SelectSchoolHome'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligiblity'
import { NotYetUnderageEligibility } from 'features/auth/signup/VerifyEligiblity/NotYetUnderageEligibility'
import { BookingDetails } from 'features/bookings/pages/BookingDetails'
import { EndedBookings } from 'features/bookings/pages/EndedBookings'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { ABTestingPOC } from 'features/cheatcodes/pages/ABTestingPOC/ABTestingPOC'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes/CheatCodes'
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { NavigationIdCheckErrors } from 'features/cheatcodes/pages/NavigationIdCheckErrors'
import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
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

export const initialRouteName = 'TabNavigator'

export const routes: Route[] = [
  ...idCheckRoutes,
  ...identityCheckRoutes,
  { name: idCheckInitialRouteName, component: IdCheckV2, path: 'idcheck' },
  {
    name: 'Offer',
    component: Offer,
    hoc: withAsyncErrorBoundary,
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
    hoc: withAsyncErrorBoundary,
    path: 'offre/:id/description',
    deeplinkPaths: ['offer/:id/description', 'offre/description', 'offer/description'],
    options: { title: t`Détails de l'offre` },
  },
  {
    name: 'BookingDetails',
    component: BookingDetails,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: 'reservation/:id/details',
      deeplinkPaths: ['booking/:id/details'],
      parse: screenParamsParser['BookingDetails'],
    },
    options: { title: t`Détails de réservation` },
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
  { name: 'ABTestingPOC', component: ABTestingPOC, path: 'abtesting' },
  {
    name: 'AcceptCgu',
    component: AcceptCgu,
    hoc: withAsyncErrorBoundary,
    path: 'creation-compte/cgu',
    options: { title: t`Conditions d'utilisations` },
  },
  {
    name: 'AccountCreated',
    component: AccountCreated,
    path: 'creation-compte/confirmation',
    options: { title: t`Compte créé !` },
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
    hoc: withAsyncErrorBoundary,
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
    name: 'BeneficiaryRequestSent',
    component: BeneficiaryRequestSent,
    path: 'demande-beneficiaire-envoyee',
    options: { title: t`Demande bénéficiaire envoyée` },
  },
  {
    name: 'CulturalSurvey',
    component: CulturalSurvey,
    path: 'questionnaire-culturel',
    options: { title: t`Questionnaire culturel` },
    secure: true,
  },
  { name: 'DeeplinkImporter', component: DeeplinkImporter, path: 'importer-un-lien' },
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
    hoc: withAsyncErrorBoundary,
    path: 'mot-de-passe-oublie',
    options: { title: t`Mot de passe oublié` },
  },
  {
    name: 'LegalNotices',
    component: LegalNotices,
    path: 'notices-legales',
    options: { title: t`Notices légales` },
  },
  {
    name: 'ConfirmDeleteProfile',
    component: ConfirmDeleteProfile,
    path: 'profil/suppression',
    options: { title: t`Suppression profil` },
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
    options: { title: t`Recherche` },
  },
  {
    name: 'LocationPicker',
    component: LocationPicker,
    path: 'recherche/localisation/choisir-adresse',
    options: { title: t`Recherche` },
  },
  {
    name: 'Login',
    component: Login,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: 'connexion',
      parse: screenParamsParser['Login'],
    },
    options: { title: t`Connexion` },
  },
  {
    name: 'Navigation',
    component: Navigation,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation',
  },
  {
    name: 'NavigationIdCheckErrors',
    component: NavigationIdCheckErrors,
    hoc: withIdCheckAsyncErrorBoundary,
    path: 'cheat-navigation-id-check-errors',
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
    options: { title: t`Données personnelles` },
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
    hoc: withAsyncErrorBoundary,
    path: 'email-modification-mot-de-passe-expire',
    options: { title: t`Email modification mot de passe expiré` },
  },
  {
    name: 'SearchCategories',
    component: SearchCategories,
    path: 'recherche/categories',
    options: { title: t`Recherche - catégories` },
  },
  {
    name: 'SearchFilter',
    component: SearchFilter,
    path: 'recherche/filtres',
    options: { title: t`Recherche - filtres` },
  },
  {
    name: 'SelectSchool',
    component: SelectSchool,
    path: 'creation-compte/etablissement-scolaire',
    options: { title: t`Etablissement scolaire - Sélection` },
  },
  {
    name: 'SelectSchoolHome',
    component: SelectSchoolHome,
    path: 'creation-compte/etablissement-scolaire-home',
    options: { title: t`Etablissement scolaire - Accueil` },
  },
  {
    name: 'SetBirthday',
    component: SetBirthday,
    path: 'creation-compte/date-de-naissance',
    options: { title: t`Date de naissance - Formulaire` },
  },
  {
    name: 'SetEmail',
    component: SetEmail,
    path: 'creation-compte/email',
    deeplinkPaths: ['set-email'],
    options: { title: t`Email - Formulaire` },
  },
  {
    name: 'SetName',
    component: SetName,
    path: 'creation-compte/nom-prenom',
    options: { title: t`Nom prénom - Formulaire` },
  },
  {
    name: 'SetPassword',
    component: SetPassword,
    path: 'creation-compte/mot-de-passe',
    options: { title: t`Mot de passe - Formulaire` },
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
    name: 'NextBeneficiaryStep',
    component: NextBeneficiaryStep,
    path: 'id-check',
    secure: true,
  },
  {
    name: 'SetPhoneNumber',
    component: SetPhoneNumber,
    path: 'creation-compte/telephone',
    options: { title: t`Téléphone - Formulaire` },
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
    options: { title: t`Validation téléphone - Trop d'éssais` },
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
    options: { title: t`1er tutoriel` },
  },
  {
    name: 'IdCheckUnavailable',
    component: IdCheckUnavailable,
    path: 'idcheck-indisponible',
    options: { title: t`Id Check indisponible` },
    secure: true,
  },
  {
    name: 'Venue',
    component: Venue,
    hoc: withAsyncErrorBoundary,
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
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: 'liens/generateur',
    },
    options: { title: t`Générateur de lien` },
  },
]
