import { getStateFromPath, ParamListBase, PathConfig, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ComponentType } from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { SearchState } from 'features/search/types'
import { TutorialType } from 'features/tutorial/types'
import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place/types'

import { TabParamList, TabRouteName } from '../TabBar/types'

export type Referrals =
  | Lowercase<keyof AllNavParamList>
  | 'artist'
  | 'bookingimpossible'
  | 'deeplink'
  | 'exclusivity'
  | 'highlightOffer'
  | 'home'
  | 'search'
  | 'searchAutoComplete'
  | 'searchLanding'
  | 'searchPlaylist'
  | 'searchVenuePlaylist'
  | 'setemail'
  | 'similar_offer'
  | 'trend_block'
  | 'venue'
  | 'venueMap'
  | 'venueList'
  | 'video'
  | 'videoModal'
  | 'video_carousel_block'

type BaseThematicHome = {
  homeId: string
  videoModuleId?: string
  from?: never
  moduleId?: never
  moduleListId?: never
}
type CategoryBlockThematicHome = BaseThematicHome & {
  from: 'category_block'
  moduleId: string
  moduleListId: string
}
type HighlightThematicBlockThematicHome = BaseThematicHome & {
  from: 'highlight_thematic_block'
  moduleId: string
  moduleListId?: never
}
type ThematicHomeParams =
  | BaseThematicHome
  | CategoryBlockThematicHome
  | HighlightThematicBlockThematicHome

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
  FAQWebview: undefined
}

export type TutorialRootStackParamList = {
  AgeSelection: TutorialType
  AgeSelectionOther: TutorialType
  CheatcodeNavigationTutorial: undefined
  CheatcodeNavigationOnboarding: undefined
  CheatcodeNavigationProfileTutorial: undefined
  OnboardingAgeInformation: { age: 15 | 16 | 17 | 18 }
  OnboardingGeolocation: undefined
  OnboardingWelcome: undefined
  ProfileTutorialAgeInformation: { age: 15 | 16 | 17 | 18 }
}

export type TrustedDeviceRootStackParamList = {
  AccountSecurity: {
    token: string
    email: string
    reset_password_token: string
    reset_token_expiration_timestamp: number
  }
  AccountSecurityBuffer: {
    token: string
    email: string
    reset_password_token: string
    reset_token_expiration_timestamp: number
  }
  NavigationTrustedDevice: undefined
  SuspensionChoice: { token: string }
  SuspensionChoiceExpiredLink: undefined
  SuspiciousLoginSuspendedAccount: undefined
  TrustedDeviceInfos: undefined
}

export enum StepperOrigin {
  HOME = 'home',
  FAVORITE = 'favorite',
  PROFILE = 'profile',
  DEEPLINK = 'deeplink',
  OFFER = 'offer',
  TUTORIAL = 'Tutorial',
  VERIFY_ELIGIBILITY = 'verifyEligibility',
  LOGIN = 'login',
  BOOKING = 'booking',
  DEACTIVATE_PROFILE_SUCCESS = 'DeactivateProfileSuccess',
  FORGOTTEN_PASSWORD = 'forgottenPassword',
  ONBOARDING = 'onboarding',
  RESET_PASSWORD_EMAIL_SENT = 'resetPasswordEmailSent',
  SIGNUP = 'signup',
  VALIDATE_EMAIL_CHANGE = 'validateEmailChange',
  THEMATIC_HOME = 'thematicHome',
}

export type SubscriptionRootStackParamList = {
  // Cheatcodes
  NavigationErrors: undefined
  NavigationIdentityCheck: undefined
  NavigationShareApp: undefined
  NavigationSignUp: undefined
  NewIdentificationFlow: undefined
  // Stepper
  Stepper: { from: StepperOrigin } | undefined
  // PhoneValidation
  SetPhoneNumber: undefined
  SetPhoneValidationCode: undefined
  PhoneValidationTooManyAttempts: undefined
  PhoneValidationTooManySMSSent: undefined
  NewSignup: undefined
  // Profile
  SetName: undefined
  SetCity: undefined
  SetAddress: undefined
  SetStatus: undefined
  // Identification
  ComeBackLater: undefined
  DMSIntroduction: { isForeignDMSInformation: boolean }
  ExpiredOrLostID: undefined
  UbbleWebview: undefined
  IdentityCheckEnd: undefined
  IdentityCheckUnavailable: { withDMS?: boolean }
  EduConnectForm: undefined
  EduConnectValidation: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    logoutUrl?: string
  }
  SelectIDOrigin: undefined
  SelectIDStatus: undefined
  SelectPhoneStatus: undefined
  IdentificationFork: undefined
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
  SignupForm:
    | { accountCreationToken?: string; email?: string; offerId?: number; from: StepperOrigin }
    | undefined
  Maintenance: undefined
  ABTestingPOC: undefined
  AccountCreated: undefined
  AccountReactivationSuccess: undefined
  AfterSignupEmailValidationBuffer: { token: string; expiration_timestamp: number; email: string }
  AppComponents: undefined
  BannedCountryError: undefined
  ChangeCity: undefined
  ChangePassword: undefined
  ChangeEmail: { showModal: boolean } | undefined
  ChangeEmailSetPassword: { token: string; emailSelectionToken: string }
  ChangeStatus: undefined
  FeedbackInApp: undefined
  TrackEmailChange: undefined
  NewEmailSelection: { token: string }
  ChangeEmailExpiredLink: undefined
  CheatCodes: undefined
  CheatMenu: undefined
  ConfirmChangeEmail: { token: string; expiration_timestamp: number }
  DeleteProfileReason: undefined
  DeleteProfileContactSupport: undefined
  DeleteProfileEmailHacked: undefined
  DeleteProfileAccountHacked: undefined
  DeleteProfileAccountNotDeletable: undefined
  ConfirmDeleteProfile: undefined
  SuspendAccountConfirmationWithoutAuthentication: undefined
  BookingConfirmation: { offerId: number; bookingId: number; apiRecoParams?: string }
  BookingDetails: { id: number }
  ConsentSettings: { onGoBack?: () => void } | undefined
  CulturalSurvey: undefined
  DeleteProfileConfirmation: undefined
  DeleteProfileSuccess: undefined
  DeactivateProfileSuccess: undefined
  Bookings: undefined
  EndedBookings: undefined
  FavoritesSorts: undefined
  ForgottenPassword: undefined
  FraudulentSuspendedAccount: undefined
  Login?: {
    displayForcedLoginHelpMessage?: boolean
    offerId?: number
    from?: StepperOrigin
  }
  Navigation: undefined
  NavigationAccountSuspension: undefined
  NavigationNotScreensPages: undefined
  NavigationProfile: undefined
  NavigationSubscription: undefined
  NotificationsSettings: undefined
  Offer: {
    id: number
    from?: Referrals
    moduleName?: string
    moduleId?: string
    fromOfferId?: number
    fromMultivenueOfferId?: number
    openModalOnNavigation?: boolean
    searchId?: string
    apiRecoParams?: string
    playlistType?: PlaylistType
  }
  OfferDescription: { id: number }
  OfferPreview: { id: number; defaultIndex?: number }
  OnboardingSubscription: undefined
  SuspendAccountConfirmation: { token: string }
  SuspensionScreen: undefined
  ReinitializePassword: {
    email: string
    token: string
    expiration_timestamp: number
    from?: Referrals
  }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  LegalNotices: undefined
  LocationFilter?: { selectedVenue?: Venue; selectedPlace?: SuggestedPlace }
  LocationPicker: undefined
  PersonalData: undefined
  SearchFilter: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  SuspendedAccountUponUserRequest: undefined
  TabNavigator: {
    screen: TabRouteName
    params: TabParamList[TabRouteName]
  }
  VerifyEligibility: undefined
  NotYetUnderageEligibility: { eligibilityStartDatetime: string }
  Tutorial?: { selectedAge?: 15 | 16 | 17 | 18 }
  EighteenBirthday: undefined
  RecreditBirthdayNotification: undefined
  PageNotFound: undefined
  ValidateEmailChange: { token: string }
  Venue: {
    id: number
    from?: Referrals
    searchId?: string
  }
  Artist: {
    fromOfferId: number
  }
  VenueMap: undefined
  DeeplinksGenerator: undefined
  UTMParameters: undefined
  ThematicHome: ThematicHomeParams
  // cheatcodes
  AccesLibre: undefined
  DefaultThematicHomeHeaderCheatcode: undefined
  HighlightThematicHomeHeaderCheatcode: undefined
  CategoryThematicHomeHeaderCheatcode: undefined
  ThematicHeaders: undefined
  MarketingBlocks: undefined
  MovieCalendar: undefined
  Achivements: undefined
  BadgeDetails: { id: string }
} & AccessibilityRootStackParamList &
  CulturalSurveyRootStackParamList &
  TutorialRootStackParamList &
  SubscriptionRootStackParamList &
  TrustedDeviceRootStackParamList

export type AllNavParamList = RootStackParamList & TabParamList & SearchStackParamList

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
  ScreenName extends keyof StackParamList,
> = Pick<StackParamList, ScreenName>[ScreenName]

type NavigateParams<RouteName extends keyof ParamListBase> =
  undefined extends ParamListBase[RouteName]
    ? [RouteName] | [RouteName, ParamListBase[RouteName]]
    : [RouteName, ParamListBase[RouteName]]
export type RootNavigateParams = NavigateParams<keyof RootStackParamList>
type AllNavigateParams = NavigateParams<keyof AllNavParamList>

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
  NestedParamList extends Record<string, unknown> = ParamListBase,
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
export type RootRoute = GenericRoute<RootStackParamList, TabParamList>

// Typeguard for screen params
export function isScreen<Screen extends AllNavigateParams[0]>(
  expectedScreen: Screen,
  screen: AllNavigateParams[0],
  params: AllNavigateParams[1]
): params is AllNavParamList[Screen] {
  return screen === expectedScreen
}
