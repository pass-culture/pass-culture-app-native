import { FAST_CREDIT_MAX_DELAY_MS } from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

export const PROFILE_STARTED_AT_KEY = 'credit_review_profile_started_at'
export const CREDIT_REVIEW_ELIGIBLE_KEY = 'credit_review_eligible'

// Records the start of the profile journey (first access to the form).
// We do not overwrite an existing value: we keep the very first instant.
export const recordProfileCompletionStart = async (now: number = Date.now()): Promise<void> => {
  const existing = await storage.readObject<number>(PROFILE_STARTED_AT_KEY)
  if (typeof existing === 'number') return
  await storage.saveObject(PROFILE_STARTED_AT_KEY, now)
}

// On credit reception: if the credit arrived in less than 24h, mark as eligible.
export const evaluateCreditReviewEligibility = async (now: number = Date.now()): Promise<void> => {
  const startedAt = await storage.readObject<number>(PROFILE_STARTED_AT_KEY)
  await storage.clear(PROFILE_STARTED_AT_KEY)
  if (typeof startedAt !== 'number') return
  const elapsed = now - startedAt
  if (elapsed >= 0 && elapsed <= FAST_CREDIT_MAX_DELAY_MS) {
    await storage.saveObject(CREDIT_REVIEW_ELIGIBLE_KEY, true)
  }
}

// Reads the eligibility flag without clearing it.
export const peekCreditReviewEligibility = async (): Promise<boolean> => {
  const eligible = await storage.readObject<boolean>(CREDIT_REVIEW_ELIGIBLE_KEY)
  return eligible === true
}

// Clears the eligibility flag once the prompt has actually been triggered.
export const clearCreditReviewEligibility = async (): Promise<void> => {
  await storage.clear(CREDIT_REVIEW_ELIGIBLE_KEY)
}

// Reads + clears the flag (one-shot) for the Home trigger.
export const consumeCreditReviewEligibility = async (): Promise<boolean> => {
  const eligible = await peekCreditReviewEligibility()
  if (!eligible) return false
  await clearCreditReviewEligibility()
  return true
}

export const resetCreditReviewTrigger = async (): Promise<void> => {
  await Promise.all([
    storage.clear(PROFILE_STARTED_AT_KEY),
    storage.clear(CREDIT_REVIEW_ELIGIBLE_KEY),
  ])
}
