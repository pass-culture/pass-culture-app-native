import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'

export type CustomRemoteConfig = {
  test_param: string
  aroundPrecision: Record<'from' | 'value', number>[] | number
  artistPageSubcategories: Record<'subcategories', SubcategoryIdEnum[]>
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
  reactionFakeDoorCategories: Record<'categories', NativeCategoryIdEnumv2[]>
  sameAuthorPlaylist: string
  shouldDisplayReassuranceMention: boolean
  shouldLogInfo: boolean
  displayInAppFeedback: boolean
  subscriptionHomeEntryIds: Record<SubscriptionTheme, string>
  shareAppModalVersion: 'default' | 'A' | 'B'
  showAccessScreeningButton: boolean
}

/* The purpose of GenericRemoteConfig is only to resolve type conflicts.
For example : firebaseRemoteConfig().setDefaults(... as GenericRemoteConfig) */
export type GenericRemoteConfig = CustomRemoteConfig & {
  [key: string]: string | number | boolean
}

export type RemoteConfigServices = {
  configure(): Promise<void>
  refresh(): Promise<boolean>
  getValues(): CustomRemoteConfig
}
