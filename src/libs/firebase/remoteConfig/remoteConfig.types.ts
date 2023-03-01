export type CustomRemoteConfig = {
  test_param: string
  homeEntryIdNotConnected: string
  homeEntryIdGeneral: string
  homeEntryIdWithoutBooking_18: string
  homeEntryIdWithoutBooking_15_17: string
  homeEntryId_18: string
  homeEntryId_15_17: string
  shouldUseAlgoliaRecommend: boolean
}

/* The purpose of GenericRemoteConfig is only to resolve type conflicts.
For example : firebaseRemoteConfig().setDefaults(... as GenericRemoteConfig) */
export type GenericRemoteConfig = CustomRemoteConfig & {
  [key: string]: string | number | boolean
}
