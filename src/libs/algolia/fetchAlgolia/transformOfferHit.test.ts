import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { AlgoliaOffer } from 'libs/algolia/types'

import { filterValidOfferHit, parseThumbUrl } from './transformOfferHit'

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

describe('filterValidOfferHit', () => {
  it('should return true when offer is valid', () => {
    const validOffer: AlgoliaOffer = {
      offer: offerResponseSnap,
      _geoloc: { lat: 48.8566, lng: 2.3522 },
      objectID: '123',
      venue: {},
    }

    expect(filterValidOfferHit(validOffer)).toEqual(true)
  })

  it('should return false when offer is undefined', () => {
    expect(filterValidOfferHit(undefined)).toBe(false)
  })

  it('should return false when hit has not offer', () => {
    const invalidOffer: Partial<AlgoliaOffer> = {
      _geoloc: { lat: 48.8566, lng: 2.3522 },
      objectID: '123',
      venue: {},
    }

    expect(filterValidOfferHit(invalidOffer as AlgoliaOffer)).toBe(false)
  })
})
