import { parseThumbUrl } from './transformOfferHit'

describe('parseThumbUrl()', () => {
  it.each`
    thumbUrl               | urlPrefix    | expected
    ${undefined}           | ${'newpath'} | ${undefined}
    ${'oldpath/thumbs/ID'} | ${undefined} | ${'oldpath/thumbs/ID'}
    ${'oldpath/thumbs/ID'} | ${'newpath'} | ${'newpath/thumbs/ID'}
    ${'/thumbs/ID'}        | ${'newpath'} | ${'newpath/thumbs/ID'}
    ${'newpath/thumbs/ID'} | ${'newpath'} | ${'newpath/thumbs/ID'}
  `(
    'should parse the image url from the thumbUrl=$thumbUrl stored in Algolia',
    ({ thumbUrl, urlPrefix, expected }) => {
      expect(parseThumbUrl(thumbUrl, urlPrefix)).toBe(expected)
    }
  )
})
