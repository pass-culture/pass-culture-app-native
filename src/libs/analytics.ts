import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const analytics = firebaseAnalyticsModule()

export enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
  ALL_TILES_SEEN = 'AllTilesSeen',
}

export const logAllModulesSeen = async (numberOfModules: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })

export const logAllTilesSeen = async (moduleName: string, numberOfTiles: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_TILES_SEEN, { moduleName, numberOfTiles })
