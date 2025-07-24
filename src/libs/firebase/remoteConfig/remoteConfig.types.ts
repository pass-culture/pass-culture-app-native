import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'

export type CustomRemoteConfig = {
  test_param: string
  aroundPrecision: Record<'from' | 'value', number>[] | number
  artistPageSubcategories: Record<'subcategories', SubcategoryIdEnum[]>
  gridListLayoutRemoteConfig: string
  homeEntryIdBeneficiary: string
  homeEntryIdFreeBeneficiary: string
  homeEntryIdFreeOffers: string
  homeEntryIdGeneral: string
  homeEntryIdWithoutBooking: string
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
