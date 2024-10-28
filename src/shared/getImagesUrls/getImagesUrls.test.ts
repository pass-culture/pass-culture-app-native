import { getImagesUrls } from 'shared/getImagesUrls/getImagesUrls'

describe('getImagesUrls', () => {
  it('should return an empty array when images object is empty', () => {
    const images = {}
    const result = getImagesUrls(images)

    expect(result).toEqual([])
  })

  it('should return an array of image URLs', () => {
    const images = {
      image1: { url: 'url1' },
      image2: { url: 'url2' },
      image3: { url: 'url3' },
    }
    const result = getImagesUrls(images)

    expect(result).toEqual(['url1', 'url2', 'url3'])
  })
})
