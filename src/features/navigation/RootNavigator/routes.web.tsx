/**
 * THIS FILE CAN BE REMOVED AS SOON AS ALL THE ROUTES ARE WEB COMPATIBLE
 */
import {
  routes as idCheckRoutes,
  initialRouteName as idCheckInitialRouteName,
  // withAsyncErrorBoundary as withIdCheckAsyncErrorBoundary,
} from '@pass-culture/id-check'
import { LinkingOptions } from '@react-navigation/native'
// import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
// import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
// import { BeneficiaryRequestSent } from 'features/auth/signup/BeneficiaryRequestSent'
// import { IdCheck } from 'features/auth/signup/IdCheck'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { IdCheckUnavailable } from 'features/auth/IdcheckUnavailable'
import { Login } from 'features/auth/login/Login'
import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { IdCheckV2 } from 'features/auth/signup/IdCheckV2'
import { PhoneValidationTooManyAttempts } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManyAttempts'
import { SetBirthday } from 'features/auth/signup/SetBirthday'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligiblity'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { Maintenance } from 'features/maintenance/Maintenance'
import { Route } from 'features/navigation/RootNavigator/types'
import { linking as tabNavigatorLinking } from 'features/navigation/TabBar/routes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { LegalNotices } from 'features/profile/pages/LegalNotices'
import { env } from 'libs/environment'
import { Link } from 'libs/navigation/Link'
// import { NextBeneficiaryStep } from 'features/auth/signup/NextBeneficiaryStep'
// import { SetPhoneNumber } from 'features/auth/signup/PhoneValidation/SetPhoneNumber'
// import { SetPhoneValidationCode } from 'features/auth/signup/PhoneValidation/SetPhoneValidationCode'
// import { SetPostalCode } from 'features/auth/signup/SetPostalCode'
// import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
// import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
// import { BookingDetails } from 'features/bookings/pages/BookingDetails'
// import { EndedBookings } from 'features/bookings/pages/EndedBookings'
// import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
// import { ABTestingPOC } from 'features/cheatcodes/pages/ABTestingPOC'
// import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
// import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
// import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
// import { Navigation } from 'features/cheatcodes/pages/Navigation'
// import { NavigationIdCheckErrors } from 'features/cheatcodes/pages/NavigationIdCheckErrors'
// import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
// import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
// import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
// import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
// import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
// import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
// import { Offer, OfferDescription } from 'features/offer'
// import { ChangePassword } from 'features/profile/pages/ChangePassword'
// import { ConfirmDeleteProfile } from 'features/profile/pages/ConfirmDeleteProfile'
// import { ConsentSettings } from 'features/profile/pages/ConsentSettings'
// import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfileSuccess'
// import { NotificationSettings } from 'features/profile/pages/NotificationSettings'
// import { PersonalData } from 'features/profile/pages/PersonalData'
// import { Profile } from 'features/profile/pages/Profile'
// import { Categories as SearchCategories } from 'features/search/pages/Categories'
// import { LocationFilter } from 'features/search/pages/LocationFilter'
// import { LocationPicker } from 'features/search/pages/LocationPicker'
// import { SearchFilter } from 'features/search/pages/SearchFilter'
import { ColorsEnum, Typo } from 'ui/theme'

export const initialRouteName = 'ABTestingPOC'

const LINKING_PREFIXES = [
  `https://app.passculture-${env.ENV}.gouv.fr/`,
  `https://*.app.passculture-${env.ENV}.gouv.fr/`,
  'passculture://',
]

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})

const ABTestingPOC = ({ title } = { title: 'ABTestingPog' }) => (
  <Page>
    <Typo.Title3 color={ColorsEnum.PRIMARY}>{title}</Typo.Title3>
    <Link to={'/search'}>
      <Text>Go to TabNavigator/Search</Text>
    </Link>
    <Link to={'/eighteen'}>
      <Text>Go to EighteenBirthday</Text>
    </Link>
    <Link to={'/login'}>
      <Text>Go to Login</Text>
    </Link>
    <Link to={'/setemail'}>
      <Text>Register</Text>
    </Link>
    <Link to={'/account-created'}>
      <Text>Account Created</Text>
    </Link>
    <Link to={'/idcheck-unavailable'}>
      <Text>Id Check unavailable</Text>
    </Link>
    <Link to={'/verify-eligibility'}>
      <Text>Verify eligiblity</Text>
    </Link>
    <Link to={'/phone-validation-too-many-attempts'}>
      <Text>Phone validation too many attempts</Text>
    </Link>
    <Link to={'/after-signup-email-validation-buffer'}>
      <Text>After signup validation buffer</Text>
    </Link>
    <Link to={'/legal-notices'}>
      <Text>Legal notices</Text>
    </Link>
    <Link to={'/maintenance'}>
      <Text>Maintenance</Text>
    </Link>
    <Link to={'/forgotten-password'}>
      <Text>ForgottenPassword</Text>
    </Link>
    <Link
      to={'/cgu'}
      params={{
        email: 'test@test.com',
        isNewsletterChecked: true,
        password: 'user@AZERTY123',
        birthday: '01/01/2003',
        postalCode: '93000',
      }}>
      <Text>AcceptCGU (Link with params test)</Text>
    </Link>
  </Page>
)

export const routes: Array<Route> = [
  { name: 'ABTestingPOC', component: ABTestingPOC, path: '/abtesting' },
  { name: 'TabNavigator', component: TabNavigator, linking: tabNavigatorLinking },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    path: '/eighteen',
  },
  // { name: 'ABTestingPOC', component: ABTestingPOC },
  { name: 'AcceptCgu', component: AcceptCgu, path: '/cgu', hoc: withAsyncErrorBoundary },
  { name: 'AccountCreated', component: AccountCreated, path: '/account-created' },
  {
    name: 'AfterSignupEmailValidationBuffer',
    component: AfterSignupEmailValidationBuffer,
    path: '/after-signup-email-validation-buffer',
  },
  //   // { name: 'AppComponents', component: AppComponents },
  //   // { name: 'CheatCodes', component: CheatCodes },
  //   // { name: 'CheatMenu', component: CheatMenu },
  //   // { name: 'ConsentSettings', component: ConsentSettings },
  //   // { name: 'BeneficiaryRequestSent', component: BeneficiaryRequestSent },
  //   // { name: 'BookingConfirmation', component: BookingConfirmation },
  //   // { name: 'BookingDetails', component: BookingDetails },
  //   // { name: 'CulturalSurvey', component: CulturalSurvey },
  //   // { name: 'DeeplinkImporter', component: DeeplinkImporter },
  //   // { name: 'EndedBookings', component: EndedBookings },
  //   // {
  //   //   name: 'FavoritesSorts',
  //   //   component: FavoritesSorts,
  //   // },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    hoc: withAsyncErrorBoundary,
    path: '/forgotten-password',
  },
  //   // { name: 'IdCheck', component: IdCheck, hoc: withIdCheckAsyncErrorBoundary },
  { name: 'LegalNotices', component: LegalNotices, path: '/legal-notices' },
  //   // { name: 'ConfirmDeleteProfile', component: ConfirmDeleteProfile },
  //   // { name: 'DeleteProfileSuccess', component: DeleteProfileSuccess },
  //   // { name: 'LocationFilter', component: LocationFilter },
  //   // { name: 'LocationPicker', component: LocationPicker },
  { name: 'Login', component: Login, hoc: withAsyncErrorBoundary, path: '/login' },
  { name: 'Maintenance', component: Maintenance, path: '/maintenance' },
  //   // { name: 'Navigation', component: Navigation, hoc: withAsyncErrorBoundary },
  //   // {
  //   //   name: 'NavigationIdCheckErrors',
  //   //   component: NavigationIdCheckErrors,
  //   //   hoc: withIdCheckAsyncErrorBoundary,
  //   // },
  //   // { name: 'NotificationSettings', component: NotificationSettings },
  //   // { name: 'Offer', component: Offer, hoc: withAsyncErrorBoundary },
  //   // { name: 'OfferDescription', component: OfferDescription, hoc: withAsyncErrorBoundary },
  //   // { name: 'Profile', component: Profile },
  //   // { name: 'PersonalData', component: PersonalData },
  //   // { name: 'ChangePassword', component: ChangePassword },
  //   // { name: 'ReinitializePassword', component: ReinitializePassword },
  {
    name: 'ResetPasswordEmailSent',
    component: ResetPasswordEmailSent,
    path: '/reset-password-email-sent',
  },
  //   // {
  //   //   name: 'ResetPasswordExpiredLink',
  //   //   component: ResetPasswordExpiredLink,
  //   //   hoc: withAsyncErrorBoundary,
  //   // },
  //   // { name: 'SearchCategories', component: SearchCategories },
  //   // { name: 'SearchFilter', component: SearchFilter },
  { name: 'SetBirthday', component: SetBirthday, path: '/setbirthday' },
  { name: 'SetEmail', component: SetEmail, path: '/setemail' },
  { name: 'SetPassword', component: SetPassword, path: '/setpassword' },
  //   // { name: 'SetPostalCode', component: SetPostalCode },
  //   // { name: 'SignupConfirmationEmailSent', component: SignupConfirmationEmailSent },
  //   // { name: 'SignupConfirmationExpiredLink', component: SignupConfirmationExpiredLink },
  //   // { name: 'TabNavigator', component: TabNavigator },
  //   // { name: 'NextBeneficiaryStep', component: NextBeneficiaryStep },
  //   // { name: 'SetPhoneNumber', component: SetPhoneNumber },
  //   // { name: 'SetPhoneValidationCode', component: SetPhoneValidationCode },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    path: '/phone-validation-too-many-attempts',
  },
  { name: 'VerifyEligibility', component: VerifyEligibility, path: '/verify-eligibility' },
  //   // { name: 'FirstTutorial', component: FirstTutorial },
  //   // { name: 'ForceUpdate', component: ForceUpdate },
  { name: 'IdCheckUnavailable', component: IdCheckUnavailable, path: '/idcheck-unavailable' },
  ...idCheckRoutes.filter((screen) => screen.name !== idCheckInitialRouteName),
  { name: idCheckInitialRouteName, component: IdCheckV2, path: '/idcheckv2' },
]

export const linking: LinkingOptions = {
  prefixes: LINKING_PREFIXES,
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
