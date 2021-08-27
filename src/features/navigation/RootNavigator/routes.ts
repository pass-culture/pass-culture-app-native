import { t } from '@lingui/macro'
import {
  routes as idCheckRoutes,
  initialRouteName as idCheckInitialRouteName,
  withAsyncErrorBoundary as withIdCheckAsyncErrorBoundary,
} from '@pass-culture/id-check'

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
import { IdCheck } from 'features/auth/signup/IdCheck'
import { IdCheckV2 } from 'features/auth/signup/IdCheckV2'
import { NextBeneficiaryStep } from 'features/auth/signup/NextBeneficiaryStep'
import { PhoneValidationTooManyAttempts } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManyAttempts'
import { SetPhoneNumber } from 'features/auth/signup/PhoneValidation/SetPhoneNumber'
import { SetPhoneValidationCode } from 'features/auth/signup/PhoneValidation/SetPhoneValidationCode'
import { SetBirthday } from 'features/auth/signup/SetBirthday'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligiblity'
import { BookingDetails } from 'features/bookings/pages/BookingDetails'
import { EndedBookings } from 'features/bookings/pages/EndedBookings'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { ABTestingPOC } from 'features/cheatcodes/pages/ABTestingPOC/ABTestingPOC'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes/CheatCodes'
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { NavigationIdCheckErrors } from 'features/cheatcodes/pages/NavigationIdCheckErrors'
import { DeeplinkPath } from 'features/deeplinks/enums'
import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary, withOfferNotFoundErrorBoundary } from 'features/errors'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { Maintenance } from 'features/maintenance/Maintenance'
import { PageNotFound } from 'features/navigation/PageNotFound'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/routes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { Offer, OfferDescription } from 'features/offer'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ConfirmDeleteProfile } from 'features/profile/pages/ConfirmDeleteProfile'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfileSuccess'
import { LegalNotices } from 'features/profile/pages/LegalNotices'
import { NotificationSettings } from 'features/profile/pages/NotificationSettings'
import { PersonalData } from 'features/profile/pages/PersonalData'
import { Categories as SearchCategories } from 'features/search/pages/Categories'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'
import { Venue } from 'features/venue'
import { compose } from 'libs/compose'

import { Route } from './types'

export const initialRouteName = 'TabNavigator'

export const routes: Array<Route> = [
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
    path: 'cgu',
    options: { title: t`Conditions d'utilisations` },
  },
  {
    name: 'AccountCreated',
    component: AccountCreated,
    path: 'account-created',
    options: { title: t`Compte créé !` },
  },
  {
    name: 'AfterSignupEmailValidationBuffer',
    component: AfterSignupEmailValidationBuffer,
    pathConfig: {
      path: DeeplinkPath.SIGNUP_CONFIRMATION,
      parse: screenParamsParser['AfterSignupEmailValidationBuffer'],
    },
  },
  { name: 'AppComponents', component: AppComponents, path: 'app-components' },
  { name: 'CheatCodes', component: CheatCodes, path: 'cheat-codes' },
  { name: 'CheatMenu', component: CheatMenu, path: 'cheat-menu' },
  {
    name: 'ConsentSettings',
    component: ConsentSettings,
    path: 'consent-settings',
    options: { title: t`Réglages de consentements` },
  },
  {
    name: 'BeneficiaryRequestSent',
    component: BeneficiaryRequestSent,
    path: 'beneficiary-request-sent',
    options: { title: t`Demande bénéficiaire envoyée` },
  },
  {
    name: 'BookingConfirmation',
    component: BookingConfirmation,
    path: 'booking/:offerId/confirmation',
    options: { title: t`Confirmation de réservation` },
  },
  {
    name: 'BookingDetails',
    component: BookingDetails,
    pathConfig: {
      path: 'booking/:id/details',
      parse: screenParamsParser['BookingDetails'],
    },
    options: { title: t`Détails de réservation` },
  },
  {
    name: 'CulturalSurvey',
    component: CulturalSurvey,
    path: 'cultural-survey',
    options: { title: t`Questionnaire culturel` },
  },
  { name: 'DeeplinkImporter', component: DeeplinkImporter, path: 'deeplink-importer' },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    path: 'eighteen',
    options: { title: t`Anniversaire 18 ans` },
  },
  {
    name: 'EndedBookings',
    component: EndedBookings,
    path: 'ended-bookings',
    options: { title: t`Réservations terminées` },
  },
  {
    name: 'FavoritesSorts',
    component: FavoritesSorts,
    path: 'favorites/sorts',
    options: { title: t`Tri des favoris` },
  },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    hoc: withAsyncErrorBoundary,
    path: 'forgotten-password',
    options: { title: t`Mot de passe oublié` },
  },
  { name: 'IdCheck', component: IdCheck, hoc: withIdCheckAsyncErrorBoundary, path: 'idcheck' },
  {
    name: 'LegalNotices',
    component: LegalNotices,
    path: 'legal-notices',
    options: { title: t`Notices légales` },
  },
  {
    name: 'ConfirmDeleteProfile',
    component: ConfirmDeleteProfile,
    path: 'profile/delete',
    options: { title: t`Suppression profil` },
  },
  {
    name: 'DeleteProfileSuccess',
    component: DeleteProfileSuccess,
    path: 'profile/delete/success',
    options: { title: t`Suppression profil confirmée` },
  },
  {
    name: 'LocationFilter',
    component: LocationFilter,
    path: 'recherche/location/filter',
    options: { title: t`Recherche` },
  },
  {
    name: 'LocationPicker',
    component: LocationPicker,
    path: 'recherche/location/picker',
    options: { title: t`Recherche` },
  },
  {
    name: 'Login',
    component: Login,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: DeeplinkPath.LOGIN,
      parse: screenParamsParser['Login'],
    },
    options: { title: t`Connexion` },
  },
  {
    name: 'Maintenance',
    component: Maintenance,
    path: 'maintenance',
    options: { title: t`Maintenance` },
  },
  { name: 'Navigation', component: Navigation, hoc: withAsyncErrorBoundary, path: 'navigation' },
  {
    name: 'NavigationIdCheckErrors',
    component: NavigationIdCheckErrors,
    hoc: withIdCheckAsyncErrorBoundary,
    path: 'navigation-id-check-errors',
  },
  {
    name: 'NotificationSettings',
    component: NotificationSettings,
    path: 'notification-settings',
    options: { title: t`Réglages de notifications` },
  },
  {
    name: 'Offer',
    component: Offer,
    hoc: compose(withAsyncErrorBoundary, withOfferNotFoundErrorBoundary),
    pathConfig: {
      path: DeeplinkPath.OFFER,
      parse: screenParamsParser['Offer'],
    },
    options: { title: t`Offre` },
  },
  {
    name: 'OfferDescription',
    component: OfferDescription,
    hoc: withAsyncErrorBoundary,
    path: 'offre/:id/description',
    options: { title: t`Détails de l'offre` },
  },
  {
    name: 'PersonalData',
    component: PersonalData,
    path: 'personal-data',
    options: { title: t`Données personnelles` },
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
    path: 'change-password',
    options: { title: t`Modification du mot de passe` },
  },
  {
    name: 'ReinitializePassword',
    component: ReinitializePassword,
    pathConfig: {
      path: DeeplinkPath.FORGOTTEN_PASSWORD,
      parse: screenParamsParser['ReinitializePassword'],
    },
    options: { title: t`Réinitialiser le mot de passe` },
  },
  {
    name: 'ResetPasswordEmailSent',
    component: ResetPasswordEmailSent,
    path: 'reset-password-email-sent',
    options: { title: t`Email modification mot de passe envoyé` },
  },
  {
    name: 'ResetPasswordExpiredLink',
    component: ResetPasswordExpiredLink,
    hoc: withAsyncErrorBoundary,
    path: 'reset-password-expired-link',
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
    name: 'SetBirthday',
    component: SetBirthday,
    path: 'setbirthday',
    options: { title: t`Date d'anniversaire - Formulaire` },
  },
  {
    name: 'SetEmail',
    component: SetEmail,
    path: DeeplinkPath.SET_EMAIL,
    options: { title: t`Email - Formulaire` },
  },
  {
    name: 'SetPassword',
    component: SetPassword,
    path: 'setpassword',
    options: { title: t`Mot de passe - Formulaire` },
  },
  {
    name: 'SignupConfirmationEmailSent',
    component: SignupConfirmationEmailSent,
    path: 'signup-confirmation-email-sent',
    options: { title: t`Email création de compte envoyé` },
  },
  {
    name: 'SignupConfirmationExpiredLink',
    component: SignupConfirmationExpiredLink,
    path: 'signup-confirmation-expired-link',
    options: { title: t`Email création de compte expiré` },
  },
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  {
    name: 'NextBeneficiaryStep',
    component: NextBeneficiaryStep,
    path: DeeplinkPath.NEXT_BENEFECIARY_STEP,
  },
  {
    name: 'SetPhoneNumber',
    component: SetPhoneNumber,
    path: 'set-phone-number',
    options: { title: t`Téléphone - Formulaire` },
  },
  {
    name: 'SetPhoneValidationCode',
    component: SetPhoneValidationCode,
    path: 'set-phone-validation',
    options: { title: t`Validation téléphone` },
  },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    path: 'phone-validation-too-many-attempts',
    options: { title: t`Validation téléphone - Trop d'éssais` },
  },
  {
    name: 'VerifyEligibility',
    component: VerifyEligibility,
    path: 'verify-eligibility',
    options: { title: t`Vérification éligibilité` },
  },
  {
    name: 'FirstTutorial',
    component: FirstTutorial,
    path: 'first-tutorial',
    options: { title: t`1er tutoriel` },
  },
  {
    name: 'ForceUpdate',
    component: ForceUpdate,
    path: 'force-update',
    options: { title: t`Mise à jours` },
  },
  {
    name: 'IdCheckUnavailable',
    component: IdCheckUnavailable,
    path: 'idcheck-unavailable',
    options: { title: t`Id Check indisponible` },
  },
  {
    name: 'Venue',
    component: Venue,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: DeeplinkPath.VENUE,
      parse: screenParamsParser['Venue'],
    },
    options: { title: t`Lieu` },
  },
  ...idCheckRoutes.filter((screen) => screen.name !== idCheckInitialRouteName),
  { name: idCheckInitialRouteName, component: IdCheckV2, path: 'idcheckv2' },
]
