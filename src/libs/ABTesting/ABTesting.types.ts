export type CustomRemoteConfig = {
  test_param: 'A' | 'B'
  homeEntryId: ''
}

/* The purpose of GenericRemoteConfig is only to resolve type conflicts.
For example : firebaseRemoteConfig().setDefaults(... as GenericRemoteConfig) */
export type GenericRemoteConfig = CustomRemoteConfig & {
  [key: string]: string | number | boolean
}
