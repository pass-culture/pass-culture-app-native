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
export const OFFERS_VIEWED_REVIEW_THRESHOLD = 10
export const OFFERS_VIEWED_REVIEW_DELAY_MS = 2000
export const LIKE_REVIEW_DELAY_MS = 3000
export const CREDIT_REVIEW_DELAY_MS = 1000 // 1s delay before the prompt on the Home
export const FAST_CREDIT_MAX_DELAY_MS = 24 * 60 * 60 * 1000 // "fast credit" window = 24h

export const REVIEW_TRIGGER_FEATURE_FLAGS: Record<ReviewTriggerSource, RemoteStoreFeatureFlags> = {
  booking_success: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_BOOKING,
  credit_received: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_CREDIT,
  booking_liked: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_LIKE,
  offers_viewed: RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_OFFERS,
}
