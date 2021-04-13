import firebaseAnalyticsModule from '@react-native-firebase/analytics'
import { Platform } from 'react-native'

import { Referrals } from 'features/navigation/RootNavigator'

export const firebaseAnalytics = firebaseAnalyticsModule()

export const STRING_VALUE_MAX_LENGTH = 100

const setUserId = (userId: number) => firebaseAnalytics.setUserId(userId.toString())

// Event names can be up to 40 characters long, may only contain alphanumeric characters and underscores
export enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  BOOKING_ERROR = 'BookingError',
  BOOKING_IMPOSSIBLE_IOS = 'BookingImpossibleiOS',
  BOOKING_OFFER_CONFIRM_DATES = 'BookOfferConfirmDates',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  BOOKINGS_SCROLLED_TO_BOTTOM = 'BookingsScrolledToBottom',
  CANCEL_BOOKING = 'CancelBooking',
  CANCEL_SIGNUP = 'CancelSignup',
  CLICK_BOOK_OFFER = 'ClickBookOffer',
  CLICK_SOCIAL_NETWORK = 'ClickSocialNetwork',
  CONSULT_ACCESSIBILITY_MODALITIES = 'ConsultAccessibilityModalities',
  CONSULT_AVAILABLE_DATES = 'ConsultAvailableDates',
  CONSULT_DESCRIPTION_DETAILS = 'ConsultDescriptionDetails',
  CONSULT_ITINERARY = 'ConsultLocationItinerary',
  CONSULT_OFFER = 'ConsultOffer',
  CONSULT_WHOLE_OFFER = 'ConsultWholeOffer',
  CONSULT_WHY_ANNIVERSARY = 'ConsultModalWhyAnniversary',
  CONSULT_WITHDRAWAL_MODALITIES = 'ConsultWithdrawalModalities',
  CONTACT_SUPPORT_RESET_PASSWORD_EMAIL_SENT = 'ContactSupportResetPassword',
  CONTACT_SUPPORT_SIGNUP_CONFIRMATION_EMAIL_SENT = 'ContactSupportSignupConfirmation',
  DEEPLINK_CONSULT_OFFER = 'DeeplinkConsultOffer',
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
}

const logScreenView = async (screenName: string) => {
  // 1. We log an event screen_view so that Firebase knows the screen of the user
  await firebaseAnalytics.logScreenView({ screen_name: screenName, screen_class: screenName })
  // 2. We also log an event screen_view_<screen> to help with funnels.
  // See https://blog.theodo.com/2018/01/building-google-analytics-funnel-firebase-react-native/
  await firebaseAnalytics.logEvent(`${AnalyticsEvent.SCREEN_VIEW}_${screenName.toLowerCase()}`)
}

/**
 * First Tutorial
 */
const logHasSkippedTutorial = (pageName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.HAS_SKIPPED_TUTORIAL, { pageName })

const logHasActivateGeolocFromTutorial = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL)

/**
 * Home
 */
const logAllModulesSeen = (numberOfModules: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

const logAllTilesSeen = (moduleName: string, numberOfTiles: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

const logConsultOffer = (params: {
  offerId: number
  from: Referrals
  moduleName?: string
  query?: string
}) => firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_OFFER, params)

const logClickExclusivityBlock = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId })

const logClickSeeMore = (moduleName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

const logClickBusinessBlock = (moduleName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })

const logRecommendationModuleSeen = (moduleName: string, numberOfTiles: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.RECOMMENDATION_MODULE_SEEN, {
    moduleName,
    numberOfTiles,
  })

/**
 * Offer
 */
const logConsultOfferFromDeeplink = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.DEEPLINK_CONSULT_OFFER, { offerId })

const logConsultAccessibility = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES, { offerId })

const logConsultWithdrawal = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES, { offerId })

const logShareOffer = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SHARE_OFFER, { offerId })

const logConsultDescriptionDetails = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS, { offerId })

const logConsultWholeOffer = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_WHOLE_OFFER, { offerId })

const logConsultItinerary = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_ITINERARY, { offerId })

const logConsultAvailableDates = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_AVAILABLE_DATES, { offerId })

const logClickBookOffer = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CLICK_BOOK_OFFER, { offerId })

const logOfferSeenDuration = (offerId: number, duration: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration })

const logHasAddedOfferToFavorites = (params: {
  from: Referrals | 'BookingImpossible'
  offerId: number
  moduleName?: string
}) => firebaseAnalytics.logEvent(AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES, params)

/**
 * Sign up
 */
const logConsultWhyAnniversary = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_WHY_ANNIVERSARY)

const logCancelSignup = (pageName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName })

const logContactSupportResetPasswordEmailSent = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONTACT_SUPPORT_RESET_PASSWORD_EMAIL_SENT)

const logContactSupportSignupConfirmationEmailSent = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONTACT_SUPPORT_SIGNUP_CONFIRMATION_EMAIL_SENT)

const logResendEmailResetPasswordExpiredLink = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK)

const logResendEmailSignupConfirmationExpiredLink = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK)

const logSignUpBetween14And15Included = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SIGN_UP_BETWEEN_14_AND_15_INCLUDED)

const logSignUpLessThanOrEqualTo13 = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SIGN_UP_LESS_THAN_OR_EQUAL_TO_13)

/**
 * Search
 */
const logReinitializeFilters = () => firebaseAnalytics.logEvent(AnalyticsEvent.REINITIALIZE_FILTERS)

const logUseFilter = (filter: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.USE_FILTER, { filter })

const logSearchQuery = (query: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SEARCH_QUERY, { query })

const logSearchScrollToPage = (page: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SEARCH_SCROLL_TO_PAGE, { page })

const logNoSearchResult = (query: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.NO_SEARCH_RESULT, { query })

/**
 * Others
 */
const logOpenLocationSettings = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.OPEN_LOCATION_SETTINGS)

const logOpenNotificationSettings = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS)

const logIdCheck = (from: 'Profile') =>
  firebaseAnalytics.logEvent(AnalyticsEvent.ID_CHECK, { from })

const logProfilScrolledToBottom = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.PROFIL_SCROLLED_TO_BOTTOM)

const logLocationToggle = (enabled: boolean) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.LOCATION_TOGGLE, { enabled })

const logNotificationToggle = (enableEmail: boolean, enablePush?: boolean) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.NOTIFICATION_TOGGLE, {
    enableEmail,
    enablePush: Platform.OS === 'android' ? true : enablePush,
  })

const logHasChangedPassword = (reason: 'changePassword' | 'resetPassword') =>
  firebaseAnalytics.logEvent(AnalyticsEvent.HAS_CHANGED_PASSWORD, { reason })

const logProfilSignUp = () => firebaseAnalytics.logEvent(AnalyticsEvent.PROFIL_SIGN_UP)

const logLogout = () => firebaseAnalytics.logEvent(AnalyticsEvent.LOGOUT)

const logClickSocialNetwork = (network: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CLICK_SOCIAL_NETWORK, { network })

const logOpenExternalUrl = (url: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.OPEN_EXTERNAL_URL, {
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
) => firebaseAnalytics.logEvent(AnalyticsEvent.MAIL_TO, { reason })

/**
 * Favorites
 */
type FavoriteSortBy = 'ASCENDING_PRICE' | 'AROUND_ME' | 'RECENTLY_ADDED'
const logHasAppliedFavoritesSorting = ({ sortBy }: { sortBy: FavoriteSortBy }) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.HAS_APPLIED_FAVORITES_SORTING, { type: sortBy })

/**
 * Tunnel de résa / bookOffer
 */
const logSeeMyBooking = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SEE_MY_BOOKING, { offerId })

const logBookingOfferConfirmDates = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.BOOKING_OFFER_CONFIRM_DATES, { offerId })

const logBookingImpossibleiOS = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.BOOKING_IMPOSSIBLE_IOS, { offerId })

const logBookingError = (offerId: number, code: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.BOOKING_ERROR, { offerId, code })

/**
 * Bookings
 */
const logBookingsScrolledToBottom = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.BOOKINGS_SCROLLED_TO_BOTTOM)

const logDiscoverOffers = (from: Referrals) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.DISCOVER_OFFERS, { from })

const logCancelBooking = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CANCEL_BOOKING, { offerId })

export const analytics = {
  logAllModulesSeen,
  logAllTilesSeen,
  logBookingError,
  logBookingImpossibleiOS,
  logBookingOfferConfirmDates,
  logBookingsScrolledToBottom,
  logCancelBooking,
  logCancelSignup,
  logClickBookOffer,
  logClickBusinessBlock,
  logClickExclusivityBlock,
  logClickSeeMore,
  logClickSocialNetwork,
  logConsultAccessibility,
  logConsultAvailableDates,
  logConsultDescriptionDetails,
  logConsultItinerary,
  logConsultOffer,
  logConsultOfferFromDeeplink,
  logConsultWholeOffer,
  logConsultWhyAnniversary,
  logConsultWithdrawal,
  logContactSupportResetPasswordEmailSent,
  logContactSupportSignupConfirmationEmailSent,
  logDiscoverOffers,
  logLocationToggle,
  logOpenLocationSettings,
  logOpenNotificationSettings,
  logHasActivateGeolocFromTutorial,
  logHasAddedOfferToFavorites,
  logHasAppliedFavoritesSorting,
  logHasChangedPassword,
  logHasSkippedTutorial,
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
