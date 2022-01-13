import { getStateFromPath, PathConfig, RouteProp, ParamListBase } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ComponentType } from 'react'
import type { CountryCode } from 'react-native-country-picker-modal'

import { TabParamList, TabRouteName } from '../TabBar/types'

export type Referrals =
  | Lowercase<keyof AllNavParamList>
  | 'deeplink'
  | 'exclusivity'
  | 'bookingimpossible'

export type IdentityCheckRootStackParamList = {
  NavigationIdentityCheck: undefined
  // Stepper
  IdentityCheckStepper: undefined
  // Profile
  SetName: undefined
  IdentityCheckCity: undefined
  IdentityCheckAddress: undefined
  IdentityCheckStatus: undefined
  IdentityCheckSchoolType: undefined
  // Identification
  IdentityCheckStart: undefined
  IdentityCheckWebview: undefined
  IdentityCheckEnd: undefined
  IdentityCheckUnavailable: { withDMS?: boolean }
  IdentityCheckEduConnect: undefined
  IdentityCheckEduConnectForm: undefined
  IdentityCheckValidation: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    logoutUrl?: string
  }
  // TODO: this duplicate route is required until we solve PC-12433
  Validation: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    logoutUrl?: string
  }
  IdentityCheckPending: undefined
  IdentityCheckDMS: undefined
  // Confirmation
  IdentityCheckHonor: undefined
  BeneficiaryRequestSent: undefined
  UnderageAccountCreated: undefined
  // Errors
  EduConnectErrors: { code?: string; logoutUrl?: string }
  EduConnectErrorsPage: { code?: string; logoutUrl?: string }
}

/**
 * WARNING !
 * Deeplink: When updating the screen parameters, pay attention to the deeplink handlers.
 * If a deeplink handler indexes the screen with params you are changing,
 * please update the deeplink handler in consequence.
 */
export type RootStackParamList = {
  SignupForm: { preventCancellation?: boolean } | undefined
  Maintenance: undefined
  AccountCreated: undefined
  AfterChangeEmailValidationBuffer: {
    token: string
    expiration_timestamp: number
    new_email: string
  }
  AfterSignupEmailValidationBuffer: { token: string; expiration_timestamp: number; email: string }
  AppComponents: undefined
  ChangePassword: undefined
  ChangeEmail: undefined
  ChangeEmailExpiredLink: undefined
  CheatCodes: undefined
  CheatMenu: undefined
  ConfirmDeleteProfile: undefined
  BookingConfirmation: { offerId: number; bookingId: number }
  BookingDetails: { id: number }
  ConsentSettings: { onGoBack?: () => void } | undefined
  CulturalSurvey: undefined
  DeleteProfileSuccess: undefined
  EndedBookings: undefined
  ForgottenPassword: undefined
  FavoritesSorts: undefined
  Login?: {
    preventCancellation?: boolean
  }
  Navigation: undefined
  NavigationNotScreensPages: undefined
  NotificationSettings: undefined
  Offer: {
    id: number
    from?: Referrals
    moduleName?: string
  }
  OfferDescription: { id: number }
  ReinitializePassword: { email: string; token: string; expiration_timestamp: number }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  LegalNotices: undefined
  LocationFilter: undefined
  LocationPicker: undefined
  PersonalData: undefined
  SearchCategories: undefined
  SearchFilter: undefined
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  TabNavigator: {
    screen: TabRouteName
    params: TabParamList[TabRouteName]
  }
  SetPhoneNumber: undefined
  SetPhoneValidationCode: { phoneNumber: string; countryCode: CountryCode }
  PhoneValidationTooManyAttempts: undefined
  PhoneValidationTooManySMSSent: undefined
  VerifyEligibility: undefined
  NotYetUnderageEligibility: { eligibilityStartDatetime: string }
  FirstTutorial?: { shouldCloseAppOnBackAction: boolean }
  EighteenBirthday: undefined
  RecreditBirthdayNotification: undefined
  PageNotFound: undefined
  UserProfiling: undefined
  Venue: { id: number }
  LandscapePositionPage: undefined
  DeeplinksGenerator: undefined
} & IdentityCheckRootStackParamList

export type AllNavParamList = RootStackParamList & TabParamList

/** Type helpers to share screen names */
export type RootScreenNames = keyof RootStackParamList
export type ScreenNames = keyof AllNavParamList

/**
 * Type helper for useRoute
 *
 * const {
 *  params: { token, expiration_timestamp },
 * } = useRoute<UseRouteType<'ReinitializePassword'>>()
 */
export type UseRouteType<ScreenName extends ScreenNames> = RouteProp<AllNavParamList, ScreenName>
/**
 * Type helper for navigation prop
 *
 * type Props = {
 *   navigation: ScreenNavigationProp<'Home'>
 * }
 */
export type ScreenNavigationProp<ScreenName extends ScreenNames> = StackNavigationProp<
  AllNavParamList,
  ScreenName
>
/**
 * Type helper for useNavigation in the context of a Stack Navigator
 * Cf. https://reactnavigation.org/docs/navigation-prop/#navigator-dependent-functions
 *
 * const navigation = useNavigation<UseNavigationType>()
 */
export type UseNavigationType = StackNavigationProp<RootStackParamList>
/**
 * Type helper to access route params
 *
 * export type MyStackParamList = {
 *   Login?: { userId: string }
 * }
 *
 * RouteParams<'Login', MyStackParamList>  // will return ({ userId: string } | undefined)
 */
export type RouteParams<
  StackParamList extends Record<string, unknown>,
  Screename extends keyof StackParamList
> = Pick<StackParamList, Screename>[Screename]

export type NavigateParams<RouteName extends keyof ParamListBase> =
  undefined extends ParamListBase[RouteName]
    ? [RouteName] | [RouteName, ParamListBase[RouteName]]
    : [RouteName, ParamListBase[RouteName]]
export type RootNavigateParams = NavigateParams<keyof RootStackParamList>
export type AllNavigateParams = NavigateParams<keyof AllNavParamList>

export type NavigationResultState = ReturnType<typeof getStateFromPath>

/**
 * Type helper to declare a route
 */
type ExtendedPathConfig<ParamList> = Omit<PathConfig<ParamList>, 'initialRouteName'> & {
  deeplinkPaths?: string[]
}
export type GenericRoute<ParamList, NestedParamList = ParamListBase> = {
  name: keyof ParamList
  component: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  hoc?(component: ComponentType<any>): ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  path?: string
  deeplinkPaths?: string[]
  pathConfig?: ExtendedPathConfig<ParamList> | ExtendedPathConfig<NestedParamList>
  options?: { title?: string }
  secure?: boolean
}
export type Route = GenericRoute<RootStackParamList, TabParamList>

// Typeguard for screen params
export function isScreen<Screen extends AllNavigateParams[0]>(
  expectedScreen: Screen,
  screen: AllNavigateParams[0],
  params: AllNavigateParams[1]
): params is AllNavParamList[Screen] {
  return screen === expectedScreen
}
