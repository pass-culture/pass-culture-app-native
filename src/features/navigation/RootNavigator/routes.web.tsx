/**
 * THIS FILE CAN BE REMOVED AS SOON AS ALL THE ROUTES ARE WEB COMPATIBLE
 */
import {
  routes as idCheckRoutes,
  initialRouteName as idCheckInitialRouteName,
  withAsyncErrorBoundary as withIdCheckAsyncErrorBoundary,
} from '@pass-culture/id-check'
import { LinkingOptions } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

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
import { CheatMenu } from 'features/cheatcodes/pages/CheatMenu'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { NavigationIdCheckErrors } from 'features/cheatcodes/pages/NavigationIdCheckErrors'
import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
import { EighteenBirthday } from 'features/eighteenBirthday/pages/EighteenBirthday'
import { withAsyncErrorBoundary } from 'features/errors'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'
import { Maintenance } from 'features/maintenance/Maintenance'
import { Route } from 'features/navigation/RootNavigator/types'
import { screenParamsParser } from 'features/navigation/screenParamsParser'
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
import { env } from 'libs/environment'
import { Link } from 'libs/navigation/Link'
/** those screens are not yet web compatible */
// import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
// import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
/** those screens are not yet tested */
// import { IdCheck } from 'features/auth/signup/IdCheck'
// import { ABTestingPOC } from 'features/cheatcodes/pages/ABTestingPOC'
// import { CulturalSurvey } from 'features/firstLogin/CulturalSurvey'
// import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
// import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { ColorsEnum, Typo } from 'ui/theme'

export const initialRouteName = 'TabNavigator'

// TODO: see if necessary and if necessary, update URLs with real ones
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
    <Link to={'/signup-confirmation'}>
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
    <Link to={'/change-password'}>
      <Text>ChangePassword</Text>
    </Link>
    <Link to={'/reset-password-expired-link'}>
      <Text>ResetPasswordExpiredLink</Text>
    </Link>
    <Link to={'/reinitialize-password'}>
      <Text>ReinitializePassword</Text>
    </Link>
    <Link to={'/beneficiary-request-sent'}>
      <Text>BeneficiaryRequestSent</Text>
    </Link>
    <Link to={'/next-beneficiary-step'}>
      <Text>NextBeneficiaryStep</Text>
    </Link>
    <Link to={'/cheat-menu'}>
      <Text>CheatMenu</Text>
    </Link>
    <Link to={'/offer'} params={{ id: '223139' }}>
      <Text>Offer via /offer?id=223139</Text>
    </Link>
    <Link to={'/offer/223139'}>
      <Text>Offer via /offer/223139</Text>
    </Link>
    <Link to={'/signup-confirmation-email-sent'}>
      <Text>SignupConfirmationEmailSent</Text>
    </Link>
    <Link to={'/signup-confirmation-expired-link'}>
      <Text>SignupConfirmationExpiredLink</Text>
    </Link>
    <Link to={'/profile/delete'}>
      <Text>ConfirmDeleteProfile</Text>
    </Link>
    <Link to={'/profile/delete/success'}>
      <Text>DeleteProfileSuccess</Text>
    </Link>
    <Link to={'/favorites'}>
      <Text>Favorites</Text>
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
  { name: 'ABTestingPOC', component: ABTestingPOC, path: 'abtesting' },
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    path: 'eighteen',
  },
  { name: 'AcceptCgu', component: AcceptCgu, path: 'cgu', hoc: withAsyncErrorBoundary },
  { name: 'AccountCreated', component: AccountCreated, path: 'account-created' },
  {
    name: 'AfterSignupEmailValidationBuffer',
    component: AfterSignupEmailValidationBuffer,
    pathConfig: {
      path: 'signup-confirmation',
      parse: screenParamsParser['AfterSignupEmailValidationBuffer'],
    },
  },
  // { name: 'AppComponents', component: AppComponents, path: 'app-components' },
  // { name: 'CheatCodes', component: CheatCodes, path: 'cheat-codes' },
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
  // { name: 'CulturalSurvey', component: CulturalSurvey },
  { name: 'DeeplinkImporter', component: DeeplinkImporter, path: 'deeplink-importer' },
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
  // { name: 'IdCheck', component: IdCheck, hoc: withIdCheckAsyncErrorBoundary },
  { name: 'LegalNotices', component: LegalNotices, path: 'legal-notices' },
  { name: 'ConfirmDeleteProfile', component: ConfirmDeleteProfile, path: 'profile/delete' },
  {
    name: 'DeleteProfileSuccess',
    component: DeleteProfileSuccess,
    path: 'profile/delete/success',
  },
  { name: 'LocationFilter', component: LocationFilter, path: 'location/filter' },
  { name: 'LocationPicker', component: LocationPicker, path: 'location/picker' },
  {
    name: 'Login',
    component: Login,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: 'login',
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
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: 'offer/:id',
      parse: screenParamsParser['Offer'],
    },
  },
  {
    name: 'OfferDescription',
    component: OfferDescription,
    hoc: withAsyncErrorBoundary,
    path: 'offer/:id/description',
  },
  { name: 'PersonalData', component: PersonalData, path: 'personal-data' },
  { name: 'ChangePassword', component: ChangePassword, path: 'change-password' },
  {
    name: 'ReinitializePassword',
    component: ReinitializePassword,
    pathConfig: {
      path: 'mot-de-passe-perdu',
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
  { name: 'SearchCategories', component: SearchCategories, path: 'search/categories' },
  { name: 'SearchFilter', component: SearchFilter, path: 'search/filter' },
  { name: 'SetBirthday', component: SetBirthday, path: 'setbirthday' },
  { name: 'SetEmail', component: SetEmail, path: 'setemail' },
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
  { name: 'NextBeneficiaryStep', component: NextBeneficiaryStep, path: 'next-beneficiary-step' },
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
  // { name: 'ForceUpdate', component: ForceUpdate },
  { name: 'IdCheckUnavailable', component: IdCheckUnavailable, path: 'idcheck-unavailable' },
  ...idCheckRoutes.filter((screen) => screen.name !== idCheckInitialRouteName),
  { name: idCheckInitialRouteName, component: IdCheckV2, path: 'idcheckv2' },
  {
    name: 'Venue',
    component: Venue,
    hoc: withAsyncErrorBoundary,
    pathConfig: {
      path: 'venue/:id',
      parse: screenParamsParser['Venue'],
    },
  },
]

export const linking: LinkingOptions = {
  prefixes: LINKING_PREFIXES,
  config: {
    screens: {
      ...routes.reduce(
        (route, currentRoute) => ({
          ...route,
          [currentRoute.name]: currentRoute.pathConfig || currentRoute.path,
        }),
        {}
      ),
    },
  },
}
