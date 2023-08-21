import algoliasearch from 'algoliasearch'

import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { Venue } from 'features/venue/types'
import { fetchOffersAndVenues } from 'libs/algolia/fetchAlgolia/fetchOffersAndVenues/fetchOffersAndVenues'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { SuggestedPlace } from 'libs/place'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

jest.mock('algoliasearch')

const mockMultipleQueries = algoliasearch('', '').multipleQueries

const userLocation = { latitude: 42, longitude: 43 }

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669726, latitude: 5.16176 },
}
const venue: Venue = mockedSuggestedVenues[0]

describe('fetchOffersAndVenues', () => {
  it('should execute multi query with venues playlist search newest index when there is not location filter', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: { query } as SearchQueryParameters,
      userLocation: null,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        params: { aroundRadius: 'all', clickAnalytics: true, hitsPerPage: 35, page: 0 },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search newest index when location type is EVERYWHERE', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: {
        query,
        locationFilter: { locationType: LocationType.EVERYWHERE },
      } as SearchQueryParameters,
      userLocation: null,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        params: { aroundRadius: 'all', clickAnalytics: true, hitsPerPage: 35, page: 0 },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is AROUND_ME and user shares his position', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: {
        query,
        locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS },
      } as SearchQueryParameters,
      userLocation,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '42, 43',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        params: {
          aroundRadius: 100000,
          aroundLatLng: '42, 43',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is PLACE and user shares his position', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: {
        query,
        locationFilter: {
          locationType: LocationType.PLACE,
          place: kourou,
          aroundRadius: MAX_RADIUS,
        },
      } as SearchQueryParameters,
      userLocation,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '5.16176, -52.669726',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        params: {
          aroundRadius: 100000,
          aroundLatLng: '5.16176, -52.669726',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is PLACE and user not share his position', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: {
        query,
        locationFilter: {
          locationType: LocationType.PLACE,
          place: kourou,
          aroundRadius: MAX_RADIUS,
        },
      } as SearchQueryParameters,
      userLocation: null,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '5.16176, -52.669726',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        params: {
          aroundRadius: 100000,
          aroundLatLng: '5.16176, -52.669726',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is VENUE and user shares his position', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: {
        query,
        locationFilter: {
          locationType: LocationType.VENUE,
          venue,
        },
      } as SearchQueryParameters,
      userLocation,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        params: {
          aroundRadius: 100000,
          aroundLatLng: '5.16186, -52.669736',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is VENUE and user not share his position', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: {
        query,
        locationFilter: {
          locationType: LocationType.VENUE,
          venue,
        },
      } as SearchQueryParameters,
      userLocation: null,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        params: {
          aroundRadius: 100000,
          aroundLatLng: '5.16186, -52.669736',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })
})
