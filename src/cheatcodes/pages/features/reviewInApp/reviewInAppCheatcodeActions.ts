import {
  CREDIT_REVIEW_ELIGIBLE_KEY,
  PROFILE_STARTED_AT_KEY,
} from 'libs/reviewInApp/creditReviewTrigger'
import { MIGRATION_DONE_KEY, runMigrationFromV1 } from 'libs/reviewInApp/migrateFromV1'
import {
  incrementOffersViewedCount,
  OFFERS_VIEWED_COUNT_STORAGE_KEY,
  resetOffersViewedCount,
} from 'libs/reviewInApp/offersViewedCounter'
import { appendHistory, clearHistory, STORAGE_KEY } from 'libs/reviewInApp/reviewHistory'
import {
  OFFERS_VIEWED_REVIEW_THRESHOLD,
  REVIEW_LOCK_DURATION_MS,
  REVIEW_QUOTA_LIMIT,
} from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

export { resetCreditReviewTrigger as resetCreditTrigger } from 'libs/reviewInApp/creditReviewTrigger'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const seedPromptNow = async (): Promise<void> => {
  await appendHistory(Date.now())
}

export const seedPromptOutOfLock = async (): Promise<void> => {
  await appendHistory(Date.now() - REVIEW_LOCK_DURATION_MS - ONE_DAY_MS)
}

export const seedQuotaSaturated = async (): Promise<void> => {
  const now = Date.now()
  const recent = Array.from({ length: REVIEW_QUOTA_LIMIT }, (_, i) => now - i * 1000)
  await storage.saveObject(STORAGE_KEY, recent)
}

export const resetHistory = async (): Promise<void> => {
  await clearHistory()
}

export const seedV1Data = async (): Promise<void> => {
  const now = Date.now()
  await Promise.all([
    storage.saveObject('times_review_has_been_requested', 2),
    storage.saveObject('first_time_review_has_been_requested', now - 60 * ONE_DAY_MS),
  ])
}

export const replayMigrationFromV1 = async (): Promise<void> => {
  await storage.clear(MIGRATION_DONE_KEY)
  await runMigrationFromV1()
}

export const incrementOffersViewed = async (): Promise<void> => {
  await incrementOffersViewedCount()
}

export const resetOffersViewed = async (): Promise<void> => {
  await resetOffersViewedCount()
}

export const seedOffersViewedAtThresholdMinusOne = async (): Promise<void> => {
  await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, OFFERS_VIEWED_REVIEW_THRESHOLD - 1)
}

// Directly mark the user as eligible for the credit review trigger.
export const seedFastCreditEligible = async (): Promise<void> => {
  await storage.clear(PROFILE_STARTED_AT_KEY)
  await storage.saveObject(CREDIT_REVIEW_ELIGIBLE_KEY, true)
}

// Simulate a profile journey started 1h ago (fast credit -> eligible after credit).
export const seedProfileStartedFast = async (): Promise<void> => {
  await storage.clear(CREDIT_REVIEW_ELIGIBLE_KEY)
  await storage.saveObject(PROFILE_STARTED_AT_KEY, Date.now() - 60 * 60 * 1000)
}

// Simulate a profile journey started 48h ago (slow credit -> not eligible).
export const seedProfileStartedSlow = async (): Promise<void> => {
  await storage.clear(CREDIT_REVIEW_ELIGIBLE_KEY)
  await storage.saveObject(PROFILE_STARTED_AT_KEY, Date.now() - 48 * 60 * 60 * 1000)
}
