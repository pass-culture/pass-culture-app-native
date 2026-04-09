import { mapAlgoliaVenueToVenue } from 'features/search/queries/useSearchOffersQuery/helpers/mapAlgoliaVenueToVenue'
import {
  getFlattenHits,
  getLastPage,
  getNbHits,
  getUniqueVenues,
  getUserData,
} from 'features/search/queries/useSearchOffersQuery/utils'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'

const transformHits = (hit: AlgoliaOffer<HitOffer>) => hit

const mockHit = mockedAlgoliaResponse.hits[0]

const anotherMockHit: AlgoliaOffer = {
  ...mockHit,
  objectID: '999999',
  venue: {
    ...mockHit.venue,
    id: 2,
    name: 'Lieu 2',
    publicName: 'Lieu 2',
  },
}

const makeOffersResponse = (overrides = {}) => ({
  ...mockedAlgoliaResponse,
  nbHits: mockedAlgoliaResponse.hits.length,
  userData: null,
  ...overrides,
})

const createPage = (offersOverrides = {}, duplicatedOverrides = {}) => ({
  offersResponse: makeOffersResponse(offersOverrides),
  duplicatedOffersResponse: makeOffersResponse(duplicatedOverrides),
})

describe('selectSearchOffers helpers', () => {
  describe('getFlattenHits', () => {
    it('should flatten hits across pages', () => {
      const pages = [
        createPage({ hits: [mockHit] }, { hits: [mockHit] }),
        createPage({ hits: [anotherMockHit] }, { hits: [anotherMockHit] }),
      ]

      const offers = getFlattenHits(pages, transformHits, 'offersResponse')
      const duplicated = getFlattenHits(pages, transformHits, 'duplicatedOffersResponse')

      expect(offers).toEqual([mockHit, anotherMockHit])
      expect(duplicated).toEqual([mockHit, anotherMockHit])
    })

    it('should return an empty array if no hits are present', () => {
      const pages = [createPage({ hits: [] }, { hits: [] })]

      expect(getFlattenHits(pages, transformHits, 'offersResponse')).toEqual([])
      expect(getFlattenHits(pages, transformHits, 'duplicatedOffersResponse')).toEqual([])
    })
  })

  describe('getLastPage', () => {
    it('should return the last page', () => {
      const lastPage = createPage({ hits: [anotherMockHit] })
      const pages = [createPage(), createPage(), lastPage]

      expect(getLastPage(pages)).toEqual(lastPage)
    })

    it('should return undefined if the array is empty', () => {
      expect(getLastPage([])).toBeUndefined()
    })
  })

  describe('getNbHits', () => {
    it('should return nbHits from the first page', () => {
      const firstPage = createPage({ nbHits: 150 })

      expect(getNbHits(firstPage)).toBe(150)
    })

    it('should fallback to flattenedOffersLength if firstPage is undefined', () => {
      expect(getNbHits(undefined, 5)).toBe(5)
    })

    it('should return 0 by default when both firstPage and length are missing', () => {
      expect(getNbHits(undefined)).toBe(0)
    })
  })

  describe('getUniqueVenues', () => {
    it('should deduplicate venues with the same id', () => {
      const result = getUniqueVenues([mockHit, mockHit, mockHit])
      const expected = mapAlgoliaVenueToVenue(mockHit.venue, mockHit._geoloc)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(expected)
    })

    it('should return distinct venues when ids differ', () => {
      const result = getUniqueVenues([mockHit, anotherMockHit])

      expect(result).toHaveLength(2)
    })

    it('should return an empty array if no offers are provided', () => {
      expect(getUniqueVenues([])).toEqual([])
    })
  })

  describe('getUserData', () => {
    it('should return userData from the first page', () => {
      const userData = [{ type: 'banner' }]
      const firstPage = createPage({ userData })

      expect(getUserData(firstPage)).toEqual(userData)
    })

    it('should return null if userData is null', () => {
      expect(getUserData(createPage({ userData: null }))).toBeNull()
    })

    it('should return undefined if firstPage is undefined', () => {
      expect(getUserData(undefined)).toBeUndefined()
    })
  })
})
