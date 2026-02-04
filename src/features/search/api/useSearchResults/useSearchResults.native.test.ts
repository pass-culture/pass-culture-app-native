import { Hit } from 'algoliasearch/lite'

import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as fetchSearchResults from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import * as multipleQueriesAPI from 'libs/algolia/fetchAlgolia/multipleQueries'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaVenue } from 'libs/algolia/types'
import { GeoCoordinates, GeolocPermissionState, GeolocationError } from 'libs/location/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockMultipleQueries = jest.spyOn(multipleQueriesAPI, 'multipleQueries').mockResolvedValue([])

jest.mock('libs/firebase/analytics/analytics')

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates | null
const mockPositionError = null as GeolocationError | null
const mockUserLocation = null as GeoCoordinates | null
const defaultUseLocation = {
  permissionState: GeolocPermissionState.GRANTED,
  geolocPosition: DEFAULT_POSITION,
  geolocPositionError: mockPositionError,
  triggerPositionUpdate: jest.fn(),
  showGeolocPermissionModal: jest.fn(),
  requestGeolocPermission: jest.fn(),
  userLocation: mockUserLocation,
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const setVenuesSpy = jest.spyOn(useVenueMapStore, 'setVenues')

const removeSelectedVenueSpy = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')

const mockDispatch = jest.fn()
const mockFetchSearchResultsResponse = {
  offersResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
  venuesResponse: mockedAlgoliaVenueResponse,
  offerArtistsResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
  duplicatedOffersResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
  redirectUrl: undefined,
}

const fetchSearchResultsSpy = jest.spyOn(fetchSearchResults, 'fetchSearchResults')

const mockReplaceToSearch = jest.fn()
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({
    navigateToSearch: jest.fn(),
    replaceToSearch: mockReplaceToSearch,
  }),
}))

jest.useFakeTimers()

describe('useSearchResults', () => {
  describe('useSearchInfiniteQuery', () => {
    it('should fetch offers, venues and duplicated offers', async () => {
      renderUseSearchResults()

      await waitFor(() => {
        expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
          {
            indexName: 'algoliaOffersIndexName',
            attributesToHighlight: [],
            attributesToRetrieve: offerAttributesToRetrieve,
            clickAnalytics: true,
            facetFilters: [['offer.isEducational:false']],
            hitsPerPage: 20,
            numericFilters: [['offer.prices: 0 TO 300']],
            page: 0,
            query: '',
          },
          {
            indexName: 'algoliaVenuesIndexPlaylistSearch',
            facetFilters: [['is_open_to_public:true']],
            aroundRadius: 'all',
            clickAnalytics: true,
            hitsPerPage: 35,
            page: 0,
            query: '',
          },
          {
            indexName: 'algoliaOffersIndexName',
            attributesToHighlight: [],
            attributesToRetrieve: offerAttributesToRetrieve,
            clickAnalytics: true,
            distinct: false,
            facetFilters: [['offer.isEducational:false']],
            hitsPerPage: 100,
            numericFilters: [['offer.prices: 0 TO 300']],
            page: 0,
            typoTolerance: false,
            query: '',
          },
          {
            indexName: 'algoliaOffersIndexName',
            attributesToRetrieve: ['artists'],
            facetFilters: [['offer.isEducational:false']],
            hitsPerPage: 100,
            numericFilters: [['offer.prices: 0 TO 300']],
            query: '',
          },
        ])
      })
    })

    it('should not fetch again when focus on suggestion changes', async () => {
      const { rerender } = renderUseSearchResults()

      rerender({ searchState: initialSearchState, dispatch: mockDispatch })
      await waitFor(() => {
        expect(mockMultipleQueries).toHaveBeenCalledTimes(1)
      })
    })

    it('should return artist list based on offers', async () => {
      fetchSearchResultsSpy.mockResolvedValueOnce(mockFetchSearchResultsResponse)
      const { result } = renderUseSearchResults()

      await waitFor(() =>
        expect(result.current.hits.artists).toStrictEqual([
          { id: '1', name: 'Artist 1' },
          { id: '2', name: 'Artist 2' },
          { id: '3', name: 'Artist 3' },
          { id: '4', name: 'Artist 4' },
          { id: '5', name: 'Artist 4' },
        ])
      )
    })

    // because of an Algolia issue, sometimes nbHits is at 0 even when there is some hits, cf PC-28287
    it('should show hit numbers even if nbHits is at 0 but hits are not null', async () => {
      fetchSearchResultsSpy.mockResolvedValueOnce(mockFetchSearchResultsResponse)

      const { result } = renderUseSearchResults()

      await waitFor(() => {
        const hitNumber = result.current.nbHits

        expect(hitNumber).toEqual(4)
      })
    })

    it('should reset selected venue in store', async () => {
      renderUseSearchResults()

      await waitFor(() => {
        expect(removeSelectedVenueSpy).toHaveBeenCalledWith()
      })
    })

    describe('When user share his location and received venues from Algolia', () => {
      beforeAll(() => {
        fetchSearchResultsSpy.mockResolvedValueOnce(mockFetchSearchResultsResponse)
        mockUseLocation.mockReturnValue({ ...defaultUseLocation, userLocation: DEFAULT_POSITION })
      })

      it('should set initial venues', async () => {
        renderUseSearchResults()

        await waitFor(() => {
          expect(setVenuesSpy).toHaveBeenCalledWith(
            adaptAlgoliaVenues(mockedAlgoliaVenueResponse.hits)
          )
        })
      })
    })

    describe('When user share his location and not received venues from Algolia', () => {
      beforeAll(() => {
        fetchSearchResultsSpy.mockResolvedValueOnce({
          ...mockFetchSearchResultsResponse,
          venuesResponse: {
            hits: [] as Hit<AlgoliaVenue>[],
            nbHits: 0,
            page: 0,
            nbPages: 0,
            userData: null,
          },
        })
        mockUseLocation.mockReturnValue({ ...defaultUseLocation, userLocation: DEFAULT_POSITION })
      })

      it('should set initial venues as empty array', async () => {
        renderUseSearchResults()

        await waitFor(() => {
          expect(setVenuesSpy).toHaveBeenCalledWith([])
        })
      })
    })

    describe('When user not share his location and received venues from Algolia', () => {
      beforeAll(() => {
        fetchSearchResultsSpy.mockResolvedValueOnce(mockFetchSearchResultsResponse)
        mockUseLocation.mockReturnValue({ ...defaultUseLocation })
      })

      it('should set initial venues as empty array', async () => {
        renderUseSearchResults()

        await waitFor(() => {
          expect(setVenuesSpy).toHaveBeenCalledWith([])
        })
      })
    })
  })
})

const renderUseSearchResults = (newSearchState?: SearchState) =>
  renderHook(
    ({ searchState }: { searchState: SearchState; dispatch?: () => void }) =>
      useSearchInfiniteQuery(searchState),
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: { searchState: newSearchState ?? initialSearchState, dispatch: mockDispatch },
    }
  )
