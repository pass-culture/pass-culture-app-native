import firebaseAnalyticsModule from '@react-native-firebase/analytics'

export const analytics = firebaseAnalyticsModule()

export enum AnalyticsEvent {
  ALL_MODULES_SEEN = 'AllModulesSeen',
}

export const logAllModulesSeen = async (numberOfModules: number) =>
  await analytics.logEvent(AnalyticsEvent.ALL_MODULES_SEEN, { numberOfModules })
