import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'

describe('calculateCarouselIndex', () => {
  it('should increase the index by 1', () => {
    const index = calculateCarouselIndex({ currentIndex: 0, direction: 1, maxIndex: 5 })

    expect(index).toBe(1)
  })

  it('should decrease the index by 1', () => {
    const index = calculateCarouselIndex({ currentIndex: 3, direction: -1, maxIndex: 5 })

    expect(index).toBe(2)
  })

  it('should not exceed the maximum index', () => {
    const index = calculateCarouselIndex({ currentIndex: 5, direction: 1, maxIndex: 5 })

    expect(index).toBe(5)
  })

  it('should not go below the minimum index', () => {
    const index = calculateCarouselIndex({ currentIndex: 0, direction: -1, maxIndex: 5 })

    expect(index).toBe(0)
  })
})
