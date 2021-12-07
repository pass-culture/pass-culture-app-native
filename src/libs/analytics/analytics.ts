import { IdCheckAnalyticsInterface } from '@pass-culture/id-check'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { IdentityCheckMethod, VenueContactModel } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator'
import { useUtmParams } from 'libs/utm'

import { AnalyticsEvent, IdCheckAnalyticsEvent } from './events'
import { analyticsProvider } from './provider'
import { LoginRoutineMethod } from './types'

const STRING_VALUE_MAX_LENGTH = 100

type FavoriteSortBy = 'ASCENDING_PRICE' | 'AROUND_ME' | 'RECENTLY_ADDED'
type OfferIdOrVenueId = { offerId: number } | { venueId: number }

export type OfferAnalyticsData = {
  offerId?: number
}

const useInit = () => {
  const { campaignDate } = useUtmParams()

  useEffect(() => {
    // If the user has clicked on marketing link 48h ago, we want to remove the marketing params
    const ago48Hours = new Date()
    ago48Hours.setDate(ago48Hours.getDate() - 2)

    if (campaignDate && campaignDate < ago48Hours) {
      analytics.setDefaultEventParameters(undefined)
    }
  }, [campaignDate])
}

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
  logConsultOffer: (params: {
    offerId: number
    from: Referrals
    moduleName?: string
    query?: string
    venueId?: number
  }) => analyticsProvider.logEvent(AnalyticsEvent.CONSULT_OFFER, params),
  logConsultVenue: (params: { venueId: number; from: Referrals }) =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_VENUE, params),
  logClickExclusivityBlock: (offerId: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId }),
  logClickSeeMore: (moduleName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName }),
  logClickBusinessBlock: (moduleName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName }),
  logRecommendationModuleSeen: (moduleName: string, numberOfTiles: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.RECOMMENDATION_MODULE_SEEN, {
      moduleName,
      numberOfTiles,
    }),
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
  logIdentityCheckAbort: (params: {
    method: IdentityCheckMethod
    reason: string | null
    errorType: string | null
  }) => analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_ABORT, params),
  logIdentityCheckSuccess: (params: { method: IdentityCheckMethod }) =>
    analyticsProvider.logEvent(AnalyticsEvent.IDENTITY_CHECK_SUCCESS, params),
  logOfferSeenDuration: (offerId: number, duration: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration }),
  logHasAddedOfferToFavorites: (params: {
    offerId: number
    from?: Referrals | 'BookingImpossible'
    moduleName?: string
  }) => analyticsProvider.logEvent(AnalyticsEvent.HAS_ADDED_OFFER_TO_FAVORITES, params),
  logConsultWhyAnniversary: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_WHY_ANNIVERSARY),
  logCancelSignup: (pageName: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName }),
  logHelpCenterContactSignupConfirmationEmailSent: () =>
    analyticsProvider.logEvent(AnalyticsEvent.HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT),
  logResendEmailResetPasswordExpiredLink: () =>
    analyticsProvider.logEvent(AnalyticsEvent.RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK),
  logResendEmailSignupConfirmationExpiredLink: () =>
    analyticsProvider.logEvent(AnalyticsEvent.RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK),
  logSignUpTooYoung: (age: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SIGN_UP_TOO_YOUNG, { age }),
  logReinitializeFilters: () => analyticsProvider.logEvent(AnalyticsEvent.REINITIALIZE_FILTERS),
  logUseFilter: (filter: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.USE_FILTER, { filter }),
  logSearchQuery: (query: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEARCH_QUERY, { query }),
  logSearchScrollToPage: (page: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEARCH_SCROLL_TO_PAGE, { page }),
  logNoSearchResult: (query: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.NO_SEARCH_RESULT, { query }),
  logOpenLocationSettings: () => analyticsProvider.logEvent(AnalyticsEvent.OPEN_LOCATION_SETTINGS),
  logOpenNotificationSettings: () =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_NOTIFICATION_SETTINGS),
  logIdCheck: (from: 'Profile') => analyticsProvider.logEvent(AnalyticsEvent.ID_CHECK, { from }),
  logProblemWithLink: (url: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.DEEP_LINK_IMPORTER, {
      url: url.slice(0, STRING_VALUE_MAX_LENGTH),
    }),
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
  logHasRefusedCookie: () => analyticsProvider.logEvent(AnalyticsEvent.HAS_REFUSED_COOKIE),
  logClickSocialNetwork: (network: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.CLICK_SOCIAL_NETWORK, { network }),
  logOpenExternalUrl: (url: string, params: OfferAnalyticsData) =>
    analyticsProvider.logEvent(AnalyticsEvent.OPEN_EXTERNAL_URL, {
      url: url.slice(0, STRING_VALUE_MAX_LENGTH),
      offerId: params.offerId,
    }),
  logMailTo: (
    reason:
      | 'forChangeEmailExpiredLink'
      | 'forGenericQuestion'
      | 'forSignupConfirmationEmailNotReceived'
      | 'forSignupConfirmationExpiredLink'
      | 'forResetPasswordEmailNotReceived'
      | 'forResetPasswordExpiredLink'
      | 'forAccountDeletion'
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
  logChooseLocation: (params: { type: 'place' } | { type: 'venue'; venueId: number }) =>
    analyticsProvider.logEvent(AnalyticsEvent.CHOOSE_LOCATION, params),
  logSelectSchool: (params: { name: string; city: string; academy: string }) =>
    analyticsProvider.logEvent(AnalyticsEvent.SELECT_SCHOOL, params),
  logSaveNewMail: () => analyticsProvider.logEvent(AnalyticsEvent.SAVE_NEW_MAIL),
  logModifyMail: () => analyticsProvider.logEvent(AnalyticsEvent.MODIFY_MAIL),
  logSendActivationMailAgain: (numberOfTimes: number) =>
    analyticsProvider.logEvent(AnalyticsEvent.SEND_ACTIVATION_MAIL_AGAIN, { times: numberOfTimes }),
  logErrorSavingNewEmail: (errorCode: string) =>
    analyticsProvider.logEvent(AnalyticsEvent.ERROR_SAVING_NEW_EMAIL, { code: errorCode }),
  logConsultDisclaimerValidationMail: () =>
    analyticsProvider.logEvent(AnalyticsEvent.CONSULT_DISCLAIMER_VALIDATION_MAIL),
  useInit,
}

export const idCheckAnalytics: IdCheckAnalyticsInterface = {
  cancelSignUp({ pageName }: { pageName: string }) {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.CANCEL_SIGN_UP, {
      pageName,
    })
  },
  identityError() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.IDENTITY_ERROR)
  },
  idValid() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.ID_VALID)
  },
  invalidAge() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.INVALID_AGE)
  },
  invalidDate() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.INVALID_DATE)
  },
  invalidDocument() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.INVALID_DOCUMENT)
  },
  invalidTwice() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.INVALID_TWICE)
  },
  processCompleted() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.PROCESS_COMPLETED)
  },
  wrongSideDocument() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.WRONG_SIDE_DOCUMENT)
  },
  missingDocument() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.MISSING_DOCUMENT)
  },
  externalLink({ href, canOpen }: { href: string; canOpen?: boolean }) {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.EXTERNAL_LINK, {
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
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.HAS_VALID_SESSION, {
      valid,
      accessToken,
      accessTokenExpiresAt,
    })
  },
  startCheckTokens() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.START_CHECK_TOKENS)
  },
  endCheckTokens() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.END_CHECK_TOKENS)
  },
  fileSizeExceeded() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.FILE_SIZE_EXCEEDED)
  },
  permissionsBlocked() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.PERMISSION_BLOCKED)
  },
  cameraUnavailable() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.CALMERA_UNAVAILABLE)
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
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.GET_JOUVE_TOKEN, {
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
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.GET_LICENCE_TOKEN, {
      isError,
      errorCode,
      licenceToken,
      licenceTokenExpirationTimestamp,
    })
  },
  idDocumentAcquisitionType(type: 'Camera' | 'ImageLibrary') {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.ID_DOCUMENT_ACQUISITION_TYPE, { type })
  },
  startDmsTransmission() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.START_DMS_TRANSMISSION)
  },
  takeIdCheckPicture() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.TAKE_ID_CHECK_PICTURE)
  },
  confirmIdCheckPicture() {
    analyticsProvider.logEvent(IdCheckAnalyticsEvent.CONFIRM_ID_CHECK_PICTURE)
  },
}
