import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'

export type CustomRemoteConfig = {
  aroundPrecision: Record<'from' | 'value', number>[] | number
  artistPageSubcategories: Record<'subcategories', SubcategoryIdEnum[]>
  displayInAppFeedback: boolean
  displayMandatoryUpdatePersonalData: boolean
  homeEntryIdBeneficiary: string
  homeEntryIdFreeBeneficiary: string
  homeEntryIdFreeOffers: string
  homeEntryIdGeneral: string
  homeEntryIdWithoutBooking: string
  reactionFakeDoorCategories: Record<'categories', NativeCategoryIdEnumv2[]>
  sameAuthorPlaylist: string
  shareAppModalVersion: 'default' | 'A' | 'B'
  shouldDisplayReassuranceMention: boolean
  shouldLogInfo: boolean
  showAccessScreeningButton: boolean
  subscriptionHomeEntryIds: Record<SubscriptionTheme, string>
  test_param: string
  displayNewSearchHeader: boolean
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
