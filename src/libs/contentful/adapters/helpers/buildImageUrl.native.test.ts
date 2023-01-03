import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'

describe('buildImageUrl', () => {
  it('should return a formatted url', () => {
    const rawUrl = '//myUrl.com'
    const formattedUrl = 'https://myUrl.com'

    expect(buildImageUrl(rawUrl)).toEqual(formattedUrl)
  })
})
