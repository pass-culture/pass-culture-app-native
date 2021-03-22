import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { Login } from 'features/auth/login/Login'
import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { EligibilityConfirmed } from 'features/auth/signup/EligibilityConfirmed'
import { IdCheck } from 'features/auth/signup/IdCheck'
import { SetBirthday } from 'features/auth/signup/SetBirthday'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligibility'
import { EndedBookings } from 'features/bookings/pages/EndedBookings'
import { Calendar } from 'features/bookOffer/components/Calendar/Calendar'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { ABTestingPOC } from 'features/cheatcodes/pages/ABTestingPOC'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { Offer, OfferDescription } from 'features/offer'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings'
import { LegalNotices } from 'features/profile/pages/LegalNotices'
import { NotificationSettings } from 'features/profile/pages/NotificationSettings'
import { PersonalData } from 'features/profile/pages/PersonalData'
import { Profile } from 'features/profile/pages/Profile'
import { Categories as SearchCategories } from 'features/search/pages/Categories'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'

import { Route } from './types'

const routes: Array<Route> = [
  { name: 'ABTestingPOC', component: ABTestingPOC },
  { name: 'AcceptCgu', component: AcceptCgu, hoc: withAsyncErrorBoundary },
  { name: 'AccountCreated', component: AccountCreated },
  { name: 'AfterSignupEmailValidationBuffer', component: AfterSignupEmailValidationBuffer },
  { name: 'AppComponents', component: AppComponents },
  { name: 'CheatCodes', component: CheatCodes },
  { name: 'CheatMenu', component: CheatMenu },
  { name: 'ConsentSettings', component: ConsentSettings },
  { name: 'BookingConfirmation', component: BookingConfirmation },
  { name: 'CulturalSurvey', component: CulturalSurvey },
  { name: 'EligibilityConfirmed', component: EligibilityConfirmed },
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
  { name: 'IdCheck', component: IdCheck },
  { name: 'LegalNotices', component: LegalNotices },
  { name: 'LocationFilter', component: LocationFilter },
  { name: 'LocationPicker', component: LocationPicker },
  { name: 'Login', component: Login, hoc: withAsyncErrorBoundary },
  { name: 'Navigation', component: Navigation, hoc: withAsyncErrorBoundary },
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
  { name: 'SignupConfirmationEmailSent', component: SignupConfirmationEmailSent },
  { name: 'SignupConfirmationExpiredLink', component: SignupConfirmationExpiredLink },
  { name: 'TabNavigator', component: TabNavigator },
  { name: 'VerifyEligibility', component: VerifyEligibility },
  { name: 'FirstTutorial', component: FirstTutorial },
  // TODO: PC-6693 remove this line
  { name: 'Calendar', component: Calendar },
]

export default routes
