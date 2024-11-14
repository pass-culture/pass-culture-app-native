import { Hit } from '@algolia/client-search'

import algoliasearch from '__mocks__/algoliasearch'
import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import * as fetchSearchResults from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { algoliaFacets } from 'libs/algolia/fixtures/algoliaFacets'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaVenue } from 'libs/algolia/types'
import { GeoCoordinates, GeolocPermissionState, GeolocationError } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const { multipleQueries } = algoliasearch()

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

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))
const mockRemoveSelectedVenue = jest.fn()
jest.mock('features/venueMap/store/selectedVenueStore', () => ({
  useSelectedVenueActions: () => ({
    removeSelectedVenue: mockRemoveSelectedVenue,
  }),
}))

describe('useSearchResults', () => {
  describe('useSearchInfiniteQuery', () => {
    it('should fetch offers, venues and all facets', async () => {
      renderHook(useSearchInfiniteQuery, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
        initialProps: initialSearchState,
      })

      await waitFor(() => {
        expect(multipleQueries).toHaveBeenNthCalledWith(1, [
          {
            indexName: 'algoliaOffersIndexName',
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
      const { rerender } = renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      rerender({ ...initialSearchState })
      await waitFor(() => {
        expect(multipleQueries).toHaveBeenCalledTimes(1)
      })
    })

    // because of an Algolia issue, sometimes nbHits is at 0 even when there is some hits, cf PC-28287
    it('should show hit numbers even if nbHits is at 0 but hits are not null', async () => {
      jest.spyOn(fetchSearchResults, 'fetchSearchResults').mockResolvedValueOnce({
        offersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
        venuesResponse: mockedAlgoliaVenueResponse,
        facetsResponse: algoliaFacets,
        duplicatedOffersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
      })

      const { result } = renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        const hitNumber = result.current.nbHits

        expect(hitNumber).toEqual(4)
      })
    })

    it('should reset selected venue in store', async () => {
      renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(mockRemoveSelectedVenue).toHaveBeenCalledWith()
      })
    })

    describe('When user share his location and received venues from Algolia', () => {
      beforeAll(() => {
        jest.spyOn(fetchSearchResults, 'fetchSearchResults').mockResolvedValue({
          offersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
          venuesResponse: mockedAlgoliaVenueResponse,
          facetsResponse: algoliaFacets,
          duplicatedOffersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
        })
        mockUseLocation.mockReturnValue({ ...defaultUseLocation, userLocation: DEFAULT_POSITION })
      })

      it('should set initial venues', async () => {
        renderHook(
          (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await waitFor(() => {
          expect(mockSetInitialVenues).toHaveBeenCalledWith(
            adaptAlgoliaVenues(mockedAlgoliaVenueResponse.hits)
          )
        })
      })
    })

    describe('When user share his location and not received venues from Algolia', () => {
      beforeAll(() => {
        jest.spyOn(fetchSearchResults, 'fetchSearchResults').mockResolvedValue({
          offersResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
          venuesResponse: {
            hits: [] as Hit<AlgoliaVenue>[],
            nbHits: 0,
            page: 0,
            nbPages: 0,
            userData: null,
          },
          facetsResponse: algoliaFacets,
          duplicatedOffersResponse: { ...mockedAlgoliaResponse, nbHits: 0, userData: null },
        })
        mockUseLocation.mockReturnValue({ ...defaultUseLocation, userLocation: DEFAULT_POSITION })
      })

      it('should set initial venues as empty array', async () => {
        renderHook(
          (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await waitFor(() => {
          expect(mockSetInitialVenues).toHaveBeenCalledWith([])
        })
      })
    })

    describe('When user not share his location and received venues from Algolia', () => {
      beforeAll(() => {
        jest.spyOn(fetchSearchResults, 'fetchSearchResults').mockResolvedValue({
          offersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
          venuesResponse: mockedAlgoliaVenueResponse,
          facetsResponse: algoliaFacets,
          duplicatedOffersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
        })
        mockUseLocation.mockReturnValue({ ...defaultUseLocation })
      })

      it('should set initial venues as empty array', async () => {
        renderHook(
          (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await waitFor(() => {
          expect(mockSetInitialVenues).toHaveBeenCalledWith([])
        })
      })
    })
  })
})
