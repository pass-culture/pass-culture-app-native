import { Hit } from '@algolia/client-search'
import { Dispatch } from 'react'

import algoliasearch from '__mocks__/algoliasearch'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { Action, initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import { initialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { selectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import * as doAlgoliaRedirect from 'libs/algolia/doAlgoliaRedirect'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as fetchSearchResults from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { algoliaFacets } from 'libs/algolia/fixtures/algoliaFacets'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaVenue } from 'libs/algolia/types'
import { GeoCoordinates, GeolocPermissionState, GeolocationError } from 'libs/location'
import { mockSettings } from 'tests/mockSettings'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const { multipleQueries } = algoliasearch()

jest.mock('libs/firebase/analytics/analytics')
mockSettings()

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

const mockSetInitialVenues = jest.spyOn(initialVenuesActions, 'setInitialVenues')

const mockRemoveSelectedVenue = jest.spyOn(selectedVenueActions, 'removeSelectedVenue')

const mockDispatch = jest.fn()
const mockFetchSearchResultsResponse = {
  offersResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
  venuesResponse: mockedAlgoliaVenueResponse,
  facetsResponse: algoliaFacets,
  duplicatedOffersResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
  redirectUrl: undefined,
}

const fetchSearchResultsSpy = jest.spyOn(fetchSearchResults, 'fetchSearchResults')
const doAlgoliaRedirectSpy = jest.spyOn(doAlgoliaRedirect, 'doAlgoliaRedirect')

const mockReplaceToSearch = jest.fn()
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({
    navigateToSearch: jest.fn(),
    replaceToSearch: mockReplaceToSearch,
  }),
}))

describe('useSearchResults', () => {
  describe('useSearchInfiniteQuery', () => {
    it('should fetch offers, venues and all facets', async () => {
      renderUseSearchResults()

      await waitFor(() => {
        expect(multipleQueries).toHaveBeenNthCalledWith(1, [
          {
            indexName: 'algoliaOffersIndexName',
            params: {
              attributesToHighlight: [],
              attributesToRetrieve: offerAttributesToRetrieve,
              clickAnalytics: true,
              facetFilters: [['offer.isEducational:false']],
              hitsPerPage: 20,
              numericFilters: [['offer.prices: 0 TO 300']],
              page: 0,
            },
            query: '',
          },
          {
            indexName: 'algoliaVenuesIndexPlaylistSearch',
            params: { aroundRadius: 'all', clickAnalytics: true, hitsPerPage: 35, page: 0 },
            query: '',
          },
          {
            facets: [
              'offer.bookMacroSection',
              'offer.movieGenres',
              'offer.musicType',
              'offer.nativeCategoryId',
              'offer.showType',
            ],
            indexName: 'algoliaOffersIndexName',
            params: {
              facetFilters: [['offer.isEducational:false']],
              hitsPerPage: 20,
              numericFilters: [['offer.prices: 0 TO 300']],
              page: 0,
            },
            query: '',
          },
          {
            indexName: 'algoliaOffersIndexName',
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
            query: '',
          },
        ])
      })
    })

    it('should not fetch again when focus on suggestion changes', async () => {
      const { rerender } = renderUseSearchResults()

      rerender({ searchState: initialSearchState, dispatch: mockDispatch })
      await waitFor(() => {
        expect(multipleQueries).toHaveBeenCalledTimes(1)
      })
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
        expect(mockRemoveSelectedVenue).toHaveBeenCalledWith()
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
          expect(mockSetInitialVenues).toHaveBeenCalledWith(
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
          expect(mockSetInitialVenues).toHaveBeenCalledWith([])
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
          expect(mockSetInitialVenues).toHaveBeenCalledWith([])
        })
      })
    })
  })

  describe('When a redirect url is configured', () => {
    const mockRedirectUrl =
      'http://passculture.app/recherche/resultats?offerCategories=%5B%22CINEMA%22%5D&query=%22%22'

    beforeAll(() => {
      fetchSearchResultsSpy.mockResolvedValueOnce({
        ...mockFetchSearchResultsResponse,
        redirectUrl: mockRedirectUrl,
      })
    })

    it('should redirect to thematicSearch', async () => {
      const mockSearchstate = { ...initialSearchState, shouldRedirect: true }
      renderUseSearchResults(mockSearchstate)

      await act(async () => {})

      expect(doAlgoliaRedirectSpy).toHaveBeenCalledWith(
        new URL(mockRedirectUrl),
        mockSearchstate,
        defaultDisabilitiesProperties,
        mockDispatch,
        mockReplaceToSearch
      )
    })
  })
})

const renderUseSearchResults = (newSearchState?: SearchState) =>
  renderHook(
    ({ searchState, dispatch }: { searchState: SearchState; dispatch: Dispatch<Action> }) =>
      useSearchInfiniteQuery(searchState, dispatch),
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: { searchState: newSearchState ?? initialSearchState, dispatch: mockDispatch },
    }
  )
