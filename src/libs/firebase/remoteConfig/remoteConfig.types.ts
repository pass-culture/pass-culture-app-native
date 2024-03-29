import { SubscriptionTheme } from 'features/subscription/types'

export type CustomRemoteConfig = {
  test_param: string
  homeEntryIdFreeOffers: string
  homeEntryIdNotConnected: string
  homeEntryIdGeneral: string
  homeEntryIdOnboardingGeneral: string
  homeEntryIdOnboardingUnderage: string
  homeEntryIdOnboarding_18: string
  homeEntryIdWithoutBooking_18: string
  homeEntryIdWithoutBooking_15_17: string
  homeEntryId_18: string
  homeEntryId_15_17: string
  sameAuthorPlaylist: string
  shouldDisplayReassuranceMention: boolean
  subscriptionHomeEntryIds: Record<SubscriptionTheme, string>
}

/* The purpose of GenericRemoteConfig is only to resolve type conflicts.
For example : firebaseRemoteConfig().setDefaults(... as GenericRemoteConfig) */
export type GenericRemoteConfig = CustomRemoteConfig & {
  [key: string]: string | number | boolean
}
