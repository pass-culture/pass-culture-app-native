import { Platform } from 'react-native'
import { Social } from 'react-native-share'

import { IdentityCheckMethod, VenueContactModel } from 'api/gen'
import { Step, STEP_LABEL } from 'features/bookOffer/context/reducer'
import { CookiesChoiceByCategory } from 'features/cookies/types'
import { FavoriteSortBy } from 'features/favorites/types'
import { DeprecatedIdentityCheckStep, IdentityCheckStep } from 'features/identityCheck/types'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { SearchState } from 'features/search/types'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { ContentTypes } from 'libs/contentful'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { analyticsProvider } from 'libs/firebase/analytics/provider'
import { LoginRoutineMethod, OfferAnalyticsData } from 'libs/firebase/analytics/types'
import { useInit } from 'libs/firebase/analytics/useInit'
import { buildPerformSearchState, urlWithValueMaxLength } from 'libs/firebase/analytics/utils'

type OfferIdOrVenueId = { offerId: number } | { venueId: number }
export type ChangeSearchLocationParam =
  | { type: 'place' | 'everywhere' | 'aroundMe' }
  | { type: 'venue'; venueId: number | null }

type BaseThematicHome = {
  homeEntryId: string
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
type ConsultHomeParams =
  | BaseThematicHome
  | CategoryBlockThematicHome
  | HighlightThematicBlockThematicHome

const logEventAnalytics = {
  logAcceptNotifications: () => analyticsProvider.logEvent(AnalyticsEvent.ACCEPT_NOTIFICATIONS),
  logAccountDeletion: () => analyticsProvider.logEvent(AnalyticsEvent.ACCOUNT_DELETION),
  logAccountReactivation: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.ACCOUNT_REACTIVATION, { from }),
  logActivateGeolocfromSearchResults: () =>
    analyticsProvider.logEvent(AnalyticsEvent.ACTIVATE_GEOLOC_FROM_SEARCH_RESULTS),
  logAllModulesSeen: (numberOfModules: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules }),
  logAllTilesSeen: (moduleName: string, numberOfTiles: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles }),
  logBackToHomeFromEduconnectError: (params: { fromError: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.BACK_TO_HOME_FROM_EDUCONNECT_ERROR, params),
  logBookingConfirmation: (offerId: number, bookingId: number, fromOfferId?: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_CONFIRMATION, {
      offerId,
      bookingId,
      fromOfferId,
    }),
  logBookingDetailsScrolledToBottom: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_DETAILS_SCROLLED_TO_BOTTOM, { offerId }),
  logBookingError: (offerId: number, code: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_ERROR, { offerId, code }),
  logBookingImpossibleiOS: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_IMPOSSIBLE_IOS, { offerId }),
  logBookingOfferConfirmDates: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_OFFER_CONFIRM_DATES, { offerId }),
  logBookingProcessStart: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_PROCESS_START, { offerId }),
  logBookingsScrolledToBottom: () =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKINGS_SCROLLED_TO_BOTTOM),
  logBusinessBlockClicked: (params: {
    moduleName: string
    moduleId: string
    homeEntryId?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, params),
  logCampaignTrackerEnabled: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CAMPAIGN_TRACKER_ENABLED),
  logCancelBooking: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CANCEL_BOOKING, { offerId }),
  logCancelBookingFunnel: (step: Step, offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CANCEL_BOOKING_FUNNEL, {
      step: STEP_LABEL[step],
      offerId,
    }),
  logCancelSignup: (pageName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName }),
  logCategoryBlockClicked: (params: {
    moduleId: string
    moduleListID: string
    entryId: string
    toEntryId: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.CATEGORY_BLOCK_CLICKED, params),
  logChangeSearchLocation: (params: ChangeSearchLocationParam, searchId?: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CHANGE_SEARCH_LOCATION, {
      type: params.type,
      searchId,
      ...(params.type === 'venue' && { venueId: params.venueId }),
    }),
  logChooseEduConnectMethod: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CHOOSE_EDUCONNECT_METHOD),
  logChooseUbbleMethod: () => analyticsProvider.logEvent(AnalyticsEvent.CHOOSE_UBBLE_METHOD),
  logClickBookOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CLICK_BOOK_OFFER, { offerId }),
  logClickSeeMore: (params: { moduleName: string; moduleId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, params),
  logClickSocialNetwork: (network: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CLICK_SOCIAL_NETWORK, { network }),
  logConfirmBookingCancellation: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONFIRM_BOOKING_CANCELLATION, { offerId }),
  logConfirmQuitIdentityCheck: (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_IDENTITY_CHECK, { nextStep }),
  logConsultAccessibility: (params: OfferIdOrVenueId) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES, params),
  logConsultApplicationProcessingModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_APPLICATION_PROCESSING_MODAL, { offerId }),
  logConsultArticleAccountDeletion: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ARTICLE_ACCOUNT_DELETION),
  logConsultAuthenticationModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_AUTHENTICATION_MODAL, { offerId }),
  logConsultAvailableDates: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_AVAILABLE_DATES, { offerId }),
  logConsultDescriptionDetails: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS, { offerId }),
  logConsultDisclaimerValidationMail: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_DISCLAIMER_VALIDATION_MAIL),
  logConsultErrorApplicationModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ERROR_APPLICATION_MODAL, { offerId }),
  logConsultFinishSubscriptionModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_FINISH_SUBSCRIPTION_MODAL, { offerId }),
  logConsultHome: (params: ConsultHomeParams) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_HOME, params),
  logConsultItinerary: (params: OfferIdOrVenueId & { from: Referrals }) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ITINERARY, params),
  logConsultModalBeneficiaryCeilings: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_MODAL_BENEFICIARY_CEILINGS),
  logConsultModalExpiredGrant: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_MODAL_EXPIRED_GRANT),
  logConsultModalNoMoreCredit: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_MODAL_NO_MORE_CREDIT),
  logConsultOffer: (params: {
    offerId: number
    from: Referrals
    moduleId?: string
    moduleName?: string
    query?: string
    venueId?: number
    homeEntryId?: string
    searchId?: string
    fromOfferId?: number
    shouldUseAlgoliaRecommend?: boolean
    playlistType?: PlaylistType
    offer_display_index?: number
  }) => analyticsProvider.logEvent(AnalyticsEvent.CONSULT_OFFER, params),
  logConsultTutorial: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_TUTORIAL, { from }),
  logConsultVenue: (params: {
    venueId: number
    from: Referrals
    moduleName?: string
    moduleId?: string
    homeEntryId?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.CONSULT_VENUE, params),
  logConsultWholeOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_WHOLE_OFFER, { offerId }),
  logConsultWithdrawal: (params: OfferIdOrVenueId) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES, params),
  logContinueCGU: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_CGU),
  logContinueIdentityCheck: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_IDENTITY_CHECK),
  logContinueSetEmail: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SET_EMAIL),
  logContinueSetPassword: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SET_PASSWORD),
  logContinueSetBirthday: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SET_BIRTHDAY),
  logContinueSignup: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SIGNUP),
  logCulturalSurveyScrolledToBottom: (params: { questionId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.CULTURAL_SURVEY_SCROLLED_TO_BOTTOM, params),
  logDiscoverOffers: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.DISCOVER_OFFERS, { from }),
  logDismissNotifications: () => analyticsProvider.logEvent(AnalyticsEvent.DISMISS_NOTIFICATIONS),
  logDismissShareApp: (type: ShareAppModalType) =>
    analyticsProvider.logEvent(AnalyticsEvent.DISMISS_SHARE_APP, { type }),
  logErrorSavingNewEmail: (errorCode: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.ERROR_SAVING_NEW_EMAIL, { code: errorCode }),
  logExclusivityBlockClicked: (params: {
    moduleName: string
    moduleId: string
    homeEntryId?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, params),
  logFavoriteListButtonClicked: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.FAVORITE_LIST_BUTTON_CLICKED, { from }),
  logFavoriteListDisplayed: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.FAVORITE_LIST_DISPLAYED, { from }),
  logGoToParentsFAQ: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.GO_TO_PARENTS_FAQ, { from }),
  logGoToProfil: ({ from, offerId }: { from: string; offerId: number }) =>
    analyticsProvider.logEvent(AnalyticsEvent.GO_TO_PROFIL, {
      from,
      offerId,
    }),
  logHasActivateGeolocFromTutorial: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL),
  logHasAcceptedAllCookies: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_ACCEPTED_ALL_COOKIES),
  logHasAddedOfferToFavorites: (params: {
    offerId: number
    from?: Referrals
    moduleName?: string
    moduleId?: string
    searchId?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES, params),
  logHasAppliedFavoritesSorting: ({ sortBy }: { sortBy: FavoriteSortBy }) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_APPLIED_FAVORITES_SORTING, { type: sortBy }),
  logHasChangedPassword: (reason: 'changePassword' | 'resetPassword') =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_CHANGED_PASSWORD, { reason }),
  logHasClickedMissingCode: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_CLICKED_MISSING_CODE),
  logHasCorrectedEmail: ({ from }: { from: Referrals }) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_CORRECTED_EMAIL, { from }),
  logHasDismissedAppSharingModal: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_DISMISSED_APP_SHARING_MODAL),
  logHasMadeAChoiceForCookies: ({ from, type }: { from: string; type: CookiesChoiceByCategory }) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_MADE_A_CHOICE_FOR_COOKIES, {
      from,
      type: JSON.stringify(type),
    }),
  logHasOpenedCookiesAccordion: (type: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_OPENED_COOKIES_ACCORDION, { type }),
  logHasRefusedCookie: () => analyticsProvider.logEvent(AnalyticsEvent.HAS_REFUSED_COOKIE),
  logHasRequestedCode: () => analyticsProvider.logEvent(AnalyticsEvent.HAS_REQUESTED_CODE),
  logHasSharedApp: (type: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_SHARED_APP, { type }),
  logHasSkippedCulturalSurvey: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_SKIPPED_CULTURAL_SURVEY),
  logHasSkippedTutorial: (pageName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_SKIPPED_TUTORIAL, { pageName }),
  logHasStartedCulturalSurvey: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_STARTED_CULTURAL_SURVEY),
  logHelpCenterContactSignupConfirmationEmailSent: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT),
  logHighlightBlockClicked: (params: { moduleId: string; entryId: string; toEntryId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.HIGHLIGHT_BLOCK_CLICKED, params),
  logIdentityCheckAbort: (params: {
    method: IdentityCheckMethod
    reason: string | null
    errorType: string | null
  }) => analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_ABORT, params),
  logIdentityCheckStep: (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) =>
    analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_STEP, { nextStep }),
  logIdentityCheckSuccess: (params: { method: IdentityCheckMethod }) =>
    analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_SUCCESS, params),
  logLocationToggle: (enabled: boolean) =>
    analyticsProvider.logEvent(AnalyticsEvent.LOCATION_TOGGLE, { enabled }),
  logLogout: () => analyticsProvider.logEvent(AnalyticsEvent.LOGOUT),
  logMailTo: (
    reason:
      | 'forGenericQuestion'
      | 'forSignupConfirmationEmailNotReceived'
      | 'forPhoneNumberConfirmation'
  ) => analyticsProvider.logEvent(AnalyticsEvent.MAIL_TO, { reason }),
  logModifyMail: () => analyticsProvider.logEvent(AnalyticsEvent.MODIFY_MAIL),
  logModuleDisplayedOnHomepage: (
    moduleId: string,
    moduleType: ContentTypes,
    index: number,
    homeEntryId: string | undefined
  ) =>
    analyticsProvider.logEvent(AnalyticsEvent.MODULE_DISPLAYED_ON_HOMEPAGE, {
      moduleId,
      moduleType,
      index,
      homeEntryId,
    }),
  logNoSearchResult: (query: string, searchId?: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.NO_SEARCH_RESULT, { query, searchId }),
  logNotificationToggle: (enableEmail: boolean, enablePush?: boolean) =>
    analyticsProvider.logEvent(AnalyticsEvent.NOTIFICATION_TOGGLE, {
      enableEmail,
      enablePush: Platform.OS === 'android' ? true : enablePush,
    }),
  logOfferSeenDuration: (offerId: number, duration: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration }),
  logOnboardingStarted: () => analyticsProvider.logEvent(AnalyticsEvent.ONBOARDING_STARTED),
  logOpenDMSForeignCitizenURL: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_DMS_FOREIGN_CITIZEN_URL),
  logOpenDMSFrenchCitizenURL: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_DMS_FRENCH_CITIZEN_URL),
  logOpenExternalUrl: (url: string, params: OfferAnalyticsData) =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_EXTERNAL_URL, {
      url: urlWithValueMaxLength(url),
      offerId: params.offerId,
    }),
  logOpenLocationSettings: () => analyticsProvider.logEvent(AnalyticsEvent.OPEN_LOCATION_SETTINGS),
  logOpenNotificationSettings: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS),
  logProfilScrolledToBottom: () =>
    analyticsProvider.logEvent(AnalyticsEvent.PROFIL_SCROLLED_TO_BOTTOM),
  logProfilSignUp: () => analyticsProvider.logEvent(AnalyticsEvent.PROFIL_SIGN_UP),
  logQuitAuthenticationMethodSelection: () =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_AUTHENTICATION_METHOD_SELECTION),
  logQuitAuthenticationModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_AUTHENTICATION_MODAL, { offerId }),
  logQuitFavoriteModalForSignIn: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_FAVORITE_MODAL_FOR_SIGN_IN, { offerId }),
  logQuitIdentityCheck: (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_IDENTITY_CHECK, { nextStep }),
  logReinitializeFilters: (searchId?: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.REINITIALIZE_FILTERS, { searchId }),
  logResendEmailResetPasswordExpiredLink: () =>
    analyticsProvider.logEvent(AnalyticsEvent.RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK),
  logResendEmailSignupConfirmationExpiredLink: () =>
    analyticsProvider.logEvent(AnalyticsEvent.RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK),
  logSaveNewMail: () => analyticsProvider.logEvent(AnalyticsEvent.SAVE_NEW_MAIL),
  logPerformSearch: (searchState: SearchState, nbHits: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.PERFORM_SEARCH, {
      ...buildPerformSearchState(searchState),
      searchNbResults: nbHits,
    }),
  logSearchScrollToPage: (page: number, searchId?: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEARCH_SCROLL_TO_PAGE, { page, searchId }),
  logSeeMyBooking: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEE_MY_BOOKING, { offerId }),
  logSelectAge: (age: number | string) =>
    analyticsProvider.logEvent(AnalyticsEvent.SELECT_AGE, { age }),
  logSendActivationMailAgain: (numberOfTimes: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEND_ACTIVATION_MAIL_AGAIN, { times: numberOfTimes }),
  logShare: (params: {
    type: 'App' | 'Offer' | 'Venue'
    from: Referrals
    id: number
    social?: Social | 'Other'
  }) => analyticsProvider.logEvent(AnalyticsEvent.SHARE, params),
  logShareApp: ({ from, type }: { from?: Referrals; type?: ShareAppModalType }) =>
    analyticsProvider.logEvent(AnalyticsEvent.SHARE_APP, { from, type }),
  logSignInFromAuthenticationModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_IN_FROM_AUTHENTICATION_MODAL, { offerId }),
  logSignInFromFavorite: () => analyticsProvider.logEvent(AnalyticsEvent.SIGN_IN_FROM_FAVORITE),
  logSignInFromOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_IN_FROM_OFFER, { offerId }),
  logSignUp: ({ from }: { from: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP, { from }),
  logSignUpFromAuthenticationModal: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_FROM_AUTHENTICATION_MODAL, { offerId }),
  logSignUpFromFavorite: () => analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_FROM_FAVORITE),
  logSignUpFromOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_FROM_OFFER, { offerId }),
  logSignUpTooYoung: (age: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_TOO_YOUNG, { age }),
  logPlaylistHorizontalScroll: (fromOfferId?: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.PLAYLIST_HORIZONTAL_SCROLL, {
      fromOfferId,
    }),
  logPlaylistVerticalScroll: (params: {
    fromOfferId?: number
    offerId?: number
    playlistType?: PlaylistType
    shouldUseAlgoliaRecommend?: boolean
  }) => analyticsProvider.logEvent(AnalyticsEvent.PLAYLIST_VERTICAL_SCROLL, params),
  logStartDMSTransmission: () => analyticsProvider.logEvent(AnalyticsEvent.START_DMS_TRANSMISSION),
  logTrySelectDeposit: (age: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.TRY_SELECT_DEPOSIT, { age }),
  logVenueContact: (params: { type: keyof VenueContactModel; venueId: number }) =>
    analyticsProvider.logEvent(AnalyticsEvent.VENUE_CONTACT, params),
  logVenueSeeAllOffersClicked: (venueId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.VENUE_SEE_ALL_OFFERS_CLICKED, { venueId }),
  logVenueSeeMoreClicked: (venueId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.VENUE_SEE_MORE_CLICKED, { venueId }),
}

export const analytics = {
  enableCollection: analyticsProvider.enableCollection,
  disableCollection: analyticsProvider.disableCollection,
  getAppInstanceId: analyticsProvider.getAppInstanceId,
  logLogin({ method }: { method: LoginRoutineMethod }) {
    analyticsProvider.logLogin({ method })
  },
  logScreenView: analyticsProvider.logScreenView,
  setDefaultEventParameters: analyticsProvider.setDefaultEventParameters,
  setUserId: analyticsProvider.setUserId,
  useInit,
  ...logEventAnalytics,
}
