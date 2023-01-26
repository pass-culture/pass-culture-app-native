import { getStateFromPath, ParamListBase, PathConfig, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ComponentType } from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { SearchState } from 'features/search/types'
import { SuggestedPlace } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'

import { TabParamList, TabRouteName } from '../TabBar/types'

export type Referrals =
  | Lowercase<keyof AllNavParamList>
  | 'deeplink'
  | 'exclusivity'
  | 'bookingimpossible'
  | 'similar_offer'
  | 'setemail'

export type AccessibilityRootStackParamList = {
  Accessibility: undefined
  AccessibilityActionPlan: undefined
  AccessibilityDeclaration: undefined
  AccessibilityEngagement: undefined
  RecommendedPaths: undefined
}

export type CulturalSurveyRootStackParamList = {
  NavigationCulturalSurvey: undefined
  CulturalSurveyIntro: undefined
  CulturalSurveyQuestions: { question: CulturalSurveyQuestionEnum }
  CulturalSurveyThanks: undefined
}

export type OnboardingRootStackParamList = {
  AgeInformation: { age: number }
  AgeSelection: undefined
  AgeSelectionOther: undefined
  NavigationOnboarding: undefined
  OnboardingGeolocation: undefined
  OnboardingWelcome: undefined
}

export type SubscriptionRootStackParamList = {
  // Cheatcodes
  NavigationErrors: undefined
  NavigationIdentityCheck: undefined
  NavigationShareApp: undefined
  NavigationSignUp: undefined
  NewIdentificationFlow: undefined
  ThematicHomeHeaderCheatcode: undefined
  // Stepper
  IdentityCheckStepper: undefined
  // PhoneValidation
  SetPhoneNumber: undefined
  SetPhoneValidationCode: undefined
  PhoneValidationTooManyAttempts: undefined
  PhoneValidationTooManySMSSent: undefined
  // Profile
  SetName: undefined
  IdentityCheckCity: undefined
  IdentityCheckAddress: undefined
  IdentityCheckStatus: undefined
  IdentityCheckSchoolType: undefined
  // Identification
  ComeBackLater: undefined
  DMSIntroduction: { isForeignDMSInformation: boolean }
  ExpiredOrLostID: undefined
  IdentityCheckStart: undefined
  UbbleWebview: undefined
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
  SelectIDOrigin: undefined
  SelectIDStatus: undefined
  SelectPhoneStatus: undefined
  // TODO(PC-12433): this duplicate route is required until we solve PC-12433
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
  BeneficiaryAccountCreated: undefined
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
  SignupForm: { preventCancellation?: boolean; offerId?: number } | undefined
  Maintenance: undefined
  ABTestingPOC: undefined
  AccountCreated: undefined
  AccountReactivationSuccess: undefined
  AfterChangeEmailValidationBuffer: {
    token: string
    expiration_timestamp: number
    new_email: string
  }
  AfterSignupEmailValidationBuffer: { token: string; expiration_timestamp: number; email: string }
  AppComponents: undefined
  BannedCountryError: undefined
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
  FavoritesSorts: undefined
  ForgottenPassword: undefined
  FraudulentAccount: undefined
  Login?: {
    preventCancellation?: boolean
    displayForcedLoginHelpMessage?: boolean
    offerId?: number
  }
  Navigation: undefined
  NavigationAccountSuspension: undefined
  NavigationNotScreensPages: undefined
  NavigationProfile: undefined
  NotificationSettings: undefined
  Offer: {
    id: number
    from?: Referrals
    moduleName?: string
    moduleId?: string
    fromOfferId?: number
  }
  OfferDescription: { id: number }
  SuspensionScreen: undefined
  ReinitializePassword: { email: string; token: string; expiration_timestamp: number }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  LegalNotices: undefined
  LocationFilter?: { selectedVenue?: SuggestedVenue; selectedPlace?: SuggestedPlace }
  LocationPicker: undefined
  PersonalData: undefined
  SearchFilter: Partial<SearchState>
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  SuspendedAccount: undefined
  TabNavigator: {
    screen: TabRouteName
    params: TabParamList[TabRouteName]
  }
  VerifyEligibility: undefined
  NotYetUnderageEligibility: { eligibilityStartDatetime: string }
  FirstTutorial?: { shouldCloseAppOnBackAction: boolean }
  EighteenBirthday: undefined
  RecreditBirthdayNotification: undefined
  PageNotFound: undefined
  Venue: { id: number }
  DeeplinksGenerator: undefined
  UTMParameters: undefined
  ThematicHome: { homeId: string }
} & AccessibilityRootStackParamList &
  CulturalSurveyRootStackParamList &
  OnboardingRootStackParamList &
  SubscriptionRootStackParamList

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
type ExtendedPathConfig<ParamList extends Record<string, unknown>> = Omit<
  PathConfig<ParamList>,
  'initialRouteName'
> & {
  deeplinkPaths?: string[]
}
export type GenericRoute<
  ParamList extends Record<string, unknown>,
  NestedParamList extends Record<string, unknown> = ParamListBase
> = {
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
