import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const analytics = firebaseAnalyticsModule()

enum AnalyticsEvent {
  SCREEN_VIEW = 'screen_view',
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  CONSULT_OFFER = 'ConsultOffer',
  DEEPLINK_CONSULT_OFFER = 'DeeplinkConsultOffer',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  EXCLUSIVITY_BLOCK_CLICKED = 'ExclusivityBlockClicked',
  CONSULT_ACCESSIBILITY_MODALITIES = 'ConsultAccesibilityModalities',
  CONSULT_WITHDRAWAL_MODALITIES = 'ConsultWithdrawalModalities',
  CONSULT_DESCRIPTION_DETAILS = 'ConsultDescriptionDetails',
  SHARE_OFFER = 'Share',
  CONSULT_WHOLE_OFFER = 'ConsultWholeOffer',
}

export const logScreenView = async (screenName: string) => {
  // 1. We log an event screen_view so that Firebase knows the screen of the user
  await analytics.logScreenView({ screen_name: screenName, screen_class: screenName })
  // 2. We also log an event screen_view_<screen> to help with funnels.
  // See https://blog.theodo.com/2018/01/building-google-analytics-funnel-firebase-react-native/
  await analytics.logEvent(`${AnalyticsEvent.SCREEN_VIEW}_${screenName.toLowerCase()}`)
}

export const logAllModulesSeen = async (numberOfModules: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

export const logAllTilesSeen = async (moduleName: string, numberOfTiles: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

export const logConsultOffer = async (offerId: string, moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.CONSULT_OFFER, { offerId, moduleName })

export const logClickExclusivityBlock = async (offerId: string) =>
  await analytics.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId })

export const logClickSeeMore = async (moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

export const logClickBusinessBlock = async (moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })

export const logConsultOfferFromDeeplink = async (offerId: string) =>
  await analytics.logEvent(AnalyticsEvent.DEEPLINK_CONSULT_OFFER, { offerId })

export const logConsultAccessibility = async (offerId: number) =>
  await analytics.logEvent(AnalyticsEvent.CONSULT_ACCESSIBILITY_MODALITIES, { offerId })

export const logConsultWithdrawal = async (offerId: number) =>
  await analytics.logEvent(AnalyticsEvent.CONSULT_WITHDRAWAL_MODALITIES, { offerId })

export const logShareOffer = async (offerId: number) =>
  await analytics.logEvent(AnalyticsEvent.SHARE_OFFER, { offerId })

export const logConsultDescriptionDetails = async (offerId: number) =>
  await analytics.logEvent(AnalyticsEvent.CONSULT_DESCRIPTION_DETAILS, { offerId })

export const logConsultWholeOffer = async (offerId: number) => {
  return await analytics.logEvent(AnalyticsEvent.CONSULT_WHOLE_OFFER, { offerId })
}
