import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const firebaseAnalytics = firebaseAnalyticsModule()

// Event names can be up to 40 characters long, may only contain alphanumeric characters and underscores
export enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  CANCEL_SIGNUP = 'CancelSignup',
  CLICK_BOOK_OFFER = 'ClickBookOffer',
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
  EXCLUSIVITY_BLOCK_CLICKED = 'ExclusivityBlockClicked',
  NO_SEARCH_RESULT = 'NoSearchResult',
  OFFER_SEEN_DURATION = 'OfferSeenDuration',
  RECOMMENDATION_MODULE_SEEN = 'RecommendationModuleSeen',
  REINITIALIZE_FILTERS = 'ReinitializeFilters',
  RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK = 'ResendEmailResetPasswordExpiredLink',
  RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK = 'ResendEmailSignupConfirmationExpiredLink',
  SCREEN_VIEW = 'screen_view',
  SEARCH_SCROLL_TO_PAGE = 'SearchScrollToPage',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  SHARE_OFFER = 'Share',
  SIGN_UP_BETWEEN_14_AND_15_INCLUDED = 'SignUpBetween14And15Included',
  SIGN_UP_LESS_THAN_OR_EQUAL_TO_13 = 'SignUpLessThanOrEqualTo13',
  USE_FILTER = 'UseFilter',
  SEARCH_QUERY = 'SearchQuery',
  HAS_SKIPPED_TUTORIAL = 'HasSkippedTutorial',
  HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL = 'HasActivateGeolocFromTutorial',
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
  from: 'SEARCH' | 'HOME'
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

export const analytics = {
  logHasSkippedTutorial,
  logHasActivateGeolocFromTutorial,
  logAllModulesSeen,
  logAllTilesSeen,
  logCancelSignup,
  logClickBookOffer,
  logClickBusinessBlock,
  logClickExclusivityBlock,
  logClickSeeMore,
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
  logNoSearchResult,
  logOfferSeenDuration,
  logRecommendationModuleSeen,
  logReinitializeFilters,
  logResendEmailResetPasswordExpiredLink,
  logResendEmailSignupConfirmationExpiredLink,
  logScreenView,
  logSearchScrollToPage,
  logShareOffer,
  logSignUpBetween14And15Included,
  logSignUpLessThanOrEqualTo13,
  logUseFilter,
  logSearchQuery,
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
