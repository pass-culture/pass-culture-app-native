import { getOfferImageUrls } from 'features/offer/helpers/getOfferImageUrls/getOfferImageUrls'

describe('getOfferImageUrls', () => {
  it('should return an empty array when images object is empty', () => {
    const images = {}
    const result = getOfferImageUrls(images)

    expect(result).toEqual([])
  })

  it('should return an array of image URLs', () => {
    const images = {
      image1: { url: 'url1' },
      image2: { url: 'url2' },
      image3: { url: 'url3' },
    }
    const result = getOfferImageUrls(images)

    expect(result).toEqual(['url1', 'url2', 'url3'])
  })
})
