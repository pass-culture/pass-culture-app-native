import { getAdvicesStatus } from 'features/offer/helpers/offerAdvices'

describe('getAdvicesStatus', () => {
  describe('total count', () => {
    it('should return the provided counter as total', () => {
      const result = getAdvicesStatus(10, 2)

      expect(result.total).toEqual(10)
    })

    it('should return 0 as total if counter is null or undefined', () => {
      expect(getAdvicesStatus(null, 2).total).toEqual(0)
      expect(getAdvicesStatus(undefined, 2).total).toEqual(0)
    })
  })

  describe('hasPublished', () => {
    it('should be true when arraySize is greater than 0', () => {
      const result = getAdvicesStatus(5, 1)

      expect(result.hasPublished).toEqual(true)
    })

    it('should be false when arraySize is 0', () => {
      const result = getAdvicesStatus(5, 0)

      expect(result.hasPublished).toEqual(false)
    })

    it('should be false when arraySize is undefined', () => {
      const result = getAdvicesStatus(5, undefined)

      expect(result.hasPublished).toEqual(false)
    })
  })

  describe('hasUnpublished', () => {
    it('should be true when total is greater than publishedCount', () => {
      const result = getAdvicesStatus(10, 4)

      expect(result.hasUnpublished).toEqual(true)
    })

    it('should be false when total is equal to publishedCount', () => {
      const result = getAdvicesStatus(5, 5)

      expect(result.hasUnpublished).toEqual(false)
    })

    it('should be false when total is less than publishedCount', () => {
      const result = getAdvicesStatus(2, 5)

      expect(result.hasUnpublished).toEqual(false)
    })

    it('should be false when both counter and arraySize are missing', () => {
      const result = getAdvicesStatus()

      expect(result.hasUnpublished).toEqual(false)
    })
  })
})
