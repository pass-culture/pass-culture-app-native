import { Platform } from 'react-native'
import { Social } from 'react-native-share'

import {
  AchievementEnum,
  IdentityCheckMethod,
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  RecommendationApiParams,
  VenueContactModel,
} from 'api/gen'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { PreValidationSignupStep } from 'features/auth/enums'
import { STEP_LABEL, Step } from 'features/bookOffer/context/reducer'
import { CookiesChoiceByCategory } from 'features/cookies/types'
import { FavoriteSortBy } from 'features/favorites/types'
import { DeprecatedIdentityCheckStep, IdentityCheckStep } from 'features/identityCheck/types'
import {
  Referrals,
  StepperOrigin,
  ThematicHomeParams,
} from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { PlaylistType } from 'features/offer/enums'
import { NonEligible } from 'features/onboarding/enums'
import { EligibleAges } from 'features/onboarding/types'
import { ReactionFromEnum } from 'features/reactions/enum'
import {
  RemoteBannerOrigin,
  RemoteBannerType,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { GridListLayout, SearchState } from 'features/search/types'
import { ShareAppModalType } from 'features/share/types'
import { SubscriptionAnalyticsParams } from 'features/subscription/types'
import { buildPerformSearchState, urlWithValueMaxLength } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { ConsultOfferLogParams } from 'libs/analytics/types'
import { buildAccessibilityFilterParam, buildModuleDisplayedOnHomepage } from 'libs/analytics/utils'
import { ContentTypes } from 'libs/contentful/types'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { LocationMode } from 'libs/location/types'
import { PageTrackingInfo } from 'shared/tracking/TrackingManager'

type ConsultHomeParams = { homeEntryId: string }

type ConsultThematicHomeParams = ConsultHomeParams & {
  from?: ThematicHomeParams['from'] | 'video_carousel_block'
  moduleId?: string
  moduleListId?: string
  moduleItemId?: string
}
type ShareParams = { from: Referrals; social?: Social | 'Other' } & (
  | { type: 'Offer'; offerId: number }
  | { type: 'Venue'; venueId: number }
  | { type: 'App' }
)

type ScreenshotParams = { from: string } & (
  | { offerId?: number }
  | { venueId?: number }
  | { bookingId?: number }
)

export type OfferAnalyticsData = {
  offerId?: number
}

type OfferIdOrVenueId = { offerId: number; venueId?: never } | { venueId: number; offerId?: never }

export type LoginRoutineMethod =
  | 'fromLogin'
  | 'fromSignup'
  | 'fromReinitializePassword'
  | 'fromConfirmChangeEmail'

export type SSOType = 'SSO_login' | 'SSO_signup'

/* eslint sort-keys-fix/sort-keys-fix: "error" */
export const logEventAnalytics = {
  logAcceptNotifications: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACCEPT_NOTIFICATIONS }),
  logAccessibilityBannerClicked: (acceslibreId?: string | null) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACCESSIBILITY_BANNER_CLICKED }, { acceslibreId }),
  logAccountDeletion: () => analytics.logEvent({ firebase: AnalyticsEvent.ACCOUNT_DELETION }),
  logAccountReactivation: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACCOUNT_REACTIVATION }, { from }),
  logActivateGeolocfromSearchResults: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACTIVATE_GEOLOC_FROM_SEARCH_RESULTS }),
  logAllModulesSeen: (numberOfModules: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ALL_MODULES_SEEN }, { numberOfModules }),
  logAllTilesSeen: (params: {
    moduleName?: string
    numberOfTiles?: number
    searchId?: string
    moduleId?: string
    venueId?: number
    apiRecoParams?: RecommendationApiParams
  }) => analytics.logEvent({ firebase: AnalyticsEvent.ALL_TILES_SEEN }, params),
  logApplyVenueMapFilter: (params: { venueType: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.APPLY_VENUE_MAP_FILTER }, params),
  logBackToHomeFromEduconnectError: (params: { fromError: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BACK_TO_HOME_FROM_EDUCONNECT_ERROR }, params),
  logBookingConfirmation: (params: {
    offerId: string
    bookingId: string
    fromOfferId?: string
    fromMultivenueOfferId?: string
    playlistType?: PlaylistType
  }) => analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_CONFIRMATION }, params),
  logBookingDetailsScrolledToBottom: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.BOOKING_DETAILS_SCROLLED_TO_BOTTOM },
      {
        offerId,
      }
    ),
  logBookingError: (offerId: number, code: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_ERROR }, { code, offerId }),
  logBookingImpossibleiOS: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_IMPOSSIBLE_IOS }, { offerId }),
  logBookingOfferConfirmDates: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_OFFER_CONFIRM_DATES }, { offerId }),
  logBookingsScrolledToBottom: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKINGS_SCROLLED_TO_BOTTOM }),
  logBusinessBlockClicked: (params: {
    moduleName: string
    moduleId: string
    homeEntryId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.BUSINESS_BLOCK_CLICKED }, params),
  logCampaignTrackerEnabled: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CAMPAIGN_TRACKER_ENABLED }),
  logCancelBooking: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CANCEL_BOOKING }, { offerId }),
  logCancelBookingFunnel: (step: Step, offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.CANCEL_BOOKING_FUNNEL },
      {
        offerId,
        step: STEP_LABEL[step],
      }
    ),
  logCancelSignup: (pageName: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CANCEL_SIGNUP }, { pageName }),
  logCategoryBlockClicked: (params: {
    moduleId: string
    moduleListID: string
    entryId: string
    toEntryId: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CATEGORY_BLOCK_CLICKED }, params),
  logChangeOrientationToggle: (enabled: boolean) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CHANGE_ORIENTATION_TOGGLE }, { enabled }),
  logChooseEduConnectMethod: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.CHOOSE_EDUCONNECT_METHOD,
    }),
  logChooseUbbleMethod: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.CHOOSE_UBBLE_METHOD,
    }),
  logClickAllClubRecos: (params: { offerId: string; from: Referrals; categoryName: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_ALL_CLUB_RECOS }, params),
  logClickBookOffer: (params: {
    offerId: number
    from?: Referrals
    searchId?: string
    apiRecoParams?: RecommendationApiParams
    playlistType?: PlaylistType
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CLICK_BOOK_OFFER }, params),
  logClickCopyDebugInfo: (userId?: number) => {
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_COPY_DEBUG_INFO }, { userId })
  },
  logClickEmailOrganizer: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_EMAIL_ORGANIZER }),
  logClickExpandArtistBio: (params: { artistId: string; artistName: string; from: Referrals }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_EXPAND_ARTIST_BIO }, params),
  logClickForceUpdate: (appVersionId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_FORCE_UPDATE }, { appVersionId }),
  logClickInfoReview: (params: {
    offerId: string
    from: Referrals
    categoryName: string
    userId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CLICK_INFO_REVIEW }, params),
  logClickMailDebugInfo: (userId?: number) => {
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_MAIL_DEBUG_INFO }, { userId })
  },
  logClickSeeMore: (params: {
    moduleName: string
    moduleId: string
    from?: Referrals
    homeEntryId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.SEE_MORE_CLICKED }, params),
  logClickSocialNetwork: (network: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_SOCIAL_NETWORK }, { network }),
  logClickWhatsClub: (params: { offerId: string; from: Referrals; categoryName: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_WHATS_CLUB }, params),
  logConfirmBookingCancellation: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONFIRM_BOOKING_CANCELLATION }, { offerId }),
  logConnectionInfo: (params: { type: string; generation?: string | null }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONNECTION_INFO }, params),
  logConsultAccessibility: (params: OfferIdOrVenueId) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES }, params),
  logConsultAchievementModal: (params: { achievementName: string; state: 'unlocked' | 'locked' }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ACHIEVEMENT_MODAL }, params),
  logConsultAchievementsSuccessModal: (achievementName: AchievementEnum[]) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.CONSULT_ACHIEVEMENTS_SUCCESS_MODAL },
      { achievementName }
    ),
  logConsultApplicationProcessingModal: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.CONSULT_APPLICATION_PROCESSING_MODAL },
      {
        offerId,
      }
    ),
  logConsultArticleAccountDeletion: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ARTICLE_ACCOUNT_DELETION }),
  logConsultArtist: (params: {
    artistId: string
    artistName: string
    from: Referrals
    offerId?: string
    venueId?: string
    searchId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ARTIST }, params),
  logConsultArtistFakeDoor: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ARTIST_FAKE_DOOR }),
  logConsultAuthenticationModal: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_AUTHENTICATION_MODAL }, { offerId }),
  logConsultAvailableDates: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_AVAILABLE_DATES }, { offerId }),
  logConsultChronicle: (params: { offerId?: number; chronicleId?: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_CHRONICLE }, params),
  logConsultDescriptionDetails: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS }, { offerId }),
  logConsultDisclaimerValidationMail: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_DISCLAIMER_VALIDATION_MAIL }),
  logConsultErrorApplicationModal: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ERROR_APPLICATION_MODAL }, { offerId }),
  logConsultFinishSubscriptionModal: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.CONSULT_FINISH_SUBSCRIPTION_MODAL },
      {
        offerId,
      }
    ),
  logConsultHome: (params: ConsultHomeParams) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_HOME }, params),
  logConsultItinerary: (params: OfferIdOrVenueId & { from: Referrals }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ITINERARY }, params),
  logConsultModalBeneficiaryCeilings: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_MODAL_BENEFICIARY_CEILINGS }),
  logConsultModalExpiredGrant: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_MODAL_EXPIRED_GRANT }),
  logConsultOffer: (params: ConsultOfferLogParams) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, params),
  logConsultPracticalInformations: (params: { venueId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_PRACTICAL_INFORMATIONS }, params),
  logConsultReactionFakeDoor: (params: { from: NativeCategoryIdEnumv2 }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_REACTION_FAKE_DOOR }, params),
  logConsultSubscriptionModal: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_SUBSCRIPTION_MODAL }),
  logConsultThematicHome: (params: ConsultThematicHomeParams) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_HOME }, params),
  logConsultTutorial: (params: { from: string; age?: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_TUTORIAL }, params),
  logConsultVenue: (params: {
    venueId: string
    from: Referrals
    moduleName?: string
    moduleId?: string
    homeEntryId?: string
    searchId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_VENUE }, params),
  logConsultVenueMap: ({ from, searchId }: { from: Referrals; searchId?: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_VENUE_MAP }, { from, searchId }),
  logConsultVenueOffers: (params: { venueId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_VENUE_OFFERS }, params),
  logConsultVenueVideoFakeDoor: ({ venueType }: { venueType?: string | null }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_VENUE_VIDEO_FAKE_DOOR }, { venueType }),
  logConsultVideo: (params: {
    from: Referrals
    moduleId?: string
    homeEntryId?: string
    youtubeId?: string
    offerId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_VIDEO }, params),
  logConsultWholeOffer: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_WHOLE_OFFER }, { offerId }),
  logConsultWithdrawal: (params: OfferIdOrVenueId) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES }, params),
  logContactFraudTeam: ({ from }: { from: Referrals }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONTACT_FRAUD_TEAM }, { from }),
  logContinueCGU: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.CONTINUE_CGU,
    }),
  logContinueIdentityCheck: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_IDENTITY_CHECK }),
  logContinueSignup: () => analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_SIGNUP }),
  logCopyAddress: (params: { from: Referrals; venueId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.COPY_ADDRESS }, params),
  logCulturalSurveyScrolledToBottom: (params: { questionId?: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CULTURAL_SURVEY_SCROLLED_TO_BOTTOM }, params),
  logDiscoverOffers: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISCOVER_OFFERS }, { from }),
  logDismissAccountSecurity: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISMISS_ACCOUNT_SECURITY }),
  logDismissNotifications: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISMISS_NOTIFICATIONS }),
  logDismissShareApp: (type: ShareAppModalType) =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISMISS_SHARE_APP }, { type }),
  logDisplayAchievements: (params: {
    from: 'profile' | 'success' | 'cheatcodes'
    numberUnlocked: number
  }) => analytics.logEvent({ firebase: AnalyticsEvent.DISPLAY_ACHIEVEMENTS }, params),
  logDisplayForcedLoginHelpMessage: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISPLAY_FORCED_LOGIN_HELP_MESSAGE }),
  logErrorSavingNewEmail: (errorCode: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ERROR_SAVING_NEW_EMAIL }, { code: errorCode }),
  logExclusivityBlockClicked: (params: {
    moduleName: string
    moduleId: string
    homeEntryId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED }, params),
  logExtendSearchRadiusClicked: (searchId?: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.EXTEND_SEARCH_RADIUS_CLICKED }, { searchId }),
  logGoToProfil: ({ from, offerId }: { from: string; offerId: number }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.GO_TO_PROFIL },
      {
        from,
        offerId,
      }
    ),
  logHasAcceptedAllCookies: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_ACCEPTED_ALL_COOKIES }),
  logHasActivateGeolocFromTutorial: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL }),
  logHasAddedOfferToFavorites: (params: {
    offerId: number
    from?: Referrals
    moduleName?: string
    moduleId?: string
    searchId?: string
    apiRecoParams?: RecommendationApiParams
    playlistType?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES }, params),
  logHasAppliedFavoritesSorting: ({ sortBy }: { sortBy: FavoriteSortBy }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_APPLIED_FAVORITES_SORTING },
      {
        type: sortBy,
      }
    ),
  logHasBookedCineScreeningOffer: (params: { offerId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_BOOKED_CINE_SCREENING_OFFER }, params),
  logHasChangedPassword: ({
    from,
    reason,
  }: {
    from: Referrals
    reason: 'changePassword' | 'resetPassword'
  }) => analytics.logEvent({ firebase: AnalyticsEvent.HAS_CHANGED_PASSWORD }, { from, reason }),
  logHasChosenPrice: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_CHOSEN_PRICE }),
  logHasChosenTime: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_CHOSEN_TIME }),
  logHasClickedContactForm: (
    from:
      | 'AccessibilityDeclaration'
      | 'DeleteProfileContactSupport'
      | 'DebugScreen'
      | 'FeedbackInApp'
      | 'LegalNotices'
      | 'NotEligibleEduConnect'
      | 'PhoneValidationTooManyAttempts'
      | 'SignupConfirmationEmailSent'
  ) => analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_CONTACT_FORM }, { from }),
  logHasClickedDuoStep: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_DUO_STEP }),
  logHasClickedFakeDoorCTA: (params: { offerId: number; userId?: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_FAKE_DOOR_CTA }, params),
  logHasClickedGridListToggle: ({ fromLayout }: { fromLayout: GridListLayout }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_GRID_LIST_TOGGLE }, { fromLayout }),
  logHasClickedMissingCode: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_MISSING_CODE }),
  logHasClickedRemoteActivationBanner: (from: RemoteBannerOrigin, options: RemoteBannerType) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_CLICKED_REMOTE_ACTIVATION_BANNER },
      { from, options }
    ),
  logHasClickedRemoteGenericBanner: (from: RemoteBannerOrigin, options: RemoteBannerType) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_CLICKED_REMOTE_GENERIC_BANNER },
      { from, options }
    ),
  logHasClickedTutorialFAQ: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_TUTORIAL_FAQ }),
  logHasCorrectedEmail: ({ from }: { from: Referrals }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CORRECTED_EMAIL }, { from }),
  logHasDismissedAppSharingModal: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_DISMISSED_APP_SHARING_MODAL }),
  logHasDismissedModal: (params: {
    moduleId: string
    modalType: ContentTypes
    seenDuration: number
    videoDuration: number
  }) => analytics.logEvent({ firebase: AnalyticsEvent.HAS_DISMISSED_MODAL }, params),
  logHasMadeAChoiceForCookies: ({ from, type }: { from: string; type: CookiesChoiceByCategory }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_MADE_A_CHOICE_FOR_COOKIES },
      {
        from,
        type: JSON.stringify(type),
      }
    ),
  logHasOpenedAccessibilityAccordion: (handicap: string) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_OPENED_ACCESSIBILITY_ACCORDION },
      { handicap }
    ),
  logHasOpenedCookiesAccordion: (type: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_OPENED_COOKIES_ACCORDION }, { type }),
  logHasRefusedCookie: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_REFUSED_COOKIE }),
  logHasRequestedCode: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_REQUESTED_CODE }),
  logHasSearchedCinemaQuery: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_SEARCHED_CINEMA_QUERY }),
  logHasSeenAllVideo: (params: {
    moduleId: string
    seenDuration?: number
    videoDuration?: number
    youtubeId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.HAS_SEEN_ALL_VIDEO }, params),
  logHasSharedApp: (type: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_SHARED_APP }, { type }),
  logHasSkippedCulturalSurvey: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_SKIPPED_CULTURAL_SURVEY }),
  logHasSkippedTutorial: (pageName: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_SKIPPED_TUTORIAL }, { pageName }),
  logHasStartedCulturalSurvey: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_STARTED_CULTURAL_SURVEY }),
  logHelpCenterContactSignupConfirmationEmailSent: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT,
    }),
  logHighlightBlockClicked: (params: { moduleId: string; entryId: string; toEntryId: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HIGHLIGHT_BLOCK_CLICKED }, params),
  logIdentityCheckAbort: (params: {
    method: IdentityCheckMethod
    reason: string | null
    errorType: string | null
  }) => analytics.logEvent({ firebase: AnalyticsEvent.IDENTITY_CHECK_ABORT }, params),
  logIdentityCheckStep: (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.IDENTITY_CHECK_STEP },
      { nextStep, step: nextStep }
    ),
  logIdentityCheckSuccess: (params: { method: IdentityCheckMethod }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.IDENTITY_CHECK_SUCCESS }, params),
  logLocationToggle: (enabled: boolean) =>
    analytics.logEvent({ firebase: AnalyticsEvent.LOCATION_TOGGLE }, { enabled }),
  logLogin: (params: { method: string; type?: SSOType }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.LOGIN }, params),
  logLoginClicked: (params: { from: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.LOGIN_CLICKED }, params),
  logLogout: () => analytics.logEvent({ firebase: AnalyticsEvent.LOGOUT }),
  logModifyMail: () => analytics.logEvent({ firebase: AnalyticsEvent.MODIFY_MAIL }),
  logModuleDisplayed: (params: { moduleId: string; displayedOn: Referrals; venueId?: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.MODULE_DISPLAYED }, params),
  logModuleDisplayedOnHomepage: (params: {
    moduleId: string
    moduleType: ContentTypes
    index: number
    homeEntryId: string | undefined
    hybridModuleOffsetIndex?: number | string
    call_id?: string | null
    offers?: string[]
    venues?: string[]
  }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.MODULE_DISPLAYED_ON_HOMEPAGE },
      {
        call_id: params.call_id,
        homeEntryId: params.homeEntryId,
        hybridModuleOffsetIndex: params.hybridModuleOffsetIndex,
        index: params.index,
        moduleId: params.moduleId,
        moduleType: params.moduleType,
        ...buildModuleDisplayedOnHomepage(10, params.offers, params.venues),
      }
    ),
  logMultivenueOptionDisplayed: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.MULTI_VENUE_OPTION_DISPLAYED }, { offerId }),
  logNoSearchResult: (query: string, searchId?: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.NO_SEARCH_RESULT }, { query, searchId }),
  logNotificationToggle: (enableEmail: boolean, enablePush?: boolean) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.NOTIFICATION_TOGGLE },
      {
        enableEmail,
        enablePush: Platform.OS === 'android' ? true : enablePush,
      }
    ),
  logOfferSeenDuration: (offerId: number, duration: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.OFFER_SEEN_DURATION }, { duration, offerId }),
  logOnboardingStarted: (params: { type: 'login' | 'start' }) =>
    analytics.logEvent(
      {
        firebase: AnalyticsEvent.ONBOARDING_STARTED,
      },
      params
    ),
  logOpenApp: (params: { appsFlyerUserId?: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_APP }, params),
  logOpenDMSForeignCitizenURL: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_DMS_FOREIGN_CITIZEN_URL }),
  logOpenDMSFrenchCitizenURL: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_DMS_FRENCH_CITIZEN_URL }),
  logOpenExternalUrl: (url: string, params: OfferAnalyticsData) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.OPEN_EXTERNAL_URL },
      {
        offerId: params.offerId,
        url: urlWithValueMaxLength(url),
      }
    ),
  logOpenLocationSettings: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_LOCATION_SETTINGS }),
  logOpenNotificationSettings: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS }),
  logPerformSearch: (
    searchState: SearchState,
    disabilities: DisabilitiesProperties,
    nbHits: number,
    currentView: SearchStackRouteName
  ) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.PERFORM_SEARCH },
      {
        ...buildPerformSearchState(searchState, currentView),
        accessibilityFilter: buildAccessibilityFilterParam(disabilities),
        searchNbResults: nbHits,
      }
    ),

  logPinMapPressed: ({ venueType, venueId }: { venueType?: string | null; venueId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.PIN_MAP_PRESSED }, { venueId, venueType }),
  logPlaylistHorizontalScroll: (
    fromOfferId?: number,
    playlistType?: PlaylistType,
    apiRecoParams?: RecommendationApiParams
  ) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.PLAYLIST_HORIZONTAL_SCROLL },
      {
        ...apiRecoParams,
        fromOfferId,
        playlistType,
      }
    ),
  logPlaylistVerticalScroll: (params: {
    offerId: number
    playlistType: PlaylistType
    nbResults: number
    fromOfferId?: number
  }) => analytics.logEvent({ firebase: AnalyticsEvent.PLAYLIST_VERTICAL_SCROLL }, params),
  logProfilScrolledToBottom: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.PROFIL_SCROLLED_TO_BOTTOM }),
  logProfilSignUp: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.PROFIL_SIGN_UP,
    }),
  logQuitAuthenticationMethodSelection: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.QUIT_AUTHENTICATION_METHOD_SELECTION }),
  logQuitAuthenticationModal: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.QUIT_AUTHENTICATION_MODAL }, { offerId }),
  logQuitFavoriteModalForSignIn: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.QUIT_FAVORITE_MODAL_FOR_SIGN_IN }, { offerId }),
  logQuitIdentityCheck: (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) =>
    analytics.logEvent({ firebase: AnalyticsEvent.QUIT_IDENTITY_CHECK }, { nextStep }),
  logReinitializeFilters: (searchId?: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.REINITIALIZE_FILTERS }, { searchId }),
  logResendEmailResetPasswordExpiredLink: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK,
    }),
  logResendEmailSignupConfirmationExpiredLink: () =>
    analytics.logEvent({
      firebase: AnalyticsEvent.RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK,
    }),
  logResendEmailValidation: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.RESEND_EMAIL_VALIDATION }),
  logSaveNewMail: () => analytics.logEvent({ firebase: AnalyticsEvent.SAVE_NEW_MAIL }),
  logScreenshot: (params: ScreenshotParams) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SCREENSHOT }, params),
  logSearchScrollToPage: (page: number, searchId?: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SEARCH_SCROLL_TO_PAGE }, { page, searchId }),
  logSeeMyBooking: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SEE_MY_BOOKING }, { offerId }),
  logSelectAge: ({ age }: { age: EligibleAges | NonEligible }) =>
    analytics.logEvent(
      {
        firebase: AnalyticsEvent.SELECT_AGE,
      },
      { age }
    ),
  logSelectDeletionReason: (type: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SELECT_DELETION_REASON }, { type }),
  logSendActivationMailAgain: (numberOfTimes: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.SEND_ACTIVATION_MAIL_AGAIN },
      {
        times: numberOfTimes,
      }
    ),
  logShare: (params: ShareParams) => analytics.logEvent({ firebase: AnalyticsEvent.SHARE }, params),
  logShareApp: ({ from, type }: { from?: Referrals; type?: ShareAppModalType }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SHARE_APP }, { from, type }),
  logShowShareAppModal: ({ type }: { type: ShareAppModalType }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SHOW_SHARE_APP_MODAL }, { type }),
  logSignInFromAuthenticationModal: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.SIGN_IN_FROM_AUTHENTICATION_MODAL },
      {
        offerId,
      }
    ),
  logSignInFromFavorite: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.SIGN_IN_FROM_FAVORITE }),
  logSignInFromOffer: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SIGN_IN_FROM_OFFER }, { offerId }),
  logSignUpClicked: ({ from }: { from: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SIGN_UP }, { from }),
  logSignUpFromAuthenticationModal: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.SIGN_UP_FROM_AUTHENTICATION_MODAL },
      {
        offerId,
      }
    ),
  logSignUpFromFavorite: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.SIGN_UP_FROM_FAVORITE }),
  logSignUpFromOffer: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SIGN_UP_FROM_OFFER }, { offerId }),
  logSignUpTooYoung: (age: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SIGN_UP_TOO_YOUNG }, { age }),
  logStartDMSTransmission: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.START_DMS_TRANSMISSION }),
  logStepperDisplayed: (
    from: StepperOrigin,
    step: IdentityCheckStep | PreValidationSignupStep | 'Login',
    type?: SSOType
  ) => analytics.logEvent({ firebase: AnalyticsEvent.STEPPER_DISPLAYED }, { from, step, type }),
  logSubscriptionUpdate: (params: SubscriptionAnalyticsParams) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SUBSCRIPTION_UPDATE }, params),
  logSystemBlockDisplayed: (params: {
    type: 'credit' | 'location' | 'remoteActivationBanner' | 'remoteGenericBanner'
    from: 'home' | 'thematicHome' | 'offer' | 'profile' | 'search' | 'cheatcodes'
  }) => analytics.logEvent({ firebase: AnalyticsEvent.SYSTEM_BLOCK_DISPLAYED }, params),
  logTrendsBlockClicked: (params: {
    moduleId: string
    moduleListID: string
    entryId: string
    toEntryId: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.TRENDS_BLOCK_CLICKED }, params),
  logTrySelectDeposit: (age: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.TRY_SELECT_DEPOSIT }, { age }),
  logUpdateAddress: (params: { newAddress: string; oldAddress: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.UPDATE_ADDRESS }, params),
  logUpdatePostalCode: (params: {
    oldCity: string
    oldPostalCode: string
    newCity: string
    newPostalCode: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.UPDATE_POSTAL_CODE }, params),
  logUpdateStatus: (params: { oldStatus: string; newStatus: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.UPDATE_STATUS }, params),
  logUserSetLocation: (from: 'home' | 'search' | 'venueMap') =>
    analytics.logEvent({ firebase: AnalyticsEvent.USER_SET_LOCATION }, { from }),
  logUserSetVenue: ({ venueLabel }: { venueLabel: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.USER_SET_VENUE }, { venueLabel }),
  logValidateReaction: (params: {
    offerId: number
    reactionType: ReactionTypeEnum
    from: ReactionFromEnum
    userId?: number
  }) => analytics.logEvent({ firebase: AnalyticsEvent.VALIDATE_REACTION }, params),
  logVenueContact: (params: { type: keyof VenueContactModel; venueId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_CONTACT }, params),
  logVenueMapSeenDuration: (duration: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_MAP_SEEN_DURATION }, { duration }),
  logVenueMapSessionDuration: (duration: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_MAP_SESSION_DURATION }, { duration }),
  logVenuePlaylistDisplayedOnSearchResults: ({
    searchId,
    isLocated,
    searchNbResults,
  }: {
    searchId?: string
    isLocated?: boolean
    searchNbResults?: number
  }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.VENUE_PLAYLIST_DISPLAYED_ON_SEARCH_RESULTS },
      { isGeolocated: isLocated, searchId, searchNbResults }
    ),
  logVenueSeeAllOffersClicked: (venueId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_SEE_ALL_OFFERS_CLICKED }, { venueId }),
  logVenueSeeMoreClicked: (venueId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_SEE_MORE_CLICKED }, { venueId }),
  logVideoPaused: (params: {
    videoDuration?: number
    seenDuration: number
    youtubeId?: string
    homeEntryId: string
    moduleId: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.VIDEO_PAUSED }, params),
  logViewItem: (params: PageTrackingInfo & { locationType: LocationMode }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VIEW_ITEM }, params),
  logViewedBookingPage: (params: { from: Referrals; offerId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VIEWED_BOOKING_PAGE }, params),
}
