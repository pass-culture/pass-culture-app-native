import { Platform } from 'react-native'

import { IdentityCheckMethod, VenueContactModel } from 'api/gen'
import { CookiesChoiceByCategory } from 'features/cookies/useCookiesChoiceByCategory'
import { ContentTypes } from 'features/home/contentful'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { Referrals } from 'features/navigation/RootNavigator'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { analyticsProvider } from 'libs/firebase/analytics/provider'
import { LoginRoutineMethod, OfferAnalyticsData } from 'libs/firebase/analytics/types'
import { useInit } from 'libs/firebase/analytics/useInit'
import { urlWithValueMaxLength } from 'libs/firebase/analytics/utils'

type FavoriteSortBy = 'ASCENDING_PRICE' | 'AROUND_ME' | 'RECENTLY_ADDED'
type OfferIdOrVenueId = { offerId: number } | { venueId: number }
export type ChangeSearchLocationParam =
  | { type: 'place' | 'everywhere' | 'aroundMe' }
  | { type: 'venue'; venueId: number | null }

export const analytics = {
  enableCollection: analyticsProvider.enableCollection,
  disableCollection: analyticsProvider.disableCollection,
  setDefaultEventParameters: analyticsProvider.setDefaultEventParameters,
  setUserId: analyticsProvider.setUserId,
  logLogin({ method }: { method: LoginRoutineMethod }) {
    analyticsProvider.logLogin({ method })
  },
  logScreenView: analyticsProvider.logScreenView,
  logHasSkippedTutorial: (pageName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_SKIPPED_TUTORIAL, { pageName }),
  logHasActivateGeolocFromTutorial: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL),
  logAllModulesSeen: (numberOfModules: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules }),
  logAllTilesSeen: (moduleName: string, numberOfTiles: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles }),
  logBackToHomeFromEduconnectError: (params: { fromError: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.BACK_TO_HOME_FROM_EDUCONNECT_ERROR, params),
  logConsultTutorial: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_TUTORIAL, { from }),
  logConsultHome: (params: { entryId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_HOME, params),
  logConsultOffer: (params: {
    offerId: number
    from: Referrals
    moduleId?: string
    moduleName?: string
    query?: string
    venueId?: number
  }) => analyticsProvider.logEvent(AnalyticsEvent.CONSULT_OFFER, params),
  logConsultVenue: (params: {
    venueId: number
    from: Referrals
    moduleName?: string
    moduleId?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.CONSULT_VENUE, params),
  logClickExclusivityBlock: (params: { moduleName: string; moduleId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, params),
  logClickSeeMore: (params: { moduleName: string; moduleId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, params),
  logClickBusinessBlock: (params: { moduleName: string; moduleId: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, params),
  logConsultAccessibility: (params: OfferIdOrVenueId) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES, params),
  logConsultWithdrawal: (params: OfferIdOrVenueId) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES, params),
  logShareOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SHARE_OFFER, { offerId }),
  logShareVenue: (venueId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SHARE_VENUE, { venueId }),
  logConsultDescriptionDetails: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS, { offerId }),
  logConsultWholeOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_WHOLE_OFFER, { offerId }),
  logConsultItinerary: (params: OfferIdOrVenueId & { from: Referrals }) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ITINERARY, params),
  logConsultAvailableDates: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_AVAILABLE_DATES, { offerId }),
  logClickBookOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CLICK_BOOK_OFFER, { offerId }),
  logIdentityCheckStep: (nextStep: IdentityCheckStep) =>
    analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_STEP, { nextStep }),
  logQuitIdentityCheck: (nextStep: IdentityCheckStep) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_IDENTITY_CHECK, { nextStep }),
  logConfirmQuitIdentityCheck: (nextStep: IdentityCheckStep) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_IDENTITY_CHECK, { nextStep }),
  logContinueIdentityCheck: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_IDENTITY_CHECK),
  logIdentityCheckAbort: (params: {
    method: IdentityCheckMethod
    reason: string | null
    errorType: string | null
  }) => analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_ABORT, params),
  logIdentityCheckSuccess: (params: { method: IdentityCheckMethod }) =>
    analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_SUCCESS, params),
  logStartDMSTransmission: () => analyticsProvider.logEvent(AnalyticsEvent.START_DMS_TRANSMISSION),
  logOfferSeenDuration: (offerId: number, duration: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration }),
  logHasAddedOfferToFavorites: (params: {
    offerId: number
    from?: Referrals
    moduleName?: string
    moduleId?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES, params),
  logContinueSetEmail: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SET_EMAIL),
  logContinueSetPassword: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SET_PASSWORD),
  logContinueSetBirthday: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SET_BIRTHDAY),
  logContinueCGU: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_CGU),
  logConsultWhyAnniversary: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_WHY_ANNIVERSARY),
  logCancelSignup: (pageName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName }),
  logContinueSignup: () => analyticsProvider.logEvent(AnalyticsEvent.CONTINUE_SIGNUP),
  logHelpCenterContactSignupConfirmationEmailSent: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT),
  logResendEmailResetPasswordExpiredLink: () =>
    analyticsProvider.logEvent(AnalyticsEvent.RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK),
  logResendEmailSignupConfirmationExpiredLink: () =>
    analyticsProvider.logEvent(AnalyticsEvent.RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK),
  logSignInFromFavorite: () => analyticsProvider.logEvent(AnalyticsEvent.SIGN_IN_FROM_FAVORITE),
  logSignInFromOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_IN_FROM_OFFER, { offerId }),
  logSignUpFromFavorite: () => analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_FROM_FAVORITE),
  logSignUpFromOffer: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_FROM_OFFER, { offerId }),
  logSignUpTooYoung: (age: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_TOO_YOUNG, { age }),
  logQuitFavoriteModalForSignIn: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_FAVORITE_MODAL_FOR_SIGN_IN, { offerId }),
  logReinitializeFilters: () => analyticsProvider.logEvent(AnalyticsEvent.REINITIALIZE_FILTERS),
  logUseFilter: (filter: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.USE_FILTER, { filter }),
  logUseLandingCategory: (categoryName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.USE_LANDING_CATEGORY, { categoryName }),
  logSearchQuery: (query: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEARCH_QUERY, { query }),
  logSearchScrollToPage: (page: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEARCH_SCROLL_TO_PAGE, { page }),
  logNoSearchResult: (query: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.NO_SEARCH_RESULT, { query }),
  logOpenDMSForeignCitizenURL: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_DMS_FOREIGN_CITIZEN_URL),
  logOpenDMSFrenchCitizenURL: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_DMS_FRENCH_CITIZEN_URL),
  logOpenLocationSettings: () => analyticsProvider.logEvent(AnalyticsEvent.OPEN_LOCATION_SETTINGS),
  logOpenNotificationSettings: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS),
  logProfilScrolledToBottom: () =>
    analyticsProvider.logEvent(AnalyticsEvent.PROFIL_SCROLLED_TO_BOTTOM),
  logLocationToggle: (enabled: boolean) =>
    analyticsProvider.logEvent(AnalyticsEvent.LOCATION_TOGGLE, { enabled }),
  logNotificationToggle: (enableEmail: boolean, enablePush?: boolean) =>
    analyticsProvider.logEvent(AnalyticsEvent.NOTIFICATION_TOGGLE, {
      enableEmail,
      enablePush: Platform.OS === 'android' ? true : enablePush,
    }),
  logHasChangedPassword: (reason: 'changePassword' | 'resetPassword') =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_CHANGED_PASSWORD, { reason }),
  logProfilSignUp: () => analyticsProvider.logEvent(AnalyticsEvent.PROFIL_SIGN_UP),
  logLogout: () => analyticsProvider.logEvent(AnalyticsEvent.LOGOUT),
  logHasAcceptedAllCookies: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_ACCEPTED_ALL_COOKIES),
  logHasMadeAChoiceForCookies: (params: { from: string; type: CookiesChoiceByCategory }) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_MADE_A_CHOICE_FOR_COOKIES, params),
  logHasOpenedCookiesAccordion: (type: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_OPENED_COOKIES_ACCORDION, { type }),
  logHasRefusedCookie: () => analyticsProvider.logEvent(AnalyticsEvent.HAS_REFUSED_COOKIE),
  logClickSocialNetwork: (network: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CLICK_SOCIAL_NETWORK, { network }),
  logOpenExternalUrl: (url: string, params: OfferAnalyticsData) =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_EXTERNAL_URL, {
      url: urlWithValueMaxLength(url),
      offerId: params.offerId,
    }),
  logMailTo: (
    reason:
      | 'forGenericQuestion'
      | 'forSignupConfirmationEmailNotReceived'
      | 'forPhoneNumberConfirmation'
  ) => analyticsProvider.logEvent(AnalyticsEvent.MAIL_TO, { reason }),
  logCampaignTrackerEnabled: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CAMPAIGN_TRACKER_ENABLED),
  logHasAppliedFavoritesSorting: ({ sortBy }: { sortBy: FavoriteSortBy }) =>
    analyticsProvider.logEvent(AnalyticsEvent.HAS_APPLIED_FAVORITES_SORTING, { type: sortBy }),
  logBookingProcessStart: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_PROCESS_START, { offerId }),
  logSeeMyBooking: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEE_MY_BOOKING, { offerId }),
  logBookingOfferConfirmDates: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_OFFER_CONFIRM_DATES, { offerId }),
  logBookingImpossibleiOS: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_IMPOSSIBLE_IOS, { offerId }),
  logBookingError: (offerId: number, code: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_ERROR, { offerId, code }),
  logBookingConfirmation: (offerId: number, bookingId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_CONFIRMATION, { offerId, bookingId }),
  logBookingsScrolledToBottom: () =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKINGS_SCROLLED_TO_BOTTOM),
  logBookingDetailsScrolledToBottom: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.BOOKING_DETAILS_SCROLLED_TO_BOTTOM, { offerId }),
  logDiscoverOffers: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.DISCOVER_OFFERS, { from }),
  logCancelBooking: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CANCEL_BOOKING, { offerId }),
  logConfirmBookingCancellation: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONFIRM_BOOKING_CANCELLATION, { offerId }),
  logVenueContact: (params: { type: keyof VenueContactModel; venueId: number }) =>
    analyticsProvider.logEvent(AnalyticsEvent.VENUE_CONTACT, params),
  logVenueSeeAllOffersClicked: (venueId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.VENUE_SEE_ALL_OFFERS_CLICKED, { venueId }),
  logVenueSeeMoreClicked: (venueId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.VENUE_SEE_MORE_CLICKED, { venueId }),
  logChangeSearchLocation: (params: ChangeSearchLocationParam) =>
    analyticsProvider.logEvent(AnalyticsEvent.CHANGE_SEARCH_LOCATION, params),
  logSaveNewMail: () => analyticsProvider.logEvent(AnalyticsEvent.SAVE_NEW_MAIL),
  logModifyMail: () => analyticsProvider.logEvent(AnalyticsEvent.MODIFY_MAIL),
  logSendActivationMailAgain: (numberOfTimes: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEND_ACTIVATION_MAIL_AGAIN, { times: numberOfTimes }),
  logErrorSavingNewEmail: (errorCode: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.ERROR_SAVING_NEW_EMAIL, { code: errorCode }),
  logConsultDisclaimerValidationMail: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_DISCLAIMER_VALIDATION_MAIL),
  logConsultModalBeneficiaryCeilings: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_MODAL_BENEFICIARY_CEILINGS),
  logConsultModalExpiredGrant: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_MODAL_EXPIRED_GRANT),
  logConsultModalNoMoreCredit: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_MODAL_NO_MORE_CREDIT),
  logChooseEduConnectMethod: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CHOOSE_EDUCONNECT_METHOD),
  logChooseUbbleMethod: () => analyticsProvider.logEvent(AnalyticsEvent.CHOOSE_UBBLE_METHOD),
  logQuitAuthenticationMethodSelection: () =>
    analyticsProvider.logEvent(AnalyticsEvent.QUIT_AUTHENTICATION_METHOD_SELECTION),
  logAccountDeletion: () => analyticsProvider.logEvent(AnalyticsEvent.ACCOUNT_DELETION),
  logAccountReactivation: (from: Referrals) =>
    analyticsProvider.logEvent(AnalyticsEvent.ACCOUNT_REACTIVATION, { from }),
  logConsultArticleAccountDeletion: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_ARTICLE_ACCOUNT_DELETION),
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
  useInit,
}
