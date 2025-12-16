import algoliasearch from '__mocks__/algoliasearch'
import { VenuesModuleParameters } from 'features/home/types'
import { RADIUS_FILTERS } from 'libs/algolia/enums/radiusFiltersEnums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { fetchVenuesModules } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

const { multipleQueries } = algoliasearch()
const mockUserLocation: Position = { latitude: 2, longitude: 2 }

const defaultPlaylistParams = {
  title: 'Playlist de lieux',
  hitsPerPage: 15,
  selectedLocationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: RADIUS_FILTERS.UNLIMITED_RADIUS,
  aroundPlaceRadius: RADIUS_FILTERS.UNLIMITED_RADIUS,
  userLocation: undefined,
}

const mockedDefaultParamList: (VenuesModuleParameters & BuildLocationParameterParams)[] = [
  defaultPlaylistParams,
]

const mockedParamListPartiallyGeolocated: (VenuesModuleParameters &
  BuildLocationParameterParams)[] = [
  {
    ...defaultPlaylistParams,
    aroundMeRadius: 50,
    aroundPlaceRadius: 50,
  },
]

const mockedParamListGeolocated: (VenuesModuleParameters & BuildLocationParameterParams)[] = [
  {
    ...defaultPlaylistParams,
    selectedLocationMode: LocationMode.AROUND_ME,
    aroundMeRadius: 50,
    aroundPlaceRadius: 50,
    userLocation: mockUserLocation,
  },
]

const defaultFacetFilters = [['has_at_least_one_bookable_offer:true'], ['is_open_to_public:true']]

describe('fetchVenuesModule', () => {
  it('should fetch with default venue module params', () => {
    fetchVenuesModules(mockedDefaultParamList)

    expect(multipleQueries).toHaveBeenCalledWith([
      {
        indexName: 'algoliaVenuesIndexName',
        params: {
          attributesToHighlight: [],
          facetFilters: defaultFacetFilters,
          hitsPerPage: 15,
        },
        query: '',
      },
    ])
  })

  it('should fetch without location params when partial geolocated venue module params provided', () => {
    fetchVenuesModules(mockedParamListPartiallyGeolocated)

    expect(multipleQueries).toHaveBeenCalledWith([
      {
        indexName: 'algoliaVenuesIndexName',
        params: {
          attributesToHighlight: [],
          facetFilters: defaultFacetFilters,
          hitsPerPage: 15,
        },
        query: '',
      },
    ])
  })

  it('should fetch with location params when geolocated venue module params provided', () => {
    fetchVenuesModules(mockedParamListGeolocated)

    expect(multipleQueries).toHaveBeenCalledWith([
      {
        indexName: 'algoliaVenuesIndexName',
        params: {
          aroundLatLng: '2, 2',
          aroundRadius: 50000,
          attributesToHighlight: [],
          facetFilters: defaultFacetFilters,
          hitsPerPage: 15,
        },
        query: '',
      },
    ])
  })
})
