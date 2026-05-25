import {
  incrementOffersViewedCount,
  OFFERS_VIEWED_COUNT_STORAGE_KEY,
  readOffersViewedCount,
  resetOffersViewedCount,
} from 'libs/reviewInApp/offersViewedCounter'
import { storage } from 'libs/storage'

describe('offersViewedCounter', () => {
  beforeEach(async () => {
    await storage.clear(OFFERS_VIEWED_COUNT_STORAGE_KEY)
  })

  describe('readOffersViewedCount', () => {
    it('returns 0 when storage is empty', async () => {
      expect(await readOffersViewedCount()).toBe(0)
    })

    it('returns 0 when stored value is not a number', async () => {
      await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, 'not-a-number')

      expect(await readOffersViewedCount()).toBe(0)
    })

    it('returns 0 when stored value is negative', async () => {
      await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, -3)

      expect(await readOffersViewedCount()).toBe(0)
    })

    it('returns the stored value when valid', async () => {
      await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, 7)

      expect(await readOffersViewedCount()).toBe(7)
    })
  })

  describe('incrementOffersViewedCount', () => {
    it('returns 1 on first call', async () => {
      expect(await incrementOffersViewedCount()).toBe(1)
    })

    it('returns successive values on repeated calls', async () => {
      expect(await incrementOffersViewedCount()).toBe(1)
      expect(await incrementOffersViewedCount()).toBe(2)
      expect(await incrementOffersViewedCount()).toBe(3)
    })

    it('persists the new value to storage', async () => {
      await incrementOffersViewedCount()
      await incrementOffersViewedCount()

      expect(await readOffersViewedCount()).toBe(2)
    })
  })

  describe('resetOffersViewedCount', () => {
    it('sets the counter to 0', async () => {
      await incrementOffersViewedCount()
      await incrementOffersViewedCount()

      await resetOffersViewedCount()

      expect(await readOffersViewedCount()).toBe(0)
    })
  })
})
