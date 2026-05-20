import {
  appendHistory,
  canRequestReview,
  clearHistory,
  readHistory,
} from 'libs/reviewInApp/reviewHistory'
import {
  REVIEW_LOCK_DURATION_MS,
  REVIEW_QUOTA_LIMIT,
  REVIEW_WINDOW_MS,
} from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

const NOW = 1_700_000_000_000

describe('reviewHistory', () => {
  beforeEach(async () => {
    await clearHistory()
  })

  describe('readHistory', () => {
    it('returns an empty array when storage is empty', async () => {
      expect(await readHistory(NOW)).toEqual([])
    })

    it('returns stored timestamps', async () => {
      await storage.saveObject('review_request_history', [NOW - 1000, NOW - 2000])

      expect(await readHistory(NOW)).toEqual([NOW - 1000, NOW - 2000])
    })

    it('filters out timestamps older than the 365 days window', async () => {
      await storage.saveObject('review_request_history', [NOW - REVIEW_WINDOW_MS - 1, NOW - 1000])

      expect(await readHistory(NOW)).toEqual([NOW - 1000])
    })

    it('returns an empty array when stored value is not an array', async () => {
      await storage.saveObject('review_request_history', 'not-an-array')

      expect(await readHistory(NOW)).toEqual([])
    })

    it('filters out non-number entries from stored array', async () => {
      await storage.saveObject('review_request_history', [NOW - 1000, 'oops', null, NOW - 500])

      expect(await readHistory(NOW)).toEqual([NOW - 1000, NOW - 500])
    })
  })

  describe('appendHistory', () => {
    it('pushes a new timestamp to an empty history', async () => {
      await appendHistory(NOW)

      expect(await readHistory(NOW)).toEqual([NOW])
    })

    it('pushes a new timestamp keeping the existing ones', async () => {
      await storage.saveObject('review_request_history', [NOW - 1000])
      await appendHistory(NOW)

      expect(await readHistory(NOW)).toEqual([NOW - 1000, NOW])
    })

    it('purges expired entries on write', async () => {
      await storage.saveObject('review_request_history', [NOW - REVIEW_WINDOW_MS - 1, NOW - 1000])
      await appendHistory(NOW)

      expect(await readHistory(NOW)).toEqual([NOW - 1000, NOW])
    })
  })

  describe('canRequestReview', () => {
    it('returns true when history is empty', () => {
      expect(canRequestReview([], NOW)).toBe(true)
    })

    it('returns true when history is below quota and last entry is older than the lock', () => {
      const oldEnough = NOW - REVIEW_LOCK_DURATION_MS - 1

      expect(canRequestReview([oldEnough], NOW)).toBe(true)
    })

    it('returns false when history reaches the quota limit', () => {
      const longAgo = NOW - REVIEW_LOCK_DURATION_MS - 1
      const history = Array.from({ length: REVIEW_QUOTA_LIMIT }, (_, i) => longAgo - i * 1000)

      expect(canRequestReview(history, NOW)).toBe(false)
    })

    it('returns false when the last entry is within the 30 days lock', () => {
      const recent = NOW - REVIEW_LOCK_DURATION_MS + 1

      expect(canRequestReview([recent], NOW)).toBe(false)
    })

    it('ignores expired entries when computing the quota', () => {
      const expired = NOW - REVIEW_WINDOW_MS - 1
      const recent = NOW - REVIEW_LOCK_DURATION_MS - 1
      const history = [expired, expired, expired, recent]

      expect(canRequestReview(history, NOW)).toBe(true)
    })

    it('ignores expired entries when checking the lock', () => {
      const expired = NOW - REVIEW_WINDOW_MS - 1

      expect(canRequestReview([expired], NOW)).toBe(true)
    })
  })
})
