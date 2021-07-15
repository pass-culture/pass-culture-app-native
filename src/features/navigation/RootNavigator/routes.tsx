import {
  routes as idCheckRoutes,
  initialRouteName as idCheckInitialRouteName,
  withAsyncErrorBoundary as withIdCheckAsyncErrorBoundary,
} from '@pass-culture/id-check'
import { LinkingOptions } from '@react-navigation/native'

import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { IdCheckUnavailable } from 'features/auth/idcheckUnavailable/IdCheckUnavailable'
import { Login } from 'features/auth/login/Login'
import { AcceptRedactorCgu } from 'features/auth/projectRedactorSignup/AcceptRedactorCgu'
import { RedactorSignupConfirmationEmailSent } from 'features/auth/projectRedactorSignup/RedactorSignupConfirmationEmailSent'
import { SetRedactorEmail } from 'features/auth/projectRedactorSignup/SetRedactorEmail'
import { SetRedactorPassword } from 'features/auth/projectRedactorSignup/SetRedactorPassword'
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
import { SetPostalCode } from 'features/auth/signup/SetPostalCode'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligibility'
import { BookingDetails } from 'features/bookings/pages/BookingDetails'
import { EndedBookings } from 'features/bookings/pages/EndedBookings'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { ABTestingPOC } from 'features/cheatcodes/pages/ABTestingPOC'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { NavigationIdCheckErrors } from 'features/cheatcodes/pages/NavigationIdCheckErrors'
import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { Maintenance } from 'features/maintenance/Maintenance'
import { linking as tabNavigatorLinking } from 'features/navigation/TabBar/routes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { Offer, OfferDescription } from 'features/offer'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ConfirmDeleteProfile } from 'features/profile/pages/ConfirmDeleteProfile'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfileSuccess'
import { LegalNotices } from 'features/profile/pages/LegalNotices'
import { NotificationSettings } from 'features/profile/pages/NotificationSettings'
import { PersonalData } from 'features/profile/pages/PersonalData'
import { Profile } from 'features/profile/pages/Profile'
import { Categories as SearchCategories } from 'features/search/pages/Categories'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'

import { Route } from './types'

export const initialRouteName = 'TabNavigator'

export const routes: Array<Route> = [
  { name: 'ABTestingPOC', component: ABTestingPOC },
  { name: 'AcceptCgu', component: AcceptCgu, hoc: withAsyncErrorBoundary },
  { name: 'AcceptRedactorCgu', component: AcceptRedactorCgu },
  { name: 'AccountCreated', component: AccountCreated },
  { name: 'AfterSignupEmailValidationBuffer', component: AfterSignupEmailValidationBuffer },
  { name: 'AppComponents', component: AppComponents },
  { name: 'CheatCodes', component: CheatCodes },
  { name: 'CheatMenu', component: CheatMenu },
  { name: 'ConsentSettings', component: ConsentSettings },
  { name: 'BeneficiaryRequestSent', component: BeneficiaryRequestSent },
  { name: 'BookingConfirmation', component: BookingConfirmation },
  { name: 'BookingDetails', component: BookingDetails },
  { name: 'CulturalSurvey', component: CulturalSurvey },
  { name: 'DeeplinkImporter', component: DeeplinkImporter },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
  },
  { name: 'EndedBookings', component: EndedBookings },
  {
    name: 'FavoritesSorts',
    component: FavoritesSorts,
  },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    hoc: withAsyncErrorBoundary,
  },
  { name: 'IdCheck', component: IdCheck, hoc: withIdCheckAsyncErrorBoundary },
  { name: 'LegalNotices', component: LegalNotices },
  { name: 'ConfirmDeleteProfile', component: ConfirmDeleteProfile },
  { name: 'DeleteProfileSuccess', component: DeleteProfileSuccess },
  { name: 'LocationFilter', component: LocationFilter },
  { name: 'LocationPicker', component: LocationPicker },
  { name: 'Login', component: Login, hoc: withAsyncErrorBoundary },
  { name: 'Maintenance', component: Maintenance },
  { name: 'Navigation', component: Navigation, hoc: withAsyncErrorBoundary },
  {
    name: 'NavigationIdCheckErrors',
    component: NavigationIdCheckErrors,
    hoc: withIdCheckAsyncErrorBoundary,
  },
  { name: 'NotificationSettings', component: NotificationSettings },
  { name: 'Offer', component: Offer, hoc: withAsyncErrorBoundary },
  { name: 'OfferDescription', component: OfferDescription, hoc: withAsyncErrorBoundary },
  { name: 'Profile', component: Profile },
  { name: 'PersonalData', component: PersonalData },
  { name: 'ChangePassword', component: ChangePassword },
  { name: 'ReinitializePassword', component: ReinitializePassword },
  { name: 'ResetPasswordEmailSent', component: ResetPasswordEmailSent },
  {
    name: 'ResetPasswordExpiredLink',
    component: ResetPasswordExpiredLink,
    hoc: withAsyncErrorBoundary,
  },
  { name: 'SearchCategories', component: SearchCategories },
  { name: 'SearchFilter', component: SearchFilter },
  { name: 'SetBirthday', component: SetBirthday },
  { name: 'SetEmail', component: SetEmail },
  { name: 'SetPassword', component: SetPassword },
  { name: 'SetRedactorEmail', component: SetRedactorEmail },
  { name: 'SetRedactorPassword', component: SetRedactorPassword },
  { name: 'SetPostalCode', component: SetPostalCode },
  { name: 'SignupConfirmationEmailSent', component: SignupConfirmationEmailSent },
  { name: 'RedactorSignupConfirmationEmailSent', component: RedactorSignupConfirmationEmailSent },
  { name: 'SignupConfirmationExpiredLink', component: SignupConfirmationExpiredLink },
  { name: 'TabNavigator', component: TabNavigator, linking: tabNavigatorLinking },
  { name: 'NextBeneficiaryStep', component: NextBeneficiaryStep },
  { name: 'SetPhoneNumber', component: SetPhoneNumber },
  { name: 'SetPhoneValidationCode', component: SetPhoneValidationCode },
  { name: 'PhoneValidationTooManyAttempts', component: PhoneValidationTooManyAttempts },
  { name: 'VerifyEligibility', component: VerifyEligibility },
  { name: 'FirstTutorial', component: FirstTutorial },
  { name: 'ForceUpdate', component: ForceUpdate },
  { name: 'IdCheckUnavailable', component: IdCheckUnavailable },
  ...idCheckRoutes.filter((screen) => screen.name !== idCheckInitialRouteName),
  { name: idCheckInitialRouteName, component: IdCheckV2 },
]

export const linking: LinkingOptions = {
  prefixes: [],
  config: {
    screens: {
      ...routes.reduce(
        (route, currentRoute) => ({
          ...route,
          [currentRoute.name]: currentRoute.linking?.config || currentRoute.path,
        }),
        {}
      ),
    },
  },
}
