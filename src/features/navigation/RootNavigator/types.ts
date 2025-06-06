import { getStateFromPath, ParamListBase, PathConfig, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ComponentType } from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { BookingsTab } from 'features/bookings/enum'
import { ProfileType } from 'features/identityCheck/pages/profile/types'
import {
  CheatcodesStackParamList,
  CheatcodesStackRouteName,
} from 'features/navigation/CheatcodesStackNavigator/types'
import {
  OnboardingStackParamList,
  OnboardingStackRouteName,
} from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { SuggestedPlace } from 'libs/place/types'

import { TabParamList, TabRouteName } from '../TabBar/types'

export type Referrals =
  | Lowercase<keyof AllNavParamList>
  | 'artist'
  | 'bookingimpossible'
  | 'chronicles'
  | 'deeplink'
  | 'endedbookings'
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
  Accessibility?: Record<string, unknown> // I had to put type Record<string, unknown> so that getProfileStackConfig in DeeplinksGeneratorForm can take appAndMarketingParams, otherwise I would have just put undefined.
  AccessibilityActionPlan?: undefined
  AccessibilityDeclarationMobile?: undefined
  AccessibilityDeclarationWeb?: undefined
  AccessibilityEngagement?: undefined
  SiteMapScreen?: undefined
  RecommendedPaths?: undefined
}

export type CulturalSurveyRootStackParamList = {
  CulturalSurveyIntro: undefined
  CulturalSurveyQuestions: { question: CulturalSurveyQuestionEnum }
  CulturalSurveyThanks: undefined
  FAQWebview: undefined
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
  ProfileInformationValidation: ProfileType
  SetEmail: undefined
  SetName: ProfileType
  SetCity: ProfileType
  SetAddress: ProfileType
  SetStatus: ProfileType
  SetProfileBookingError: { offerId?: number }
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

type OfferParams = {
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

/**
 * WARNING !
 * Deeplink: When updating the screen parameters, pay attention to the deeplink handlers.
 * If a deeplink handler indexes the screen with params you are changing,
 * please update the deeplink handler in consequence.
 */
export type RootStackParamList = {
  OnboardingStackNavigator?: {
    screen: OnboardingStackRouteName
    params: OnboardingStackParamList[OnboardingStackRouteName]
  }
  ABTestingPOC: undefined
  AccountCreated: undefined
  AccountReactivationSuccess: undefined
  AccountStatusScreenHandler: undefined
  Achievements: { from: 'profile' | 'success' | 'cheatcodes' }
  AfterSignupEmailValidationBuffer: { token: string; expiration_timestamp: number; email: string }
  Artist: { id: string }
  BannedCountryError: undefined
  BookingConfirmation: { offerId: number; bookingId: number; apiRecoParams?: string }
  BookingDetails: { id: number }
  Bookings: { activeTab?: BookingsTab } | undefined
  ChangeEmailExpiredLink: undefined
  CheatcodesStackNavigator?: {
    screen: CheatcodesStackRouteName
    params?: CheatcodesStackParamList[CheatcodesStackRouteName]
  }
  Chronicles: { offerId: number; chronicleId?: number; from?: Referrals }
  CulturalSurvey: undefined
  DeeplinksGenerator: undefined
  EighteenBirthday: undefined
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
  Offer: OfferParams
  _DeeplinkOnlyOffer1: OfferParams
  _DeeplinkOnlyOffer2: OfferParams
  _DeeplinkOnlyOffer3: OfferParams
  OfferDescription: { id: number }
  OfferPreview: { id: number; defaultIndex?: number }
  OnboardingSubscription: undefined
  PageNotFound: undefined
  Profile: undefined
  ProfileStackNavigator?: {
    screen: ProfileStackRouteName
    params: ProfileStackParamList[ProfileStackRouteName]
  }
  RecreditBirthdayNotification: undefined
  ReinitializePassword: {
    email: string
    token: string
    expiration_timestamp: number
    from?: Referrals
  }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  SearchFilter?: Partial<SearchState & { accessibilityFilter: Partial<DisabilitiesProperties> }>
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
  ValidateEmailChange: { token: string }
  Venue: {
    id: number
    from?: Referrals
    searchId?: string
    fromThematicSearch?: ContentfulLabelCategories
  }
  VenueMap: undefined
  VenueMapFiltersStackNavigator: undefined
  VenuePreviewCarousel: { id: number; defaultIndex?: number }
  VerifyEligibility: undefined
} & CulturalSurveyRootStackParamList &
  SubscriptionRootStackParamList &
  TrustedDeviceRootStackParamList

export type AllNavParamList = RootStackParamList &
  TabParamList &
  SearchStackParamList &
  ProfileStackParamList &
  OnboardingStackParamList

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
export type CheatcodesNavigateParams = NavigateParams<keyof RootStackParamList>
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
export type RootRoute = GenericRoute<
  RootStackParamList,
  TabParamList & ProfileStackParamList & OnboardingStackParamList
>

// Typeguard for screen params
export function isScreen<Screen extends AllNavigateParams[0]>(
  expectedScreen: Screen,
  screen: AllNavigateParams[0],
  params: AllNavigateParams[1]
): params is AllNavParamList[Screen] {
  return screen === expectedScreen
}
