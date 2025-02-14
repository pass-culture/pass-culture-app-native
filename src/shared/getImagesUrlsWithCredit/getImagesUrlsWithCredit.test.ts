import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'

describe('getImagesUrlsWithCredit', () => {
  it('should return an empty array when images object is empty', () => {
    const images = {}
    const result = getImagesUrlsWithCredit(images)

    expect(result).toEqual([])
  })

  it('should return an array of image URLs and possibly a credit', () => {
    const images = {
      image1: { url: 'url1' },
      image2: { url: 'url2' },
      image3: { url: 'url3', credit: 'Jul' },
    }
    const result = getImagesUrlsWithCredit(images)

    expect(result).toEqual([{ url: 'url1' }, { url: 'url2' }, { url: 'url3', credit: 'Jul' }])
  })
})
