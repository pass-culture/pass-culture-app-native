import { SearchResponse } from 'instantsearch.js'

import { SubcategoryIdEnum } from 'api/gen'
import { getMoviesOfTheWeek } from 'features/search/pages/Search/ThematicSearch/Cinema/utils'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Offer } from 'shared/offer/types'

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const releasingDateVeryOld = '2009-07-15'

const hitOfferWithReleasingDateFixture = [
  {
    offer: {
      name: 'Harry potter et la coupe de feu',
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      releaseDate: yesterday,
    },
    venue: venueDataTest,
    _geoloc: {
      lat: 2,
      lng: 2,
    },
    objectID: '3',
  },
  {
    offer: {
      name: 'Harry potter et le prince de sang-mêlé',
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      releaseDate: releasingDateVeryOld,
    },
    venue: venueDataTest,
    _geoloc: {
      lat: 2,
      lng: 2,
    },
    objectID: '4',
  },
]

const mockMovies = {
  hits: hitOfferWithReleasingDateFixture,
} as unknown as SearchResponse<Offer>

describe('getMoviesOfTheWeek', () => {
  it('should return offer with releasingDate in the last 7 days', () => {
    const result = getMoviesOfTheWeek(mockMovies)
    const hitOfferWithReleasingDateWithinLast7Days = hitOfferWithReleasingDateFixture[0]

    expect(result).toEqual({ ...mockMovies, hits: [hitOfferWithReleasingDateWithinLast7Days] })
  })
})
