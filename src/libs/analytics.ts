import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const firebaseAnalytics = firebaseAnalyticsModule()

// Event names can be up to 40 characters long, may only contain alphanumeric characters and underscores
enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  CANCEL_SIGNUP = 'CancelSignup',
  CLICK_BOOK_OFFER = 'ClickBookOffer',
  CONSULT_ACCESSIBILITY_MODALITIES = 'ConsultAccesibilityModalities',
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

const logAllModulesSeen = async (numberOfModules: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

const logAllTilesSeen = async (moduleName: string, numberOfTiles: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

const logConsultOffer = async (offerId: number, moduleName: string) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_OFFER, { offerId, moduleName })

const logClickExclusivityBlock = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId })

const logClickSeeMore = async (moduleName: string) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

const logClickBusinessBlock = async (moduleName: string) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })

const logConsultOfferFromDeeplink = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.DEEPLINK_CONSULT_OFFER, { offerId })

const logConsultAccessibility = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES, { offerId })

const logConsultWithdrawal = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES, { offerId })

const logShareOffer = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.SHARE_OFFER, { offerId })

const logConsultDescriptionDetails = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS, { offerId })

const logConsultWholeOffer = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_WHOLE_OFFER, { offerId })

const logConsultItinerary = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONSULT_ITINERARY, { offerId })

const logClickWhyAnniversary = async () =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.WHY_ANNIVERSARY_CLICKED)

const logCancelSignup = async (pageName: string) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CANCEL_SIGNUP, { pageName })

const logOfferSeenDuration = async (offerId: number, duration: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.OFFER_SEEN_DURATION, { offerId, duration })

const logContactSupport = async () =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CONTACT_SUPPORT)

const logClickBookOffer = async (offerId: number) =>
  await firebaseAnalytics.logEvent(AnalyticsEvent.CLICK_BOOK_OFFER, { offerId })

const logResendEmail = async () => await firebaseAnalytics.logEvent(AnalyticsEvent.RESEND_EMAIL)

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
