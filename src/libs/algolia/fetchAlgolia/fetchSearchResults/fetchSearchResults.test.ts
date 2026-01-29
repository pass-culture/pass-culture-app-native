import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { fetchSearchResults } from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { LocationMode, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'

jest.mock('libs/algolia/fetchAlgolia/clients')
const mockSearch = client.search as jest.Mock

const userPosition = { latitude: 42, longitude: 43 }

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669726, latitude: 5.16176 },
}
const query = 'searched query'

const venue = mockedSuggestedVenue

const everywhereParams: BuildLocationParameterParams = {
  userLocation: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: 'all',
  aroundPlaceRadius: 'all',
  geolocPosition: null,
}

const everywhereGeolocatedParams: BuildLocationParameterParams = {
  userLocation: undefined,
  selectedLocationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: MAX_RADIUS,
  aroundPlaceRadius: 'all',
  geolocPosition: userPosition,
}

const aroundMeParams: BuildLocationParameterParams = {
  userLocation: userPosition,
  selectedLocationMode: LocationMode.AROUND_ME,
  aroundMeRadius: MAX_RADIUS,
  aroundPlaceRadius: 'all',
  geolocPosition: userPosition,
}

const aroundPlaceParams: BuildLocationParameterParams = {
  userLocation: kourou.geolocation,
  selectedLocationMode: LocationMode.AROUND_PLACE,
  aroundMeRadius: 'all',
  aroundPlaceRadius: MAX_RADIUS,
  geolocPosition: null,
}

const aroundPlaceGeolocatedParams = {
  userLocation: kourou.geolocation,
  selectedLocationMode: LocationMode.AROUND_PLACE,
  aroundMeRadius: MAX_RADIUS,
  aroundPlaceRadius: MAX_RADIUS,
  geolocPosition: userPosition,
}

describe('fetchSearchResults', () => {
  beforeEach(() => {
    mockSearch.mockResolvedValue({ results: [] })
  })

  it('should execute multi query with venues playlist search newest index when there is not location filter', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: everywhereParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 'all',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search newest index when location type is EVERYWHERE and user is not sharing its position', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: everywhereParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 'all',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search index when location type is EVERYWHERE and user shares his position', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: everywhereGeolocatedParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 'all',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search index when location type is AROUND_ME and user shares his position', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: aroundMeParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '42, 43',
        aroundRadius: 100000,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 100000,
        aroundLatLng: '42, 43',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '42, 43',
        aroundRadius: 100000,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        aroundLatLng: '42, 43',
        aroundRadius: 100000,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search index when location type is PLACE and user shares his position', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: aroundPlaceGeolocatedParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '5.16176, -52.669726',
        aroundRadius: 100000,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 100000,
        aroundLatLng: '5.16176, -52.669726',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '5.16176, -52.669726',
        aroundRadius: 100000,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        aroundLatLng: '5.16176, -52.669726',
        aroundRadius: 100000,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search index when location type is PLACE and user not share his position', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: aroundPlaceParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '5.16176, -52.669726',
        aroundRadius: 100000,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 100000,
        aroundLatLng: '5.16176, -52.669726',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        aroundLatLng: '5.16176, -52.669726',
        aroundRadius: 100000,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        aroundLatLng: '5.16176, -52.669726',
        aroundRadius: 100000,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search index when location type is VENUE and user shares his position', () => {
    fetchSearchResults({
      parameters: {
        query,
        venue,
      } as SearchQueryParameters,
      buildLocationParameterParams: everywhereGeolocatedParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 100000,
        aroundLatLng: '5.16186, -52.669736',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [
          ['offer.isEducational:false'],
          ['artists.name:searched query'],
          ['venue.id:5543'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with venues playlist search index newest when venue is defined and user not share his position', () => {
    fetchSearchResults({
      parameters: {
        query,
        venue,
      } as SearchQueryParameters,
      buildLocationParameterParams: everywhereParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 100000,
        aroundLatLng: '5.16186, -52.669736',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [
          ['offer.isEducational:false'],
          ['artists.name:searched query'],
          ['venue.id:5543'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with accessibilities filters when user has selected accessibility filters', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: everywhereParams,
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
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        facetFilters: [
          ['is_open_to_public:true'],
          ['audio_disability:true'],
          ['mental_disability:true'],
        ],
        aroundRadius: 'all',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [
          ['offer.isEducational:false'],
          ['venue.isAudioDisabilityCompliant:true'],
          ['venue.isMentalDisabilityCompliant:true'],
        ],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [
          ['offer.isEducational:false'],
          ['artists.name:searched query'],
          ['venue.isAudioDisabilityCompliant:true'],
          ['venue.isMentalDisabilityCompliant:true'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query with aroundPrecision param if provided', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: everywhereParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
      aroundPrecision: [
        { from: 0, value: 1000 },
        { from: 1000, value: 4000 },
        { from: 5000, value: 10000 },
      ],
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        aroundPrecision: [
          { from: 0, value: 1000 },
          { from: 1000, value: 4000 },
          { from: 5000, value: 10000 },
        ],
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 'all',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })

  it('should execute multi query without aroundPrecision param if aroundPrecision is 0 (eq: O or not provided)', () => {
    fetchSearchResults({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams: everywhereParams,
      isUserUnderage: false,
      disabilitiesProperties: defaultDisabilitiesProperties,
      aroundPrecision: 0,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST,
        facetFilters: [['is_open_to_public:true']],
        aroundRadius: 'all',
        clickAnalytics: true,
        hitsPerPage: 35,
        page: 0,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
        distinct: false,
        facetFilters: [['offer.isEducational:false']],
        hitsPerPage: 100,
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        typoTolerance: false,
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        attributesToRetrieve: ['artists'],
        facetFilters: [['offer.isEducational:false'], ['artists.name:searched query']],
        numericFilters: [['offer.prices: 0 TO 300']],
        hitsPerPage: 100,
        query: '',
      },
    ]

    expect(mockSearch).toHaveBeenCalledWith({ requests: expectedResult })
  })
})
