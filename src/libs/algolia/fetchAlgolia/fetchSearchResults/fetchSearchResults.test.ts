import algoliasearch from 'algoliasearch'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { fetchSearchResults } from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { LocationMode, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'

jest.mock('algoliasearch')

const mockMultipleQueries = algoliasearch('', '').multipleQueries

const userLocation = { latitude: 42, longitude: 43 }

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669726, latitude: 5.16176 },
}

const venue = mockedSuggestedVenue

describe('fetchSearchResults', () => {
  it('should execute multi query with venues playlist search newest index when there is not location filter', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: 'all',
        aroundPlaceRadius: 'all',
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
      {
        params: {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search newest index when location type is EVERYWHERE and user not share his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: MAX_RADIUS,
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
      {
        params: {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: 'algoliaOffersIndexName',
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is EVERYWHERE and user shares his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: MAX_RADIUS,
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '42, 43',
          aroundRadius: 'all',
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
          aroundLatLng: '42, 43',
          aroundRadius: 'all',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
      {
        params: {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          aroundRadius: 'all',
          aroundLatLng: '42, 43',
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '42, 43',
          aroundRadius: 'all',
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is AROUND_ME and user shares his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation,
        selectedLocationMode: LocationMode.AROUND_ME,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: 'all',
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '42, 43',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
      {
        params: {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          aroundRadius: 100000,
          aroundLatLng: '42, 43',
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '42, 43',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is PLACE and user shares his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation: kourou.geolocation,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: MAX_RADIUS,
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '5.16176, -52.669726',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
      {
        params: {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          aroundRadius: 100000,
          aroundLatLng: '5.16176, -52.669726',
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '5.16176, -52.669726',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is PLACE and user not share his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation: kourou.geolocation,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        aroundMeRadius: 'all',
        aroundPlaceRadius: MAX_RADIUS,
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '5.16176, -52.669726',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
      {
        params: {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          aroundRadius: 100000,
          aroundLatLng: '5.16176, -52.669726',
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          aroundLatLng: '5.16176, -52.669726',
          aroundRadius: 100000,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index when location type is VENUE and user shares his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: {
        query,
        venue,
      } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: MAX_RADIUS,
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
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
      {
        params: {
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: 'algoliaOffersIndexName',
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with venues playlist search index newest when venue is defined and user not share his position', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: {
        query,
        venue,
      } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: 'all',
        aroundPlaceRadius: 'all',
      },
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        params: {
          aroundRadius: 100000,
          aroundLatLng: '5.16186, -52.669736',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
      {
        params: {
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: 'algoliaOffersIndexName',
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })

  it('should execute multi query with accessibilities filters when user has selected accessibility filters', () => {
    const query = 'searched query'

    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: {
        userLocation: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: 'all',
        aroundPlaceRadius: 'all',
      },
      isUserUnderage: false,
      disabilitiesProperties: {
        isMentalDisabilityCompliant: true,
        isVisualDisabilityCompliant: false,
        isAudioDisabilityCompliant: true,
        isMotorDisabilityCompliant: false,
      },
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          facetFilters: [
            ['offer.isEducational:false'],
            ['venue.isAudioDisabilityCompliant:true'],
            ['venue.isMentalDisabilityCompliant:true'],
          ],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        params: {
          facetFilters: [['audio_disability:true'], ['mental_disability:true']],
          aroundRadius: 'all',
          clickAnalytics: true,
          hitsPerPage: 35,
          page: 0,
        },
        query: 'searched query',
      },
      {
        params: {
          facetFilters: [
            ['offer.isEducational:false'],
            ['venue.isAudioDisabilityCompliant:true'],
            ['venue.isMentalDisabilityCompliant:true'],
          ],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        facets: [
          'offer.bookMacroSection',
          'offer.movieGenres',
          'offer.musicType',
          'offer.nativeCategoryId',
          'offer.showType',
        ],
        indexName: 'algoliaOffersIndexName',
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
          distinct: false,
          facetFilters: [
            ['offer.isEducational:false'],
            ['venue.isAudioDisabilityCompliant:true'],
            ['venue.isMentalDisabilityCompliant:true'],
          ],
          hitsPerPage: 1000,
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
          typoTolerance: false,
        },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })
})
