import { getUnixTime } from 'date-fns'

import { CategoryIdEnum, NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { mockedMultipleVenueOffers } from 'fixtures/venueOffers'
import { transformOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { selectVenueOffers } from 'queries/selectors/selectVenueOffers'
import { mockBuilder } from 'tests/mockBuilder'

describe('selectVenueOffers', () => {
  it('should return properly structured data', () => {
    const result = selectVenueOffers({
      venueOffers: mockedMultipleVenueOffers,
      transformHits: transformOfferHit(),
    })

    const expectedHitsResult = mockedMultipleVenueOffers
      .flatMap((hits) => hits?.hits ?? [])
      .map(transformOfferHit())

    expect(result).toMatchObject({
      hits: expectedHitsResult,
      nbHits: expectedHitsResult.length,
      headlineOffer: expectedHitsResult[2],
    })
  })

  describe('filtering behavior', () => {
    const offerWithImage = mockBuilder.algoliaOfferResponse({
      objectID: '123',
      offer: { thumbUrl: 'https://example.com/image.jpg' },
    })

    const offerWithoutImage = mockBuilder.algoliaOfferResponse({
      objectID: '456',
      offer: { thumbUrl: '' },
    })

    const mockVenueOffers = [
      { hits: [offerWithImage], nbHits: 1 },
      { hits: [offerWithoutImage], nbHits: 1 },
      { hits: [], nbHits: 0 },
    ]

    it('should exclude offers without images when includeHitsWithoutImage is false', () => {
      const result = selectVenueOffers({
        venueOffers: mockVenueOffers,
        transformHits: transformOfferHit(),
        includeHitsWithoutImage: false,
      })

      expect(result.hits).toHaveLength(1)
      expect(result.hits[0]?.offer.thumbUrl).toBe(offerWithImage.offer.thumbUrl)
    })

    it('should include all offers when includeHitsWithoutImage is true', () => {
      const result = selectVenueOffers({
        venueOffers: mockVenueOffers,
        transformHits: transformOfferHit(),
        includeHitsWithoutImage: true,
      })

      expect(result.hits).toHaveLength(2)
      expect(result.hits[0]?.offer.thumbUrl).toBeDefined()
      expect(result.hits[1]?.offer.thumbUrl).toBeUndefined()
    })
  })

  describe('sorting behavior for events', () => {
    const mockMapping = {
      [SubcategoryIdEnum.CONFERENCE]: {
        isEvent: true,
        categoryId: CategoryIdEnum.CONFERENCE,
        nativeCategoryId: NativeCategoryIdEnumv2.CONFERENCES,
      },
      [SubcategoryIdEnum.EVENEMENT_PATRIMOINE]: {
        isEvent: true,
        categoryId: CategoryIdEnum.CONFERENCE,
        nativeCategoryId: NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE,
      },
    } as SubcategoriesMapping

    const venueOffer1 = mockBuilder.algoliaOfferResponse({
      objectID: '123',
      offer: {
        subcategoryId: SubcategoryIdEnum.CONFERENCE,
        dates: [
          getUnixTime(new Date('2024-12-15T14:00:00')),
          getUnixTime(new Date('2024-12-10T10:00:00')),
        ],
      },
    })

    const venueOffer2 = mockBuilder.algoliaOfferResponse({
      objectID: '456',
      offer: {
        subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
        dates: [getUnixTime(new Date('2024-12-05T18:30:00'))],
      },
    })

    const mockVenueOffers = [
      { hits: [venueOffer1], nbHits: 1 },
      { hits: [venueOffer2], nbHits: 1 },
      { hits: [], nbHits: 0 },
    ]

    it('should sort offers by date when all offers are events and not cinema', () => {
      const result = selectVenueOffers({
        venueOffers: mockVenueOffers,
        transformHits: transformOfferHit(),
        includeHitsWithoutImage: true,
        mapping: mockMapping,
      })

      expect(result.hits[0]?.objectID).toBe(venueOffer2.objectID)
      expect(result.hits[1]?.objectID).toBe(venueOffer1.objectID)
    })
  })

  describe('headline offer', () => {
    it('should include headline offer when present', () => {
      const headlineOffer = mockBuilder.algoliaOfferResponse({
        objectID: 'headline-123',
      })

      const mockVenueOffers = [
        { hits: [], nbHits: 0 },
        { hits: [], nbHits: 0 },
        { hits: [headlineOffer], nbHits: 1 },
      ]

      const result = selectVenueOffers({
        venueOffers: mockVenueOffers,
        transformHits: transformOfferHit(),
      })

      expect(result.headlineOffer?.objectID).toBe(headlineOffer.objectID)
    })
  })
})
