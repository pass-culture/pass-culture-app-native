import { getStateFromPath, ParamListBase, PathConfig, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ComponentType } from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { BookingsTab } from 'features/bookings/enum'
import { CheatcodesStackParamList } from 'features/navigation/CheatcodesStackNavigator/types'
import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { TutorialType } from 'features/tutorial/types'
import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place/types'

import { TabParamList, TabRouteName } from '../TabBar/types'

export type Referrals =
  | Lowercase<keyof AllNavParamList>
  | 'artist'
  | 'bookingimpossible'
  | 'chronicles'
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
  | 'comingSoonOffer'

type BaseThematicHome = {
  homeId: string
  videoModuleId?: string
}

type OtherThematicBlockHome = {
  from?: 'deeplink' | 'chronicles'
  moduleId?: string
  moduleListId?: string
}

type CategoryBlockThematicHome = {
  from: 'category_block'
  moduleId: string
  moduleListId: string
}
type HighlightThematicBlockThematicHome = {
  from: 'highlight_thematic_block'
  moduleId: string
  moduleListId?: never
}

export type ThematicHomeParams = BaseThematicHome &
  (OtherThematicBlockHome | CategoryBlockThematicHome | HighlightThematicBlockThematicHome)

export type AccessibilityRootStackParamList = {
  Accessibility: undefined
  AccessibilityActionPlan: undefined
  AccessibilityDeclarationMobile: undefined
  AccessibilityDeclarationWeb: undefined
  AccessibilityEngagement: undefined
  RecommendedPaths: undefined
}

export type CulturalSurveyRootStackParamList = {
  CulturalSurveyIntro: undefined
  CulturalSurveyQuestions: { question: CulturalSurveyQuestionEnum }
  CulturalSurveyThanks: undefined
  FAQWebview: undefined
}

export type TutorialRootStackParamList = {
  AgeSelectionFork: TutorialType
  AgeSelectionOther: TutorialType
  EligibleUserAgeSelection: TutorialType
  OnboardingAgeInformation: { age: 15 | 16 | 17 | 18 }
  OnboardingGeneralPublicWelcome: undefined
  OnboardingGeolocation: undefined
  OnboardingNotEligible: undefined
  OnboardingWelcome: undefined
  ProfileTutorialAgeInformation: { age: 15 | 16 | 17 | 18 }
  ProfileTutorialAgeInformationCreditV3: undefined
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
  BOOKING = 'booking',
  DEACTIVATE_PROFILE_SUCCESS = 'DeactivateProfileSuccess',
  DEEPLINK = 'deeplink',
  FAVORITE = 'favorite',
  FORGOTTEN_PASSWORD = 'forgottenPassword',
  HOME = 'home',
  LOGIN = 'login',
  NOTIFICATION = 'notification',
  OFFER = 'offer',
  ONBOARDING_GENERAL_PUBLIC_WELCOME = 'OnboardingGeneralPublicWelcome',
  ONBOARDING_NOT_ELIGIBLE = 'onboardingNotEligible',
  ONBOARDING_WELCOME = 'onboardingWelcome',
  PROFILE = 'profile',
  RESET_PASSWORD_EMAIL_SENT = 'resetPasswordEmailSent',
  SIGNUP = 'signup',
  THEMATIC_HOME = 'thematicHome',
  TUTORIAL = 'Tutorial',
  VALIDATE_EMAIL_CHANGE = 'validateEmailChange',
  VERIFY_ELIGIBILITY = 'verifyEligibility',
}

export type SubscriptionRootStackParamList = {
  // Other
  DisableActivation: undefined
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
  Achievements: { from: 'profile' | 'success' | 'cheatcodes' }
  AfterSignupEmailValidationBuffer: { token: string; expiration_timestamp: number; email: string }
  Artist: { fromOfferId: number }
  BannedCountryError: undefined
  BookingConfirmation: { offerId: number; bookingId: number; apiRecoParams?: string }
  BookingDetails: { id: number }
  Bookings: { activeTab?: BookingsTab } | undefined
  ChangeEmailExpiredLink: undefined
  CheatcodesStackNavigator: undefined
  Chronicles: { offerId: number; chronicleId?: number; from?: Referrals }
  CulturalSurvey: undefined
  DeeplinksGenerator: undefined
  EighteenBirthday: undefined
  EndedBookings: undefined
  FavoritesSorts: undefined
  ForgottenPassword: undefined
  FraudulentSuspendedAccount: undefined
  LocationFilter?: { selectedVenue?: Venue; selectedPlace?: SuggestedPlace }
  LocationPicker: undefined
  Login?: {
    displayForcedLoginHelpMessage?: boolean
    offerId?: number
    from?: StepperOrigin
  }
  Maintenance: undefined
  MovieCalendar: undefined
  NotYetUnderageEligibility: { eligibilityStartDatetime: string }
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
  PageNotFound: undefined
  RecreditBirthdayNotification: undefined
  ReinitializePassword: {
    email: string
    token: string
    expiration_timestamp: number
    from?: Referrals
  }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  SignupForm:
    | { accountCreationToken?: string; email?: string; offerId?: number; from: StepperOrigin }
    | undefined
  SuspendedAccountUponUserRequest: undefined
  TabNavigator: { screen: TabRouteName; params: TabParamList[TabRouteName] }
  ThematicHome: ThematicHomeParams
  Tutorial?: { selectedAge?: 15 | 16 | 17 | 18 }
  UTMParameters: undefined
  Venue: { id: number; from?: Referrals; searchId?: string }
  VenueMap: undefined
  VenueMapFiltersStackNavigator: undefined
  VenuePreviewCarousel: { id: number; defaultIndex?: number }
  VerifyEligibility: undefined
} & CheatcodesStackParamList &
  CulturalSurveyRootStackParamList &
  SubscriptionRootStackParamList &
  TrustedDeviceRootStackParamList &
  TutorialRootStackParamList

export type AllNavParamList = RootStackParamList &
  TabParamList &
  SearchStackParamList &
  ProfileStackParamList

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
export type ProfileNavigateParams = NavigateParams<keyof ProfileStackParamList>
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
