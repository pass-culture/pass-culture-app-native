import {
  isFastCreditCandidate,
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

  describe('isFastCreditCandidate', () => {
    it('returns true and clears the start timestamp when credit is received in less than 24h', async () => {
      await storage.saveObject(PROFILE_STARTED_AT_KEY, NOW)

      const result = await isFastCreditCandidate(NOW + FAST_CREDIT_MAX_DELAY_MS - 1)

      expect(result).toBe(true)
      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBeNull()
    })

    it('returns false and clears the start timestamp when credit is received after 24h', async () => {
      await storage.saveObject(PROFILE_STARTED_AT_KEY, NOW)

      const result = await isFastCreditCandidate(NOW + FAST_CREDIT_MAX_DELAY_MS + 1)

      expect(result).toBe(false)
      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBeNull()
    })

    it('returns false when no start timestamp is stored', async () => {
      expect(await isFastCreditCandidate(NOW)).toBe(false)
    })
  })

  describe('resetCreditReviewTrigger', () => {
    it('clears the start timestamp', async () => {
      await storage.saveObject(PROFILE_STARTED_AT_KEY, NOW)

      await resetCreditReviewTrigger()

      expect(await storage.readObject<number>(PROFILE_STARTED_AT_KEY)).toBeNull()
    })
  })
})
