import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export type ReviewTriggerSource =
  | 'booking_success'
  | 'credit_received'
  | 'booking_liked'
  | 'offers_viewed'

export const REVIEW_QUOTA_LIMIT = 3
export const REVIEW_LOCK_DURATION_MS = 30 * 24 * 60 * 60 * 1000
export const REVIEW_WINDOW_MS = 365 * 24 * 60 * 60 * 1000
export const DEFAULT_DELAY_MS = 1000

export const REVIEW_TRIGGER_FEATURE_FLAGS: Record<ReviewTriggerSource, RemoteStoreFeatureFlags> = {
  booking_success: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_BOOKING,
  credit_received: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_CREDIT,
  booking_liked: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_LIKE,
  offers_viewed: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_OFFERS,
}
