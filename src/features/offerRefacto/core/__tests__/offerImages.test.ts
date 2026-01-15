import { PORTRAIT_DIMENSIONS, RATIO_PORTRAIT, RATIO_SQUARE } from 'features/offerRefacto/constants'
import { calculateCarouselIndex, computeImageStyle } from 'features/offerRefacto/core'

describe('calculateCarouselIndex', () => {
  it('should increase the index by 1', () => {
    const index = calculateCarouselIndex({ currentIndex: 0, direction: 1, maxIndex: 5 })

    expect(index).toEqual(1)
  })

  it('should decrease the index by 1', () => {
    const index = calculateCarouselIndex({ currentIndex: 3, direction: -1, maxIndex: 5 })

    expect(index).toEqual(2)
  })

  it('should not exceed the maximum index', () => {
    const index = calculateCarouselIndex({ currentIndex: 5, direction: 1, maxIndex: 5 })

    expect(index).toEqual(5)
  })

  it('should not go below the minimum index', () => {
    const index = calculateCarouselIndex({ currentIndex: 0, direction: -1, maxIndex: 5 })

    expect(index).toEqual(0)
  })
})

describe('computeImageStyle', () => {
  it('should return music support dimensions and square aspect ratio when isMusicSupport is true', () => {
    const result = computeImageStyle(true, 100, 8)

    expect(result).toEqual({
      height: PORTRAIT_DIMENSIONS.music.height,
      width: PORTRAIT_DIMENSIONS.music.width,
      maxWidth: 100,
      aspectRatio: RATIO_SQUARE,
      borderRadius: 8,
    })
  })

  it('should return default dimensions and portrait aspect ratio when isMusicSupport is false', () => {
    const result = computeImageStyle(false, 100, 8)

    expect(result).toEqual({
      height: PORTRAIT_DIMENSIONS.default.height,
      width: PORTRAIT_DIMENSIONS.default.width,
      maxWidth: 100,
      aspectRatio: RATIO_PORTRAIT,
      borderRadius: 8,
    })
  })
})
