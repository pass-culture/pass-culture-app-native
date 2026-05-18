export type ReviewTriggerSource =
  | 'booking_success'
  | 'credit_received'
  | 'booking_liked'
  | 'offers_viewed'

export const REVIEW_QUOTA_LIMIT = 3
export const REVIEW_LOCK_DURATION_MS = 30 * 24 * 60 * 60 * 1000
export const REVIEW_WINDOW_MS = 365 * 24 * 60 * 60 * 1000
export const DEFAULT_DELAY_MS = 1000
