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
  { name: 'PageNotFound', component: PageNotFound, path: '*' },
  { name: 'ABTestingPOC', component: ABTestingPOC, path: 'abtesting' },
  { name: 'AcceptCgu', component: AcceptCgu, hoc: withAsyncErrorBoundary, path: 'cgu' },
  { name: 'AccountCreated', component: AccountCreated, path: 'account-created' },
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
  { name: 'ConsentSettings', component: ConsentSettings, path: 'consent-settings' },
  {
    name: 'BeneficiaryRequestSent',
    component: BeneficiaryRequestSent,
    path: 'beneficiary-request-sent',
  },
  {
    name: 'BookingConfirmation',
    component: BookingConfirmation,
    path: 'booking/:offerId/confirmation',
  },
  {
    name: 'BookingDetails',
    component: BookingDetails,
    pathConfig: {
      path: 'booking/:id/details',
      parse: screenParamsParser['BookingDetails'],
    },
  },
  { name: 'CulturalSurvey', component: CulturalSurvey, path: 'cultural-survey' },
  { name: 'DeeplinkImporter', component: DeeplinkImporter, path: 'deeplink-importer' },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    path: 'eighteen',
  },
  { name: 'EndedBookings', component: EndedBookings, path: 'ended-bookings' },
  {
    name: 'FavoritesSorts',
    component: FavoritesSorts,
    path: 'favorites/sorts',
  },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    hoc: withAsyncErrorBoundary,
    path: 'forgotten-password',
  },
  { name: 'IdCheck', component: IdCheck, hoc: withIdCheckAsyncErrorBoundary, path: 'idcheck' },
  { name: 'LegalNotices', component: LegalNotices, path: 'legal-notices' },
  { name: 'ConfirmDeleteProfile', component: ConfirmDeleteProfile, path: 'profile/delete' },
  { name: 'DeleteProfileSuccess', component: DeleteProfileSuccess, path: 'profile/delete/success' },
  { name: 'LocationFilter', component: LocationFilter, path: 'recherche/location/filter' },
  { name: 'LocationPicker', component: LocationPicker, path: 'recherche/location/picker' },
  {
    name: 'Login',
    component: Login,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: DeeplinkPath.LOGIN,
      parse: screenParamsParser['Login'],
    },
  },
  { name: 'Maintenance', component: Maintenance, path: 'maintenance' },
  { name: 'Navigation', component: Navigation, hoc: withAsyncErrorBoundary, path: 'navigation' },
  {
    name: 'NavigationIdCheckErrors',
    component: NavigationIdCheckErrors,
    hoc: withIdCheckAsyncErrorBoundary,
    path: 'navigation-id-check-errors',
  },
  { name: 'NotificationSettings', component: NotificationSettings, path: 'notification-settings' },
  {
    name: 'Offer',
    component: Offer,
    hoc: compose(withAsyncErrorBoundary, withOfferNotFoundErrorBoundary),
    pathConfig: {
      path: DeeplinkPath.OFFER,
      parse: screenParamsParser['Offer'],
    },
  },
  {
    name: 'OfferDescription',
    component: OfferDescription,
    hoc: withAsyncErrorBoundary,
    path: 'offre/:id/description',
  },
  { name: 'PersonalData', component: PersonalData, path: 'personal-data' },
  { name: 'ChangePassword', component: ChangePassword, path: 'change-password' },
  {
    name: 'ReinitializePassword',
    component: ReinitializePassword,
    pathConfig: {
      path: DeeplinkPath.FORGOTTEN_PASSWORD,
      parse: screenParamsParser['ReinitializePassword'],
    },
  },
  {
    name: 'ResetPasswordEmailSent',
    component: ResetPasswordEmailSent,
    path: 'reset-password-email-sent',
  },
  {
    name: 'ResetPasswordExpiredLink',
    component: ResetPasswordExpiredLink,
    hoc: withAsyncErrorBoundary,
    path: 'reset-password-expired-link',
  },
  { name: 'SearchCategories', component: SearchCategories, path: 'recherche/categories' },
  { name: 'SearchFilter', component: SearchFilter, path: 'recherche/filtres' },
  { name: 'SetBirthday', component: SetBirthday, path: 'setbirthday' },
  { name: 'SetEmail', component: SetEmail, path: DeeplinkPath.SET_EMAIL },
  { name: 'SetPassword', component: SetPassword, path: 'setpassword' },
  {
    name: 'SignupConfirmationEmailSent',
    component: SignupConfirmationEmailSent,
    path: 'signup-confirmation-email-sent',
  },
  {
    name: 'SignupConfirmationExpiredLink',
    component: SignupConfirmationExpiredLink,
    path: 'signup-confirmation-expired-link',
  },
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  {
    name: 'NextBeneficiaryStep',
    component: NextBeneficiaryStep,
    path: DeeplinkPath.NEXT_BENEFECIARY_STEP,
  },
  { name: 'SetPhoneNumber', component: SetPhoneNumber, path: 'set-phone-number' },
  {
    name: 'SetPhoneValidationCode',
    component: SetPhoneValidationCode,
    path: 'set-phone-validation',
  },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    path: 'phone-validation-too-many-attempts',
  },
  { name: 'VerifyEligibility', component: VerifyEligibility, path: 'verify-eligibility' },
  { name: 'FirstTutorial', component: FirstTutorial, path: 'first-tutorial' },
  { name: 'ForceUpdate', component: ForceUpdate, path: 'force-update' },
  { name: 'IdCheckUnavailable', component: IdCheckUnavailable, path: 'idcheck-unavailable' },
  {
    name: 'Venue',
    component: Venue,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: DeeplinkPath.VENUE,
      parse: screenParamsParser['Venue'],
    },
  },
  ...idCheckRoutes.filter((screen) => screen.name !== idCheckInitialRouteName),
  { name: idCheckInitialRouteName, component: IdCheckV2, path: 'idcheckv2' },
]
