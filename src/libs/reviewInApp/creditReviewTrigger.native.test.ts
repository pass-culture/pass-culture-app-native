import {
  consumeCreditReviewEligibility,
  CREDIT_REVIEW_ELIGIBLE_KEY,
  evaluateCreditReviewEligibility,
  PROFILE_STARTED_AT_KEY,
  recordProfileCompletionStart,
  resetCreditReviewTrigger,
} from 'libs/reviewInApp/creditReviewTrigger'
import { FAST_CREDIT_MAX_DELAY_MS } from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

const NOW = 1_700_000_000_000

describe('creditReviewTrigger', () => {
  beforeEach(async () => {
    await resetCreditReviewTrigger()
  })

  describe('recordProfileCompletionStart', () => {
    it('stores the start timestamp when none exists', async () => {
      await recordProfileCompletionStart(NOW)

      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBe(NOW)
    })

    it('does not overwrite an existing start timestamp', async () => {
      await recordProfileCompletionStart(NOW)
      await recordProfileCompletionStart(NOW + 5000)

      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBe(NOW)
    })
  })

  describe('evaluateCreditReviewEligibility', () => {
    it('marks as eligible when credit is received in less than 24h', async () => {
      await storage.saveObject(PROFILE_STARTED_AT_KEY, NOW)

      await evaluateCreditReviewEligibility(NOW + FAST_CREDIT_MAX_DELAY_MS - 1)

      expect(await storage.readObject<boolean>(CREDIT_REVIEW_ELIGIBLE_KEY)).toBe(true)
      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBeNull()
    })

    it('does not mark as eligible when credit is received after 24h', async () => {
      await storage.saveObject(PROFILE_STARTED_AT_KEY, NOW)

      await evaluateCreditReviewEligibility(NOW + FAST_CREDIT_MAX_DELAY_MS + 1)

      expect(await storage.readObject<boolean>(CREDIT_REVIEW_ELIGIBLE_KEY)).toBeNull()
      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBeNull()
    })

    it('does nothing when no start timestamp is stored', async () => {
      await evaluateCreditReviewEligibility(NOW)

      expect(await storage.readObject<boolean>(CREDIT_REVIEW_ELIGIBLE_KEY)).toBeNull()
    })
  })

  describe('consumeCreditReviewEligibility', () => {
    it('returns true and clears the flag once (one-shot)', async () => {
      await storage.saveObject(CREDIT_REVIEW_ELIGIBLE_KEY, true)

      expect(await consumeCreditReviewEligibility()).toBe(true)
      expect(await consumeCreditReviewEligibility()).toBe(false)
    })

    it('returns false when no flag is set', async () => {
      expect(await consumeCreditReviewEligibility()).toBe(false)
    })
  })

  describe('resetCreditReviewTrigger', () => {
    it('clears both keys', async () => {
      await storage.saveObject(PROFILE_STARTED_AT_KEY, NOW)
      await storage.saveObject(CREDIT_REVIEW_ELIGIBLE_KEY, true)

      await resetCreditReviewTrigger()

      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBeNull()
      expect(await storage.readObject<boolean>(CREDIT_REVIEW_ELIGIBLE_KEY)).toBeNull()
    })
  })
})
