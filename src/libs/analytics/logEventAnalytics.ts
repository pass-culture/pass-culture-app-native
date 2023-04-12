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
import { AmplitudeEvent } from 'libs/amplitude/events'
import {
  analytics,
  ChangeSearchLocationParam,
  ConsultHomeParams,
  OfferAnalyticsData,
  OfferIdOrVenueId,
  buildPerformSearchState,
  urlWithValueMaxLength,
} from 'libs/analytics'
import { ContentTypes } from 'libs/contentful'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export const logEventAnalytics = {
  logAcceptNotifications: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACCEPT_NOTIFICATIONS }),
  logAccountDeletion: () => analytics.logEvent({ firebase: AnalyticsEvent.ACCOUNT_DELETION }),
  logAccountReactivation: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACCOUNT_REACTIVATION }, { from }),
  logActivateGeolocfromSearchResults: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.ACTIVATE_GEOLOC_FROM_SEARCH_RESULTS }),
  logAllModulesSeen: (numberOfModules: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ALL_MODULES_SEEN }, { numberOfModules }),
  logAllTilesSeen: (moduleName: string, numberOfTiles: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.ALL_TILES_SEEN },
      {
        moduleName,
        numberOfTiles,
      }
    ),
  logBackToHomeFromEduconnectError: (params: { fromError: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BACK_TO_HOME_FROM_EDUCONNECT_ERROR }, params),
  logBookingConfirmation: (offerId: number, bookingId: number, fromOfferId?: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.BOOKING_CONFIRMATION },
      {
        offerId,
        bookingId,
        fromOfferId,
      }
    ),
  logBookingDetailsScrolledToBottom: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.BOOKING_DETAILS_SCROLLED_TO_BOTTOM },
      {
        offerId,
      }
    ),
  logBookingError: (offerId: number, code: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_ERROR }, { offerId, code }),
  logBookingImpossibleiOS: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_IMPOSSIBLE_IOS }, { offerId }),
  logBookingOfferConfirmDates: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_OFFER_CONFIRM_DATES }, { offerId }),
  logBookingProcessStart: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.BOOKING_PROCESS_START }, { offerId }),
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
        step: STEP_LABEL[step],
        offerId,
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
  logChangeSearchLocation: (params: ChangeSearchLocationParam, searchId?: string) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.CHANGE_SEARCH_LOCATION },
      {
        type: params.type,
        searchId,
        ...(params.type === 'venue' && { venueId: params.venueId }),
      }
    ),
  logChooseEduConnectMethod: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CHOOSE_EDUCONNECT_METHOD }),
  logChooseUbbleMethod: () => analytics.logEvent({ firebase: AnalyticsEvent.CHOOSE_UBBLE_METHOD }),
  logClickBookOffer: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_BOOK_OFFER }, { offerId }),
  logClickSeeMore: (params: { moduleName: string; moduleId: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SEE_MORE_CLICKED }, params),
  logClickSocialNetwork: (network: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CLICK_SOCIAL_NETWORK }, { network }),
  logConfirmBookingCancellation: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONFIRM_BOOKING_CANCELLATION }, { offerId }),
  logConfirmQuitIdentityCheck: (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) =>
    analytics.logEvent({ firebase: AnalyticsEvent.QUIT_IDENTITY_CHECK }, { nextStep }),
  logConsultAccessibility: (params: OfferIdOrVenueId) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES }, params),
  logConsultApplicationProcessingModal: (offerId: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.CONSULT_APPLICATION_PROCESSING_MODAL },
      {
        offerId,
      }
    ),
  logConsultArticleAccountDeletion: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_ARTICLE_ACCOUNT_DELETION }),
  logConsultAuthenticationModal: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_AUTHENTICATION_MODAL }, { offerId }),
  logConsultAvailableDates: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_AVAILABLE_DATES }, { offerId }),
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
  logConsultModalNoMoreCredit: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_MODAL_NO_MORE_CREDIT }),
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
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, params),
  logConsultTutorial: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_TUTORIAL }, { from }),
  logConsultVenue: (params: {
    venueId: number
    from: Referrals
    moduleName?: string
    moduleId?: string
    homeEntryId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_VENUE }, params),
  logConsultWholeOffer: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_WHOLE_OFFER }, { offerId }),
  logConsultWithdrawal: (params: OfferIdOrVenueId) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES }, params),
  logContinueCGU: () => analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_CGU }),
  logContinueIdentityCheck: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_IDENTITY_CHECK }),
  logContinueSetEmail: () => analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_SET_EMAIL }),
  logContinueSetPassword: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_SET_PASSWORD }),
  logContinueSetBirthday: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_SET_BIRTHDAY }),
  logContinueSignup: () => analytics.logEvent({ firebase: AnalyticsEvent.CONTINUE_SIGNUP }),
  logCulturalSurveyScrolledToBottom: (params: { questionId: string }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.CULTURAL_SURVEY_SCROLLED_TO_BOTTOM }, params),
  logDiscoverOffers: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISCOVER_OFFERS }, { from }),
  logDismissNotifications: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISMISS_NOTIFICATIONS }),
  logDismissShareApp: (type: ShareAppModalType) =>
    analytics.logEvent({ firebase: AnalyticsEvent.DISMISS_SHARE_APP }, { type }),
  logErrorSavingNewEmail: (errorCode: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.ERROR_SAVING_NEW_EMAIL }, { code: errorCode }),
  logExclusivityBlockClicked: (params: {
    moduleName: string
    moduleId: string
    homeEntryId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED }, params),
  logFavoriteListButtonClicked: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.FAVORITE_LIST_BUTTON_CLICKED }, { from }),
  logFavoriteListDisplayed: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.FAVORITE_LIST_DISPLAYED }, { from }),
  logGoToParentsFAQ: (from: Referrals) =>
    analytics.logEvent({ firebase: AnalyticsEvent.GO_TO_PARENTS_FAQ }, { from }),
  logGoToProfil: ({ from, offerId }: { from: string; offerId: number }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.GO_TO_PROFIL },
      {
        from,
        offerId,
      }
    ),
  logHasActivateGeolocFromTutorial: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL }),
  logHasAcceptedAllCookies: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_ACCEPTED_ALL_COOKIES }),
  logHasAddedOfferToFavorites: (params: {
    offerId: number
    from?: Referrals
    moduleName?: string
    moduleId?: string
    searchId?: string
  }) => analytics.logEvent({ firebase: AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES }, params),
  logHasAppliedFavoritesSorting: ({ sortBy }: { sortBy: FavoriteSortBy }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_APPLIED_FAVORITES_SORTING },
      {
        type: sortBy,
      }
    ),
  logHasChangedPassword: (reason: 'changePassword' | 'resetPassword') =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CHANGED_PASSWORD }, { reason }),
  logHasClickedMissingCode: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CLICKED_MISSING_CODE }),
  logHasCorrectedEmail: ({ from }: { from: Referrals }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_CORRECTED_EMAIL }, { from }),
  logHasDismissedAppSharingModal: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_DISMISSED_APP_SHARING_MODAL }),
  logHasMadeAChoiceForCookies: ({ from, type }: { from: string; type: CookiesChoiceByCategory }) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.HAS_MADE_A_CHOICE_FOR_COOKIES },
      {
        from,
        type: JSON.stringify(type),
      }
    ),
  logHasOpenedCookiesAccordion: (type: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.HAS_OPENED_COOKIES_ACCORDION }, { type }),
  logHasRefusedCookie: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_REFUSED_COOKIE }),
  logHasRequestedCode: () => analytics.logEvent({ firebase: AnalyticsEvent.HAS_REQUESTED_CODE }),
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
    analytics.logEvent({ firebase: AnalyticsEvent.IDENTITY_CHECK_STEP }, { nextStep }),
  logIdentityCheckSuccess: (params: { method: IdentityCheckMethod }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.IDENTITY_CHECK_SUCCESS }, params),
  logLocationToggle: (enabled: boolean) =>
    analytics.logEvent({ firebase: AnalyticsEvent.LOCATION_TOGGLE }, { enabled }),
  logLogout: () => analytics.logEvent({ firebase: AnalyticsEvent.LOGOUT }),
  logMailTo: (
    reason:
      | 'forGenericQuestion'
      | 'forSignupConfirmationEmailNotReceived'
      | 'forPhoneNumberConfirmation'
  ) => analytics.logEvent({ firebase: AnalyticsEvent.MAIL_TO }, { reason }),
  logModifyMail: () => analytics.logEvent({ firebase: AnalyticsEvent.MODIFY_MAIL }),
  logModuleDisplayedOnHomepage: (
    moduleId: string,
    moduleType: ContentTypes,
    index: number,
    homeEntryId: string | undefined
  ) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.MODULE_DISPLAYED_ON_HOMEPAGE },
      {
        moduleId,
        moduleType,
        index,
        homeEntryId,
      }
    ),
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
    analytics.logEvent({ firebase: AnalyticsEvent.OFFER_SEEN_DURATION }, { offerId, duration }),
  logOnboardingStarted: () => {
    analytics.logEvent({
      firebase: AnalyticsEvent.ONBOARDING_STARTED,
      amplitude: AmplitudeEvent.ONBOARDING_WELCOME,
    })
  },
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
        url: urlWithValueMaxLength(url),
        offerId: params.offerId,
      }
    ),
  logOpenLocationSettings: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_LOCATION_SETTINGS }),
  logOpenNotificationSettings: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS }),
  logProfilScrolledToBottom: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.PROFIL_SCROLLED_TO_BOTTOM }),
  logProfilSignUp: () => analytics.logEvent({ firebase: AnalyticsEvent.PROFIL_SIGN_UP }),
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
  logSaveNewMail: () => analytics.logEvent({ firebase: AnalyticsEvent.SAVE_NEW_MAIL }),
  logPerformSearch: (searchState: SearchState, nbHits: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.PERFORM_SEARCH },
      {
        ...buildPerformSearchState(searchState),
        searchNbResults: nbHits,
      }
    ),
  logSearchScrollToPage: (page: number, searchId?: string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SEARCH_SCROLL_TO_PAGE }, { page, searchId }),
  logSeeMyBooking: (offerId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SEE_MY_BOOKING }, { offerId }),
  logSelectAge: (age: number | string) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SELECT_AGE }, { age }),
  logSendActivationMailAgain: (numberOfTimes: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.SEND_ACTIVATION_MAIL_AGAIN },
      {
        times: numberOfTimes,
      }
    ),
  logShare: (params: {
    type: 'App' | 'Offer' | 'Venue'
    from: Referrals
    id: number
    social?: Social | 'Other'
  }) => analytics.logEvent({ firebase: AnalyticsEvent.SHARE }, params),
  logShareApp: ({ from, type }: { from?: Referrals; type?: ShareAppModalType }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.SHARE_APP }, { from, type }),
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
  logSignUp: ({ from }: { from: string }) =>
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
  logPlaylistHorizontalScroll: (fromOfferId?: number) =>
    analytics.logEvent(
      { firebase: AnalyticsEvent.PLAYLIST_HORIZONTAL_SCROLL },
      {
        fromOfferId,
      }
    ),
  logPlaylistVerticalScroll: (params: {
    fromOfferId?: number
    offerId?: number
    playlistType?: PlaylistType
    shouldUseAlgoliaRecommend?: boolean
  }) => analytics.logEvent({ firebase: AnalyticsEvent.PLAYLIST_VERTICAL_SCROLL }, params),
  logStartDMSTransmission: () =>
    analytics.logEvent({ firebase: AnalyticsEvent.START_DMS_TRANSMISSION }),
  logTrySelectDeposit: (age: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.TRY_SELECT_DEPOSIT }, { age }),
  logVenueContact: (params: { type: keyof VenueContactModel; venueId: number }) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_CONTACT }, params),
  logVenueSeeAllOffersClicked: (venueId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_SEE_ALL_OFFERS_CLICKED }, { venueId }),
  logVenueSeeMoreClicked: (venueId: number) =>
    analytics.logEvent({ firebase: AnalyticsEvent.VENUE_SEE_MORE_CLICKED }, { venueId }),
}
