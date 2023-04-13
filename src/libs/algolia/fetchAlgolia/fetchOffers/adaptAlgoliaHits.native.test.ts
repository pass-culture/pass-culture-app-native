import { SubcategoryIdEnum } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import {
  adaptAlgoliaHit,
  parseThumbUrl,
} from 'libs/algolia/fetchAlgolia/fetchOffers/adaptAlgoliaHits'
import { offersFixture } from 'libs/algolia/fetchAlgolia/fetchOffers/fixtures/offersFixture'

describe('adaptAlgoliaHits', () => {
  it('should correctly adapt algolia hits ', () => {
    const algoliaHits: AlgoliaHit[] = [
      {
        offer: {
          dates: [1682539200],
          isDigital: false,
          isDuo: true,
          isEducational: false,
          name: 'Punk sous un cathodique',
          prices: [8],
          subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
          thumbUrl: '/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/DBUQ_1',
        },
        _geoloc: { lat: 48.87004, lng: 2.3785 },
        objectID: '13715',
      },
    ]

    const adaptedOffer = adaptAlgoliaHit(algoliaHits)

    expect(adaptedOffer).toStrictEqual([offersFixture[0]])
  })
  it('should correctly adapt geolocation of digital hits ', () => {
    const algoliaHits: AlgoliaHit[] = [
      {
        _geoloc: { lat: 48.87004, lng: 2.3785 },
        objectID: '13848',
        offer: {
          dates: [],
          isDigital: true,
          isDuo: false,
          isEducational: false,
          name: 'Product 501',
          prices: [81.3, 19950],
          subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM,
          thumbUrl: '/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/DBUQ_1',
        },
      },
    ]

    const adaptedOffer = adaptAlgoliaHit(algoliaHits)
    expect(adaptedOffer).toEqual([offersFixture[1]])
  })
})

describe('parseThumbUrl', () => {
  it.each`
    urlPrefix      | thumbUrl                | parsedUrl
    ${'urlPrefix'} | ${'base/thumbs/suffix'} | ${'urlPrefix/thumbs/suffix'}
    ${undefined}   | ${'base/thumbs/suffix'} | ${'base/thumbs/suffix'}
    ${'urlPrefix'} | ${undefined}            | ${undefined}
  `('returns correct result for $urlPrefix', ({ urlPrefix, thumbUrl, parsedUrl }) => {
    const result = parseThumbUrl(thumbUrl, urlPrefix)
    expect(result).toBe(parsedUrl)
  })
})
