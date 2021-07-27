import { IdCheckAnalyticsInterface } from '@pass-culture/id-check'
import { Platform } from 'react-native'

import { Referrals } from 'features/navigation/RootNavigator'

import { AnalyticsEvent, IdCheckAnalyticsEvent } from './events'

const firebaseAnalytics = {
  logScreenView: console.log, // eslint-disable-line no-console
  logLogin: console.log, // eslint-disable-line no-console
  logEvent: (...arg: any[]) => Promise.resolve(console.log(arg)), // eslint-disable-line no-console
  setUserId: console.log, // eslint-disable-line no-console
  setAnalyticsCollectionEnabled: console.log, // eslint-disable-line no-console
}

const STRING_VALUE_MAX_LENGTH = 100

const setUserId = (userId: number) => firebaseAnalytics.setUserId(userId.toString())

const logScreenView = async (screenName: string) => {
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
  disableCollection: () => firebaseAnalytics.setAnalyticsCollectionEnabled(false),
  enableCollection: () => firebaseAnalytics.setAnalyticsCollectionEnabled(true),
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
  logHasActivateGeolocFromTutorial,
  logHasAddedOfferToFavorites,
  logHasAppliedFavoritesSorting,
  logHasChangedPassword,
  logHasRefusedCookie,
  logHasSkippedTutorial,
  logHelpCenterContactSignupConfirmationEmailSent,
  logIdCheck,
  logLocationToggle,
  logLogin: firebaseAnalytics.logLogin,
  logLogout,
  logMailTo,
  logNoSearchResult,
  logNotificationToggle,
  logOfferSeenDuration,
  logOpenExternalUrl,
  logOpenLocationSettings,
  logOpenNotificationSettings,
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

export const idCheckAnalytics: IdCheckAnalyticsInterface = {
  cancelSignUp({ pageName }: { pageName: string }) {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.CANCEL_SIGN_UP, {
      pageName,
    })
  },
  identityError() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.IDENTITY_ERROR)
  },
  idValid() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.ID_VALID)
  },
  invalidAge() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.INVALID_AGE)
  },
  invalidDate() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.INVALID_DATE)
  },
  invalidDocument() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.INVALID_DOCUMENT)
  },
  invalidTwice() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.INVALID_TWICE)
  },
  processCompleted() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.PROCESS_COMPLETED)
  },
  wrongSideDocument() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.WRONG_SIDE_DOCUMENT)
  },
  missingDocument() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.MISSING_DOCUMENT)
  },
  externalLink({ href, canOpen }: { href: string; canOpen?: boolean }) {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.EXTERNAL_LINK, {
      href: href.slice(0, STRING_VALUE_MAX_LENGTH),
      canOpen: canOpen ? 'true' : 'false',
    })
  },
  hasValidSession({
    valid,
    accessToken,
    accessTokenExpiresAt,
  }: {
    valid: boolean
    accessToken: string | undefined
    accessTokenExpiresAt: string | undefined
  }) {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.HAS_VALID_SESSION, {
      valid,
      accessToken,
      accessTokenExpiresAt,
    })
  },
  startCheckTokens() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.START_CHECK_TOKENS)
  },
  endCheckTokens() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.END_CHECK_TOKENS)
  },
  fileSizeExceeded() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.FILE_SIZE_EXCEEDED)
  },
  permissionsBlocked() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.PERMISSION_BLOCKED)
  },
  cameraUnavailable() {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.CALMERA_UNAVAILABLE)
  },
  getJouveToken({
    appIsAllowedToRenewLicenceToken,
    isLocalLicenceToken,
    licenceToken,
    licenceTokenExpirationTimestamp,
    success,
    accessToken,
    accessTokenExpiresAt,
  }: {
    appIsAllowedToRenewLicenceToken: boolean
    isLocalLicenceToken: boolean
    licenceToken: string
    licenceTokenExpirationTimestamp: string | null | undefined
    success: boolean
    accessToken: string | undefined
    accessTokenExpiresAt: string | undefined
  }) {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.GET_JOUVE_TOKEN, {
      appIsAllowedToRenewLicenceToken,
      isLocalLicenceToken,
      licenceToken,
      licenceTokenExpirationTimestamp,
      success,
      accessToken,
      accessTokenExpiresAt,
    })
  },
  getLicenceToken({
    isError,
    errorCode,
    licenceToken,
    licenceTokenExpirationTimestamp,
  }: {
    isError: boolean
    errorCode: string | undefined
    licenceToken: string | null | undefined
    licenceTokenExpirationTimestamp: string | null | undefined
  }) {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.GET_LICENCE_TOKEN, {
      isError,
      errorCode,
      licenceToken,
      licenceTokenExpirationTimestamp,
    })
  },
  idDocumentAcquisitionType(type: 'Camera' | 'ImageLibrary') {
    firebaseAnalytics.logEvent(IdCheckAnalyticsEvent.ID_DOCUMENT_ACQUISITION_TYPE, { type })
  },
}
