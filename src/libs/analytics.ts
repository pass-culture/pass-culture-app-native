import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const firebaseAnalytics = firebaseAnalyticsModule()

// Event names can be up to 40 characters long, may only contain alphanumeric characters and underscores
enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  CANCEL_SIGNUP = 'CancelSignup',
  CLICK_BOOK_OFFER = 'ClickBookOffer',
  CONSULT_ACCESSIBILITY_MODALITIES = 'ConsultAccessibilityModalities',
  CONSULT_AVAILABLE_DATES = 'ConsultAvailableDates',
  CONSULT_DESCRIPTION_DETAILS = 'ConsultDescriptionDetails',
  CONSULT_OFFER = 'ConsultOffer',
  CONSULT_ITINERARY = 'ConsultLocationItinerary',
  CONSULT_WHOLE_OFFER = 'ConsultWholeOffer',
  CONSULT_WITHDRAWAL_MODALITIES = 'ConsultWithdrawalModalities',
  CONTACT_SUPPORT = 'ContactSupport',
  DEEPLINK_CONSULT_OFFER = 'DeeplinkConsultOffer',
  EXCLUSIVITY_BLOCK_CLICKED = 'ExclusivityBlockClicked',
  OFFER_SEEN_DURATION = 'OfferSeenDuration',
  RESEND_EMAIL = 'ResendEmail',
  SCREEN_VIEW = 'screen_view',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  SHARE_OFFER = 'Share',
  WHY_ANNIVERSARY_CLICKED = 'WhyAnniversary',
}

const logScreenView = async (screenName: string) => {
  // 1. We log an event screen_view so that Firebase knows the screen of the user
  await firebaseAnalytics.logScreenView({ screen_name: screenName, screen_class: screenName })
  // 2. We also log an event screen_view_<screen> to help with funnels.
  // See https://blog.theodo.com/2018/01/building-google-analytics-funnel-firebase-react-native/
  await firebaseAnalytics.logEvent(`${AnalyticsEvent.SCREEN_VIEW}_${screenName.toLowerCase()}`)
}

const logAllModulesSeen = (numberOfModules: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

const logAllTilesSeen = (moduleName: string, numberOfTiles: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

const logConsultOffer = (offerId: number, moduleName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_OFFER, { offerId, moduleName })

const logClickExclusivityBlock = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId })

const logClickSeeMore = (moduleName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

const logClickBusinessBlock = (moduleName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })

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

const logClickWhyAnniversary = () =>
  firebaseAnalytics.logEvent(AnalyticsEvent.WHY_ANNIVERSARY_CLICKED)

const logCancelSignup = (pageName: string) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName })

const logOfferSeenDuration = (offerId: number, duration: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration })

const logContactSupport = () => firebaseAnalytics.logEvent(AnalyticsEvent.CONTACT_SUPPORT)

const logClickBookOffer = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CLICK_BOOK_OFFER, { offerId })

const logConsultAvailableDates = (offerId: number) =>
  firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_AVAILABLE_DATES, { offerId })

const logResendEmail = () => firebaseAnalytics.logEvent(AnalyticsEvent.RESEND_EMAIL)

export const analytics = {
  logAllModulesSeen,
  logAllTilesSeen,
  logCancelSignup,
  logClickBookOffer,
  logClickBusinessBlock,
  logClickExclusivityBlock,
  logClickSeeMore,
  logClickWhyAnniversary,
  logConsultAccessibility,
  logConsultAvailableDates,
  logConsultDescriptionDetails,
  logConsultItinerary,
  logConsultOffer,
  logConsultOfferFromDeeplink,
  logConsultWholeOffer,
  logConsultWithdrawal,
  logContactSupport,
  logOfferSeenDuration,
  logResendEmail,
  logScreenView,
  logShareOffer,
}
