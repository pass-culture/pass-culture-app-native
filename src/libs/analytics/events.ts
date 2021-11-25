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
  CHOOSE_LOCATION = 'ChooseLocation',
  CLICK_BOOK_OFFER = 'ClickBookOffer',
  CLICK_SOCIAL_NETWORK = 'ClickSocialNetwork',
  CONFIRM_BOOKING_CANCELLATION = 'ConfirmBookingCancellation',
  CONSULT_ACCESSIBILITY_MODALITIES = 'ConsultAccessibilityModalities',
  CONSULT_AVAILABLE_DATES = 'ConsultAvailableDates',
  CONSULT_DESCRIPTION_DETAILS = 'ConsultDescriptionDetails',
  CONSULT_ITINERARY = 'ConsultLocationItinerary',
  CONSULT_OFFER = 'ConsultOffer',
  CONSULT_VENUE = 'ConsultVenue',
  CONSULT_WHOLE_OFFER = 'ConsultWholeOffer',
  CONSULT_WHY_ANNIVERSARY = 'ConsultModalWhyAnniversary',
  CONSULT_WITHDRAWAL_MODALITIES = 'ConsultWithdrawalModalities',
  HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT = 'HelpCenterContactSignUpConfirmation',
  DEEP_LINK_IMPORTER = 'DeeplinkImporter',
  DISCOVER_OFFERS = 'DiscoverOffers',
  ERROR_SAVING_NEW_EMAIL = 'ErrorSavingNewMail',
  EXCLUSIVITY_BLOCK_CLICKED = 'ExclusivityBlockClicked',
  HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL = 'HasActivateGeolocFromTutorial',
  HAS_ADDED_OFFER_TO_FAVORITES = 'HasAddedOfferToFavorites',
  HAS_APPLIED_FAVORITES_SORTING = 'HasAppliedFavoritesSorting',
  HAS_CHANGED_PASSWORD = 'HasChangedPassword',
  HAS_REFUSED_COOKIE = 'HasRefusedCookie',
  HAS_SKIPPED_TUTORIAL = 'HasSkippedTutorial',
  ID_CHECK = 'IdCheck',
  LOCATION_TOGGLE = 'LocationToggle',
  LOGOUT = 'Logout',
  MAIL_TO = 'MailTo',
  MODIFY_MAIL = 'ModifyMail',
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
  SAVE_NEW_MAIL = 'SaveNewMail',
  SCREEN_VIEW = 'screen_view',
  SEARCH_QUERY = 'SearchQuery',
  SEARCH_SCROLL_TO_PAGE = 'SearchScrollToPage',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  SEE_MY_BOOKING = 'SeeMyBooking',
  SELECT_SCHOOL = 'SelectSchool',
  SEND_ACTIVATION_MAIL_AGAIN = 'SendActivationMailAgain',
  SHARE_OFFER = 'Share',
  SHARE_VENUE = 'ShareVenue',
  SIGN_UP_TOO_YOUNG = 'SignUpTooYoung',
  USE_FILTER = 'UseFilter',
  VENUE_CONTACT = 'VenueContact',
  VENUE_SEE_ALL_OFFERS_CLICKED = 'VenueSeeAllOffersClicked',
  VENUE_SEE_MORE_CLICKED = 'VenueSeeMoreClicked',
}

export enum IdCheckAnalyticsEvent {
  CANCEL_SIGN_UP = 'IdCheck_CancelSignUp',
  IDENTITY_ERROR = 'IdCheck_IdentityError',
  ID_VALID = 'IdCheck_IDValid',
  INVALID_AGE = 'IdCheck_InvalidAge',
  INVALID_DATE = 'IdCheck_InvalidDate',
  INVALID_DOCUMENT = 'IdCheck_InvalidDocument',
  INVALID_TWICE = 'IdCheck_InvalidTwice',
  PROCESS_COMPLETED = 'IdCheck_ProcessCompleted',
  WRONG_SIDE_DOCUMENT = 'IdCheck_WrongSideDocument',
  MISSING_DOCUMENT = 'IdCheck_MissingDocument',
  EXTERNAL_LINK = 'IdCheck_ExternalLink',
  HAS_VALID_SESSION = 'IdCheck_HasValidSession',
  START_CHECK_TOKENS = 'IdCheck_StartCheckTokens',
  END_CHECK_TOKENS = 'IdCheck_EndCheckTokens',
  FILE_SIZE_EXCEEDED = 'IdCheck_FileSizeExceeded',
  PERMISSION_BLOCKED = 'IdCheck_PermissionsBlocked',
  CALMERA_UNAVAILABLE = 'IdCheck_CameraUnavailable',
  GET_JOUVE_TOKEN = 'IdCheck_GetJouveToken',
  GET_LICENCE_TOKEN = 'IdCheck_GetLicenceToken',
  ID_DOCUMENT_ACQUISITION_TYPE = 'IdCheck_IdDocumentAcquisitionType',
  START_DMS_TRANSMISSION = 'StartDmsTransmission',
  TAKE_ID_CHECK_PICTURE = 'TakeIdCheckPicture',
  CONFIRM_ID_CHECK_PICTURE = 'ConfirmIdCheckPicture',
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
