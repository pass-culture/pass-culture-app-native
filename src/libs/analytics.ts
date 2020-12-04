import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const analytics = firebaseAnalyticsModule()

export enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  CONSULT_OFFER = 'ConsultOffer',
  DEEPLINK_CONSULT_OFFER = 'DeeplinkConsultOffer',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
  EXCLUSIVITY_BLOCK_CLICKED = 'ExclusivityBlockClicked',
}

export const logAllModulesSeen = async (numberOfModules: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

export const logAllTilesSeen = async (moduleName: string, numberOfTiles: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

export const logConsultOffer = async (offerId: string) =>
  await analytics.logEvent(AnalyticsEvent.CONSULT_OFFER, { offerId })

export const logClickExclusivityBlock = async (offerId: string) =>
  await analytics.logEvent(AnalyticsEvent.EXCLUSIVITY_BLOCK_CLICKED, { offerId })

export const logClickSeeMore = async (moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

export const logClickBusinessBlock = async (moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })

export const logConsultOfferFromDeeplink = async (offerId: string) =>
  await analytics.logEvent(AnalyticsEvent.DEEPLINK_CONSULT_OFFER, { offerId })
