import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const analytics = firebaseAnalyticsModule()

export enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
  CONSULT_OFFER = 'ConsultOffer',
  SEE_MORE_CLICKED = 'SeeMoreClicked',
  BUSINESS_BLOCK_CLICKED = 'BusinessBlockClicked',
}

export const logAllModulesSeen = async (numberOfModules: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

export const logAllTilesSeen = async (moduleName: string, numberOfTiles: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })

export const logConsultOffer = async (offerId: string) =>
  await analytics.logEvent(AnalyticsEvent.CONSULT_OFFER, { offerId })

export const logClickSeeMore = async (moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.SEE_MORE_CLICKED, { moduleName })

export const logClickBusinessBlock = async (moduleName: string) =>
  await analytics.logEvent(AnalyticsEvent.BUSINESS_BLOCK_CLICKED, { moduleName })
