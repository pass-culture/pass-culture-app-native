import firebaseAnalyticsModule from '@react-native-firebase/analytics'
import { Platform } from 'react-native'

import { Referrals } from 'features/navigation/RootNavigator'

export const firebaseAnalytics = firebaseAnalyticsModule()

export const STRING_VALUE_MAX_LENGTH = 100

const setUserId = (userId: number) => firebaseAnalytics.setUserId(userId.toString())

// Event names can be up to 40 characters long, may only contain alphanumeric characters and underscores
export enum AnalyticsEvent {
  ACCESS_EXTERNAL_OFFER = 'AccessExternalOffer',
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  BOOKING_CONFIRMATION = 'BookingConfirmation',
  BOOKING_ERROR = 'BookingError',
  BOOKING_IMPOSSIBLE_IOS = 'BookingImpossibleiOS',
  BOOKING_OFFER_CONFIRM_DATES = 'BookOfferConfirmDates',
  BOOKING_PROCESS_START = 'BookingProcessStart',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  BOOKING_DETAILS_SCROLLED_TO_BOTTOM = 'BookingDetailsScrolledToBottom',
  BOOKINGS_SCROLLED_TO_BOTTOM = 'BookingsScrolledToBottom',
  CAMPAIGN_TRACKER_ENABLED = 'CampaignTrackerEnabled',
  CANCEL_BOOKING = 'CancelBooking',
  CANCEL_SIGNUP = 'CancelSignup',
  CLICK_BOOK_OFFER = 'ClickBookOffer',
  CLICK_SOCIAL_NETWORK = 'ClickSocialNetwork',
  CONFIRM_BOOKING_CANCELLATION = 'ConfirmBookingCancellation',
  CONSULT_ACCESSIBILITY_MODALITIES = 'ConsultAccessibilityModalities',
  CONSULT_AVAILABLE_DATES = 'ConsultAvailableDates',
  CONSULT_DESCRIPTION_DETAILS = 'ConsultDescriptionDetails',
  CONSULT_ITINERARY = 'ConsultLocationItinerary',
  CONSULT_OFFER = 'ConsultOffer',
  CONSULT_WHOLE_OFFER = 'ConsultWholeOffer',
  CONSULT_WHY_ANNIVERSARY = 'ConsultModalWhyAnniversary',
  CONSULT_WITHDRAWAL_MODALITIES = 'ConsultWithdrawalModalities',
  HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT = 'HelpCenterContactSignUpConfirmation',
  DISCOVER_OFFERS = 'DiscoverOffers',
  EXCLUSIVITY_BLOCK_CLICKED = 'ExclusivityBlockClicked',
  HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL = 'HasActivateGeolocFromTutorial',
  HAS_ADDED_OFFER_TO_FAVORITES = 'HasAddedOfferToFavorites',
  HAS_APPLIED_FAVORITES_SORTING = 'HasAppliedFavoritesSorting',
  HAS_CHANGED_PASSWORD = 'HasChangedPassword',
  HAS_SKIPPED_TUTORIAL = 'HasSkippedTutorial',
  ID_CHECK = 'IdCheck',
  LOCATION_TOGGLE = 'LocationToggle',
  LOGOUT = 'Logout',
  MAIL_TO = 'MailTo',
  NOTIFICATION_TOGGLE = 'NotificationToggle',
  NO_SEARCH_RESULT = 'NoSearchResult',
  OFFER_SEEN_DURATION = 'OfferSeenDuration',
  OPEN_EXTERNAL_URL = 'OpenExternalURL',
  OPEN_LOCATION_SETTINGS = 'OpenLocationSettings',
  OPEN_NOTIFICATION_SETTINGS = 'OpenNotificationSettings',
  PROFIL_SCROLLED_TO_BOTTOM = 'ProfilScrolledToBottom',
  PROFIL_SIGN_UP = 'ProfilSignUp',
  RECOMMENDATION_MODULE_SEEN = 'RecommendationModuleSeen',
  REINITIALIZE_FILTERS = 'ReinitializeFilters',
  RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK = 'ResendEmailResetPasswordExpiredLink',
  RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK = 'ResendEmailSignupConfirmationExpiredLink',
  SCREEN_VIEW = 'screen_view',
  SEARCH_QUERY = 'SearchQuery',
  SEARCH_SCROLL_TO_PAGE = 'SearchScrollToPage',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  SEE_MY_BOOKING = 'SeeMyBooking',
  SHARE_OFFER = 'Share',
  SIGN_UP_BETWEEN_14_AND_15_INCLUDED = 'SignUpBetween14And15Included',
  SIGN_UP_LESS_THAN_OR_EQUAL_TO_13 = 'SignUpLessThanOrEqualTo13',
  USE_FILTER = 'UseFilter',
  HAS_REFUSED_COOKIE = 'HasRefusedCookie',
}

const logScreenView = async (screenName: string) => {
  // We log an event screen_view so that Firebase knows the screen of the user
  await firebaseAnalytics.logScreenView({ screen_name: screenName, screen_class: screenName })
}

const logEvent = <P extends Record<string, unknown>>(
  name: AnalyticsEvent,
  params?: P
): Promise<void> => {
  if (!params) return firebaseAnalytics.logEvent(name)

  // We don't send integers to firebase because they will be cast into int_value, float_value,
  // or double_value in BigQuery depending on its value. To facilitate the work of the team,
  // we just cast it to string.
  const newParams = Object.keys(params).reduce((acc: Record<string, unknown>, key) => {
    acc[key] = typeof params[key] === 'number' ? (params[key] as number).toString() : params[key]
    return acc
  }, {})

  return firebaseAnalytics.logEvent(name, newParams)
}

/**
 * First Tutorial
 */
const logHasSkippedTutorial = (pageName: string) =>
  logEvent(AnalyticsEvent.HAS_SKIPPED_TUTORIAL, { pageName })

const logHasActivateGeolocFromTutorial = () =>
  logEvent(AnalyticsEvent.HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL)

/**
 * Home
 */
const logAllModulesSeen = (numberOfModules: number) =>
  logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

const logAllTilesSeen = (moduleName: string, numberOfTiles: number) =>
  logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

const logConsultOffer = (params: {
  offerId: number
  from: Referrals
  moduleName?: string
  query?: string
}) => logEvent(AnalyticsEvent.CONSULT_OFFER, params)

const logClickExclusivityBlock = (offerId: number) =>
  logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId })

const logClickSeeMore = (moduleName: string) =>
  logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

const logClickBusinessBlock = (moduleName: string) =>
  logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })

const logRecommendationModuleSeen = (moduleName: string, numberOfTiles: number) =>
  logEvent(AnalyticsEvent.RECOMMENDATION_MODULE_SEEN, {
    moduleName,
    numberOfTiles,
  })

/**
 * Offer
 */
const logConsultAccessibility = (offerId: number) =>
  logEvent(AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES, { offerId })

const logConsultWithdrawal = (offerId: number) =>
  logEvent(AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES, { offerId })

const logShareOffer = (offerId: number) => logEvent(AnalyticsEvent.SHARE_OFFER, { offerId })

const logConsultDescriptionDetails = (offerId: number) =>
  logEvent(AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS, { offerId })

const logConsultWholeOffer = (offerId: number) =>
  logEvent(AnalyticsEvent.CONSULT_WHOLE_OFFER, { offerId })

const logConsultItinerary = (offerId: number, from: Referrals) =>
  logEvent(AnalyticsEvent.CONSULT_ITINERARY, { offerId, from })

const logConsultAvailableDates = (offerId: number) =>
  logEvent(AnalyticsEvent.CONSULT_AVAILABLE_DATES, { offerId })

const logClickBookOffer = (offerId: number) =>
  logEvent(AnalyticsEvent.CLICK_BOOK_OFFER, { offerId })

const logOfferSeenDuration = (offerId: number, duration: number) =>
  logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration })

const logHasAddedOfferToFavorites = (params: {
  from: Referrals | 'BookingImpossible'
  offerId: number
  moduleName?: string
}) => logEvent(AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES, params)

/**
 * Sign up
 */
const logConsultWhyAnniversary = () => logEvent(AnalyticsEvent.CONSULT_WHY_ANNIVERSARY)

const logCancelSignup = (pageName: string) => logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName })

const logHelpCenterContactSignupConfirmationEmailSent = () =>
  logEvent(AnalyticsEvent.HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT)

const logResendEmailResetPasswordExpiredLink = () =>
  logEvent(AnalyticsEvent.RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK)

const logResendEmailSignupConfirmationExpiredLink = () =>
  logEvent(AnalyticsEvent.RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK)

const logSignUpBetween14And15Included = () =>
  logEvent(AnalyticsEvent.SIGN_UP_BETWEEN_14_AND_15_INCLUDED)

const logSignUpLessThanOrEqualTo13 = () => logEvent(AnalyticsEvent.SIGN_UP_LESS_THAN_OR_EQUAL_TO_13)

/**
 * Search
 */
const logReinitializeFilters = () => logEvent(AnalyticsEvent.REINITIALIZE_FILTERS)

const logUseFilter = (filter: string) => logEvent(AnalyticsEvent.USE_FILTER, { filter })

const logSearchQuery = (query: string) => logEvent(AnalyticsEvent.SEARCH_QUERY, { query })

const logSearchScrollToPage = (page: number) =>
  logEvent(AnalyticsEvent.SEARCH_SCROLL_TO_PAGE, { page })

const logNoSearchResult = (query: string) => logEvent(AnalyticsEvent.NO_SEARCH_RESULT, { query })

/**
 * Others
 */
const logOpenLocationSettings = () => logEvent(AnalyticsEvent.OPEN_LOCATION_SETTINGS)

const logOpenNotificationSettings = () => logEvent(AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS)

const logIdCheck = (from: 'Profile') => logEvent(AnalyticsEvent.ID_CHECK, { from })

const logProfilScrolledToBottom = () => logEvent(AnalyticsEvent.PROFIL_SCROLLED_TO_BOTTOM)

const logLocationToggle = (enabled: boolean) =>
  logEvent(AnalyticsEvent.LOCATION_TOGGLE, { enabled })

const logNotificationToggle = (enableEmail: boolean, enablePush?: boolean) =>
  logEvent(AnalyticsEvent.NOTIFICATION_TOGGLE, {
    enableEmail,
    enablePush: Platform.OS === 'android' ? true : enablePush,
  })

const logHasChangedPassword = (reason: 'changePassword' | 'resetPassword') =>
  logEvent(AnalyticsEvent.HAS_CHANGED_PASSWORD, { reason })

const logProfilSignUp = () => logEvent(AnalyticsEvent.PROFIL_SIGN_UP)

const logLogout = () => logEvent(AnalyticsEvent.LOGOUT)

const logHasRefusedCookie = () => logEvent(AnalyticsEvent.HAS_REFUSED_COOKIE)

const logClickSocialNetwork = (network: string) =>
  logEvent(AnalyticsEvent.CLICK_SOCIAL_NETWORK, { network })

const logOpenExternalUrl = (url: string) =>
  logEvent(AnalyticsEvent.OPEN_EXTERNAL_URL, {
    url: url.slice(0, STRING_VALUE_MAX_LENGTH),
  })

const logMailTo = (
  reason:
    | 'forGenericQuestion'
    | 'forSignupConfirmationEmailNotReceived'
    | 'forSignupConfirmationExpiredLink'
    | 'forResetPasswordEmailNotReceived'
    | 'forResetPasswordExpiredLink'
    | 'forAccountDeletion'
    | 'forPhoneNumberConfirmation'
) => logEvent(AnalyticsEvent.MAIL_TO, { reason })

const logCampaignTrackerEnabled = () => logEvent(AnalyticsEvent.CAMPAIGN_TRACKER_ENABLED)

/**
 * Favorites
 */
type FavoriteSortBy = 'ASCENDING_PRICE' | 'AROUND_ME' | 'RECENTLY_ADDED'
const logHasAppliedFavoritesSorting = ({ sortBy }: { sortBy: FavoriteSortBy }) =>
  logEvent(AnalyticsEvent.HAS_APPLIED_FAVORITES_SORTING, { type: sortBy })

/**
 * Tunnel de résa / bookOffer
 */
const logBookingProcessStart = (offerId: number) =>
  logEvent(AnalyticsEvent.BOOKING_PROCESS_START, { offerId })

const logSeeMyBooking = (offerId: number) => logEvent(AnalyticsEvent.SEE_MY_BOOKING, { offerId })

const logBookingOfferConfirmDates = (offerId: number) =>
  logEvent(AnalyticsEvent.BOOKING_OFFER_CONFIRM_DATES, { offerId })

const logBookingImpossibleiOS = (offerId: number) =>
  logEvent(AnalyticsEvent.BOOKING_IMPOSSIBLE_IOS, { offerId })

const logBookingError = (offerId: number, code: string) =>
  logEvent(AnalyticsEvent.BOOKING_ERROR, { offerId, code })

const logBookingConfirmation = (offerId: number, bookingId: number) =>
  logEvent(AnalyticsEvent.BOOKING_CONFIRMATION, { offerId, bookingId })

/**
 * Bookings
 */
const logBookingsScrolledToBottom = () => logEvent(AnalyticsEvent.BOOKINGS_SCROLLED_TO_BOTTOM)

const logBookingDetailsScrolledToBottom = (offerId: number) =>
  logEvent(AnalyticsEvent.BOOKING_DETAILS_SCROLLED_TO_BOTTOM, { offerId })

const logDiscoverOffers = (from: Referrals) => logEvent(AnalyticsEvent.DISCOVER_OFFERS, { from })

const logCancelBooking = (offerId: number) => logEvent(AnalyticsEvent.CANCEL_BOOKING, { offerId })

const logAccessExternalOffer = (offerId: number) =>
  logEvent(AnalyticsEvent.ACCESS_EXTERNAL_OFFER, { offerId })

const logConfirmBookingCancellation = (offerId: number) =>
  logEvent(AnalyticsEvent.CONFIRM_BOOKING_CANCELLATION, { offerId })

export const analytics = {
  logAccessExternalOffer,
  logAllModulesSeen,
  logAllTilesSeen,
  logBookingConfirmation,
  logBookingDetailsScrolledToBottom,
  logBookingError,
  logBookingImpossibleiOS,
  logBookingOfferConfirmDates,
  logBookingProcessStart,
  logBookingsScrolledToBottom,
  logCampaignTrackerEnabled,
  logCancelBooking,
  logCancelSignup,
  logClickBookOffer,
  logClickBusinessBlock,
  logClickExclusivityBlock,
  logClickSeeMore,
  logClickSocialNetwork,
  logConfirmBookingCancellation,
  logConsultAccessibility,
  logConsultAvailableDates,
  logConsultDescriptionDetails,
  logConsultItinerary,
  logConsultOffer,
  logConsultWholeOffer,
  logConsultWhyAnniversary,
  logConsultWithdrawal,
  logDiscoverOffers,
  logLocationToggle,
  logOpenLocationSettings,
  logOpenNotificationSettings,
  logHasActivateGeolocFromTutorial,
  logHasAddedOfferToFavorites,
  logHasAppliedFavoritesSorting,
  logHasChangedPassword,
  logHasSkippedTutorial,
  logHasRefusedCookie,
  logHelpCenterContactSignupConfirmationEmailSent,
  logLogout,
  logMailTo,
  logNoSearchResult,
  logNotificationToggle,
  logOpenExternalUrl,
  logOfferSeenDuration,
  logIdCheck,
  logProfilScrolledToBottom,
  logProfilSignUp,
  logRecommendationModuleSeen,
  logReinitializeFilters,
  logResendEmailResetPasswordExpiredLink,
  logResendEmailSignupConfirmationExpiredLink,
  logScreenView,
  logSearchQuery,
  logSearchScrollToPage,
  logSeeMyBooking,
  logShareOffer,
  logSignUpBetween14And15Included,
  logSignUpLessThanOrEqualTo13,
  logUseFilter,
  setUserId,
}

const RESERVED_PREFIXES = ['firebase_', 'google_', 'ga_']

const FIREBASE_NAME_FORMAT = /^[a-zA-Z][0-9a-zA-Z_]+$/

/* Firebase event naming rules :
https://firebase.google.com/docs/reference/cpp/group/event-names#:~:text=Event%20names%20can%20be%20up,and%20should%20not%20be%20used */
export function validateAnalyticsEvent(eventName: string) {
  if (eventName.length > 40) {
    return false
  }
  for (const reservedKeyword of RESERVED_PREFIXES) {
    if (eventName.startsWith(reservedKeyword)) {
      return false
    }
  }
  if (!eventName.match(FIREBASE_NAME_FORMAT)) {
    return false
  }
  return true
}
