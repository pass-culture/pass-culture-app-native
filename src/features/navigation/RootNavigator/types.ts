import { getStateFromPath, ParamListBase, PathConfig, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ComponentType } from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { BookingsTab } from 'features/bookings/enum'
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

export type CheatcodeRootStackParamList = {
  // Menu
  CheatcodesMenu: undefined
  // Features
  CheatcodesNavigationHome: undefined
  CheatcodesScreenCategoryThematicHomeHeader: undefined
  CheatcodesScreenDefaultThematicHomeHeader: undefined
  CheatcodesScreenHighlightThematicHomeHeader: undefined
  CheatcodesNavigationProfile: undefined
  CheatcodesNavigationIdentityCheck: undefined
  CheatcodesNavigationNewIdentificationFlow: undefined
  CheatcodesNavigationAchievements: undefined
  CheatcodesNavigationShare: undefined
  CheatcodesNavigationSubscription: undefined
  CheatcodesNavigationCulturalSurvey: undefined
  CheatcodesNavigationTutorial: undefined
  CheatcodesNavigationOnboarding: undefined
  CheatcodesNavigationProfileTutorial: undefined
  CheatcodesNavigationTrustedDevice: undefined
  CheatcodesScreenTrustedDeviceInfos: undefined
  CheatcodesNavigationInternal: undefined
  CheatcodesNavigationBookOffer: undefined
  // Others
  CheatcodesScreenDebugInformations: undefined
  CheatcodesScreenNewCaledonia: undefined
  CheatcodesNavigationErrors: undefined
  CheatcodesNavigationNotScreensPages: undefined
  CheatcodesScreenAccesLibre: undefined
  CheatcodesNavigationSignUp: undefined
  CheatcodesNavigationAccountManagement: undefined
}

export type CulturalSurveyRootStackParamList = {
  CulturalSurveyIntro: undefined
  CulturalSurveyQuestions: { question: CulturalSurveyQuestionEnum }
  CulturalSurveyThanks: undefined
  FAQWebview: undefined
}

export type TutorialRootStackParamList = {
  AgeSelectionOther: TutorialType
  EligibleUserAgeSelection: TutorialType
  OnboardingAgeInformation: { age: 15 | 16 | 17 | 18 }
  OnboardingGeneralPublicWelcome: undefined
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
  SuspensionChoice: { token: string }
  SuspensionChoiceExpiredLink: undefined
  SuspiciousLoginSuspendedAccount: undefined
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
  // Stepper
  Stepper: { from: StepperOrigin } | undefined
  // PhoneValidation
  SetPhoneNumberWithoutValidation: undefined
  SetPhoneNumber: undefined
  SetPhoneValidationCode: undefined
  PhoneValidationTooManyAttempts: undefined
  PhoneValidationTooManySMSSent: undefined
  NewSignup: undefined
  // Profile
  SetEmail: undefined
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
} & CulturalSurveyRootStackParamList

/**
 * WARNING !
 * Deeplink: When updating the screen parameters, pay attention to the deeplink handlers.
 * If a deeplink handler indexes the screen with params you are changing,
 * please update the deeplink handler in consequence.
 */
export type RootStackParamList = {
  ABTestingPOC: undefined
  AccountCreated: undefined
  AccountReactivationSuccess: undefined
  AccountStatusScreenHandler: undefined
  AfterSignupEmailValidationBuffer: { token: string; expiration_timestamp: number; email: string }
  Artist: {
    fromOfferId: number
  }
  BannedCountryError: undefined
  BookingConfirmation: { offerId: number; bookingId: number; apiRecoParams?: string }
  BookingDetails: { id: number }
  Bookings: { activeTab?: BookingsTab } | undefined
  ChangeCity: undefined
  ChangeEmail: { showModal: boolean } | undefined
  ChangeEmailExpiredLink: undefined
  ChangeEmailSetPassword: { token: string; emailSelectionToken: string }
  ChangePassword: undefined
  ChangeStatus: undefined
  ConfirmChangeEmail: { token: string; expiration_timestamp: number }
  ConfirmDeleteProfile: undefined
  ConsentSettings: { onGoBack?: () => void } | undefined
  CulturalSurvey: undefined
  DeactivateProfileSuccess: undefined
  DeeplinksGenerator: undefined
  DeleteProfileAccountHacked: undefined
  DeleteProfileAccountNotDeletable: undefined
  DeleteProfileConfirmation: undefined
  DeleteProfileContactSupport: undefined
  DeleteProfileEmailHacked: undefined
  DeleteProfileReason: undefined
  DeleteProfileSuccess: undefined
  EighteenBirthday: undefined
  EndedBookings: undefined
  FavoritesSorts: undefined
  FeedbackInApp: undefined
  ForgottenPassword: undefined
  FraudulentSuspendedAccount: undefined
  LegalNotices: undefined
  LocationFilter?: { selectedVenue?: Venue; selectedPlace?: SuggestedPlace }
  LocationPicker: undefined
  Login?: {
    displayForcedLoginHelpMessage?: boolean
    offerId?: number
    from?: StepperOrigin
  }
  Maintenance: undefined
  NewEmailSelection: { token: string }
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
  NotYetUnderageEligibility: { eligibilityStartDatetime: string }
  PageNotFound: undefined
  PersonalData: undefined
  RecreditBirthdayNotification: undefined
  ReinitializePassword: {
    email: string
    token: string
    expiration_timestamp: number
    from?: Referrals
  }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  SearchFilter: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  SignupForm:
    | { accountCreationToken?: string; email?: string; offerId?: number; from: StepperOrigin }
    | undefined
  SuspendAccountConfirmation: { token: string }
  SuspendAccountConfirmationWithoutAuthentication: undefined
  SuspendedAccountUponUserRequest: undefined
  TabNavigator: {
    screen: TabRouteName
    params: TabParamList[TabRouteName]
  }
  ThematicHome: ThematicHomeParams
  TrackEmailChange: undefined
  Tutorial?: { selectedAge?: 15 | 16 | 17 | 18 }
  UTMParameters: undefined
  ValidateEmailChange: { token: string }
  Venue: {
    id: number
    from?: Referrals
    searchId?: string
  }
  VenueMap: undefined
  VenueMapFiltersStackNavigator: undefined
  VenuePreviewCarousel: { id: number; defaultIndex?: number }
  VerifyEligibility: undefined
  MovieCalendar: undefined
  Achievements: { from: 'profile' | 'success' | 'cheatcodes' }
} & AccessibilityRootStackParamList &
  CheatcodeRootStackParamList &
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
