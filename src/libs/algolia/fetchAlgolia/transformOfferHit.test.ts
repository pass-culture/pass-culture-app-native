import { SubcategoryIdEnum } from 'api/gen'
import { mockSubcategoriesMapping } from 'features/headlineOffer/fixtures/mockMapping'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockedAlgoliaVenueOffersResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer } from 'libs/algolia/types'

import {
  determineAllOffersAreEventsAndNotCinema,
  filterValidOfferHit,
  parseThumbUrl,
  sortHitOffersByDate,
} from './transformOfferHit'

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

describe('sortHitOffersByDate', () => {
  it('should accept empty params', () => {
    expect(sortHitOffersByDate(undefined, undefined)).toEqual(0)
  })

  describe('when hits offer have mutliple dates array', () => {
    it('should return negative number when first date of dates from left hand offer is bigger than right hand', () => {
      const mockedHits = [
        {
          ...mockedAlgoliaVenueOffersResponse[0],
          offer: { ...mockedAlgoliaVenueOffersResponse[0].offer, dates: [1, 2] },
        },
        {
          ...mockedAlgoliaVenueOffersResponse[1],
          offer: { ...mockedAlgoliaVenueOffersResponse[1].offer, dates: [2] },
        },
      ]

      expect(sortHitOffersByDate(mockedHits[0], mockedHits[1])).toEqual(-1)
    })

    it('should return 0 when both smallest dates are the same', () => {
      const mockedHits = [
        {
          ...mockedAlgoliaVenueOffersResponse[0],
          offer: { ...mockedAlgoliaVenueOffersResponse[0].offer, dates: [2, 1] },
        },
        {
          ...mockedAlgoliaVenueOffersResponse[1],
          offer: { ...mockedAlgoliaVenueOffersResponse[1].offer, dates: [10, 28, 1] },
        },
      ]

      expect(sortHitOffersByDate(mockedHits[0], mockedHits[1])).toEqual(0)
    })

    it('should return negative number when first date of dates from left hand offer is smaller than right hand', () => {
      const mockedHits = [
        {
          ...mockedAlgoliaVenueOffersResponse[0],
          offer: { ...mockedAlgoliaVenueOffersResponse[0].offer, dates: [4, 3, 2] },
        },
        {
          ...mockedAlgoliaVenueOffersResponse[1],
          offer: { ...mockedAlgoliaVenueOffersResponse[1].offer, dates: [18, 34, 3] },
        },
      ]

      expect(sortHitOffersByDate(mockedHits[0], mockedHits[1])).toEqual(-1)
    })

    it('should return 0 when both dates are missing', () => {
      const mockedHits = [
        {
          ...mockedAlgoliaVenueOffersResponse[0],
          offer: { ...mockedAlgoliaVenueOffersResponse[0].offer, dates: [] },
        },
        {
          ...mockedAlgoliaVenueOffersResponse[1],
          offer: { ...mockedAlgoliaVenueOffersResponse[1].offer, dates: [] },
        },
      ]

      expect(sortHitOffersByDate(mockedHits[0], mockedHits[1])).toEqual(0)
    })
  })
})

describe('determineAllOffersAreEventsAndNotCinema', () => {
  it('should return false when mapping is undefined', () => {
    expect(
      determineAllOffersAreEventsAndNotCinema(mockedAlgoliaVenueOffersResponse, undefined)
    ).toEqual(false)
  })

  it('should return true when all offers are event without cinema projection', () => {
    expect(
      determineAllOffersAreEventsAndNotCinema(
        mockedAlgoliaVenueOffersResponse,
        mockSubcategoriesMapping
      )
    ).toEqual(true)
  })

  it('should return false when all offers are event with cinema projection', () => {
    const mockedAlgoliamockedAlgoliaVenueOffersResponseWithCinema = [
      {
        ...mockedAlgoliaVenueOffersResponse[0],
        offer: {
          ...mockedAlgoliaVenueOffersResponse[0].offer,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
      ...mockedAlgoliaVenueOffersResponse,
    ]

    expect(
      determineAllOffersAreEventsAndNotCinema(
        mockedAlgoliamockedAlgoliaVenueOffersResponseWithCinema,
        mockSubcategoriesMapping
      )
    ).toEqual(false)
  })

  it('should return false when at least one offer is not event', () => {
    const mockedAlgoliamockedAlgoliaVenueOffersResponseWithCinema = [
      {
        ...mockedAlgoliaVenueOffersResponse[0],
        offer: {
          ...mockedAlgoliaVenueOffersResponse[0].offer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        },
      },
      ...mockedAlgoliaVenueOffersResponse,
    ]

    expect(
      determineAllOffersAreEventsAndNotCinema(
        mockedAlgoliamockedAlgoliaVenueOffersResponseWithCinema,
        mockSubcategoriesMapping
      )
    ).toEqual(false)
  })
})
