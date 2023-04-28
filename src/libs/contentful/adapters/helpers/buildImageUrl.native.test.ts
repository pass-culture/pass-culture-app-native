import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'

describe('buildImageUrl', () => {
  it('should return a formatted url', () => {
    const rawUrl = '//myUrl.com'
    const formattedUrl = 'https://myUrl.com'

    expect(buildImageUrl(rawUrl)).toEqual(formattedUrl)
  })

  it('should return undefined when an empty string is provided', () => {
    const rawUrl = ''

    expect(buildImageUrl(rawUrl)).toEqual(undefined)
  })

  it('should return undefined when nothing is provided', () => {
    expect(buildImageUrl(undefined)).toEqual(undefined)
  })
})
