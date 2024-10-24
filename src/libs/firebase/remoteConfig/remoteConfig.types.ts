import { NativeCategoryIdEnumv2 } from 'api/gen'
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
  reactionFakeDoorCategories: Record<'categories', NativeCategoryIdEnumv2[]>
  reactionCategories: Record<'categories', NativeCategoryIdEnumv2[]>
  sameAuthorPlaylist: string
  shouldApplyGraphicRedesign: boolean
  shouldDisplayReassuranceMention: boolean
  shouldLogInfo: boolean
  displayInAppFeedback: boolean
  subscriptionHomeEntryIds: Record<SubscriptionTheme, string>
  shareAppModalVersion: 'default' | 'A' | 'B'
}

/* The purpose of GenericRemoteConfig is only to resolve type conflicts.
For example : firebaseRemoteConfig().setDefaults(... as GenericRemoteConfig) */
export type GenericRemoteConfig = CustomRemoteConfig & {
  [key: string]: string | number | boolean
}
