import { FAST_CREDIT_MAX_DELAY_MS } from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

export const PROFILE_STARTED_AT_KEY = 'credit_review_profile_started_at'

// Records the start of the profile journey (first access to the form).
// We do not overwrite an existing value: we keep the very first instant.
export const recordProfileCompletionStart = async (now: number = Date.now()): Promise<void> => {
  const existing = await storage.readObject<number>(PROFILE_STARTED_AT_KEY)
  if (typeof existing === 'number') return
  await storage.saveObject(PROFILE_STARTED_AT_KEY, now)
}

// Reads the start timestamp, clears it, and returns true if the credit was
// received less than 24h after the profile journey started.
export const isFastCreditCandidate = async (now: number = Date.now()): Promise<boolean> => {
  const startedAt = await storage.readObject<number>(PROFILE_STARTED_AT_KEY)
  await storage.clear(PROFILE_STARTED_AT_KEY)
  if (typeof startedAt !== 'number') return false
  const elapsed = now - startedAt
  return elapsed >= 0 && elapsed <= FAST_CREDIT_MAX_DELAY_MS
}

export const resetCreditReviewTrigger = async (): Promise<void> => {
  await storage.clear(PROFILE_STARTED_AT_KEY)
}
