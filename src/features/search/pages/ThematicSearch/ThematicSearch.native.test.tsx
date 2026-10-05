import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { popTo, navigate, useIsFocused, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { SearchStackParamList } from 'features/navigation/navigators/SearchStackNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { BooksNativeCategoriesEnum, SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { defaultLocationState, useLocationV2 } from 'libs/locationV2/location.store'
import { QueryKeys } from 'libs/queryKeys'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockUseRemoteConfigQuery = jest.fn(() => ({
  data: { displayNewSearchHeader: false },
}))
jest.mock('libs/firebase/remoteConfig/queries/useRemoteConfigQuery', () => ({
  useRemoteConfigQuery: () => mockUseRemoteConfigQuery(),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const defaultResponse: UseQueryResult<GtlPlaylistData[], Error> = {
  data: gtlPlaylistAlgoliaSnapshot,
  isLoading: false,
  error: null,
  isSuccess: true,
  isError: false,
  refetch: jest.fn(),
  status: 'success',
  failureCount: 0,
  isFetched: true,
  isFetchedAfterMount: true,
  isFetching: false,
  isPending: false,
  isEnabled: false,
  isInitialLoading: false,
  isLoadingError: false,
  isPlaceholderData: false,
  isRefetchError: false,
  isStale: false,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  errorUpdateCount: 0,
  isRefetching: false,
  failureReason: new Error(),
  isPaused: false,
  fetchStatus: 'fetching',
  promise: Promise.resolve(gtlPlaylistAlgoliaSnapshot),
}

const mockUseGtlPlaylist = jest
  .spyOn(useGTLPlaylists, 'useGTLPlaylistsQuery')
  .mockReturnValue(defaultResponse)
const mockSearchState = {
  ...initialSearchState,
}
const mockDispatch = jest.fn()
const mockShowSuggestions = jest.fn()
const mockHideSuggestions = jest.fn()
const mockIsFocusOnSuggestions = false

const defaultUseSearch = {
  searchState: mockSearchState,
  dispatch: mockDispatch,
  showSuggestions: mockShowSuggestions,
  hideSuggestions: mockHideSuggestions,
  isFocusOnSuggestions: mockIsFocusOnSuggestions,
}
const mockedUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => defaultUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockedUseSearch(),
}))

const defaultUseSearchResults = {
  data: { pages: [{ nbHits: 0, hits: [], page: 0 }] },
  hits: {},
  nbHits: 0,
  isFetching: false,
  isLoading: false,
  hasNextPage: true,
  fetchNextPage: jest.fn(),
  isFetchingNextPage: false,
}
const mockUseSearchResults = jest.fn((_searchState: SearchState) => defaultUseSearchResults)
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchInfiniteQuery: (searchState: SearchState) => mockUseSearchResults(searchState),
}))

const mockData = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))

const user = userEvent.setup()

describe('<ThematicSearch/>', () => {
  jest.useFakeTimers()

  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
    useIsFocused.mockReturnValue(true)
    mockedUseSearch.mockReturnValue(defaultUseSearch)
    mockUseSearchResults.mockReturnValue(defaultUseSearchResults)
  })

  describe('book offerCategory', () => {
    beforeEach(() => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      mockUseSearchResults.mockReturnValue(defaultUseSearchResults)
      mockedUseSearch.mockReturnValue({
        ...defaultUseSearch,
        searchState: { ...mockSearchState, offerCategories: [SearchGroupNameEnumv2.LIVRES] },
      })
    })

    it('should render <ThematicSearch />', async () => {
      render(reactQueryProviderHOC(<ThematicSearch />))

      await screen.findByText('Romans et littérature')

      expect(screen).toMatchSnapshot()
    })

    it('should render skeleton when playlists are loading', async () => {
      mockUseGtlPlaylist.mockReturnValueOnce({
        data: [],
        isLoading: true,
      } as unknown as UseQueryResult<GtlPlaylistData[], Error>)

      render(reactQueryProviderHOC(<ThematicSearch />))

      await screen.findByText('Livres')

      expect(screen.getByTestId('ThematicSearchSkeleton')).toBeOnTheScreen()
    })

    describe('Search bar', () => {
      it('should navigate to search results with the corresponding parameters', async () => {
        const QUERY = 'Harry'
        render(reactQueryProviderHOC(<ThematicSearch />))
        const searchInput = screen.getByTestId('searchInput')
        await user.type(searchInput, QUERY, { submitEditing: true })
        await screen.findByText('Romans et littérature')

        expect(popTo).toHaveBeenCalledWith(
          'TabNavigator',
          expect.objectContaining({
            screen: 'SearchStackNavigator',
            params: expect.objectContaining({
              params: expect.objectContaining({
                offerCategories: ['LIVRES'],
                query: QUERY,
              }),
            }),
          })
        )
      })
    })

    describe('Subcategory buttons', () => {
      it('should navigate to search results with correct data', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))
        const subcategoryButton = await screen.findByText('Romans et littérature')
        await user.press(subcategoryButton)

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          screen: 'SearchStackNavigator',
          params: {
            screen: 'SearchResults',
            params: expect.objectContaining({
              offerCategories: [SearchGroupNameEnumv2.LIVRES],
              offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
            }),
          },
        })
      })
    })

    describe('gtl playlists', () => {
      it('should render gtl playlists when offerCategory is `LIVRES`', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))
        await screen.findByText('Romans et littérature')

        expect(await screen.findByLabelText('GTL playlist')).toBeOnTheScreen()
      })

      it('should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME_B if FF ENABLE_REPLICA_ALGOLIA_INDEX is on', async () => {
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX])
        render(reactQueryProviderHOC(<ThematicSearch />))
        await screen.findByText('Romans et littérature')

        expect(mockUseGtlPlaylist).toHaveBeenCalledWith({
          adaptPlaylistParameters: expect.any(Function),
          queryKey: QueryKeys.THEMATIC_SEARCH_BOOKS_GTL_PLAYLISTS,
          isUserUnderage: false,
          searchIndex: env.ALGOLIA_OFFERS_INDEX_NAME_B,
          searchGroupLabel: 'Livres',
          selectedLocationMode: 'EVERYWHERE',
          transformHits: expect.any(Function),
          userLocation: null,
        })
      })
    })
  })

  describe('PerformSearch log', () => {
    beforeEach(() => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      mockUseSearchResults.mockReturnValue(defaultUseSearchResults)
      mockedUseSearch.mockReturnValue(defaultUseSearch)
    })

    it('should log PerformSearch when search query execution ends', async () => {
      mockUseSearchResults.mockReturnValueOnce({ ...defaultUseSearchResults, isLoading: true })
      const { rerender } = render(reactQueryProviderHOC(<ThematicSearch />))

      rerender(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Livres')

      expect(analytics.logPerformSearch).toHaveBeenCalledWith(
        { ...mockSearchState, offerCategories: [SearchGroupNameEnumv2.LIVRES] },
        defaultDisabilitiesProperties,
        0,
        SearchView.Thematic
      )
    })

    it('should log PerformSearch only one time when there is search query execution and several re-render', async () => {
      mockUseSearchResults.mockReturnValueOnce({ ...defaultUseSearchResults, isLoading: true })
      const { rerender } = render(reactQueryProviderHOC(<ThematicSearch />))

      rerender(reactQueryProviderHOC(<ThematicSearch />))
      rerender(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Livres')

      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
    })

    it('should not log PerformSearch when there is no search query execution', async () => {
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Livres')

      expect(analytics.logPerformSearch).not.toHaveBeenCalled()
    })
  })

  describe('gtl playlists', () => {
    it('should not render gtl playlists when offerCategory is not `LIVRES`', async () => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Festivals')

      expect(screen.queryByLabelText('GTL playlist')).not.toBeOnTheScreen()
    })
  })

  describe('cinema playlists', () => {
    it('should render cinema playlists when offerCategory is `CINEMA`', async () => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CINEMA] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Cinéma')

      expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
    })

    it('should not render cinema playlists when offerCategory is not `CINEMA`', async () => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Festivals')

      expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
    })
  })

  describe('films playlists', () => {
    it('should render films playlists when offerCategory is `FILMS_DOCUMENTAIRES_SERIES`', async () => {
      mockOfferCategoriesParams({
        offerCategories: [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES],
      })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Films, séries et documentaires')

      expect(await screen.findByText('DVD, Blu-Ray')).toBeOnTheScreen()
    })

    it('should not render films playlists when offerCategory is not `FILMS_DOCUMENTAIRES_SERIES`', async () => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Festivals')

      expect(screen.queryByText('DVD, Blu-Ray')).not.toBeOnTheScreen()
    })
  })

  describe('music playlists', () => {
    it('should render music playlists when offerCategory is `MUSIQUE`', async () => {
      mockOfferCategoriesParams({
        offerCategories: [SearchGroupNameEnumv2.MUSIQUE],
      })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Musique')

      expect(await screen.findByText('Achat & location d‘instrument')).toBeOnTheScreen()
    })

    it('should not render music playlists when offerCategory is not `MUSIQUE`', async () => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Livres')

      expect(screen.queryByText('Achat & location d‘instrument')).not.toBeOnTheScreen()
    })
  })

  describe('When displayNewSearchHeader is enabled', () => {
    beforeAll(() => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      mockUseRemoteConfigQuery.mockReturnValue({
        data: { displayNewSearchHeader: true },
      })
    })

    afterAll(() => {
      mockUseRemoteConfigQuery.mockReturnValue({
        data: { displayNewSearchHeader: false },
      })
    })

    it('should display back arrow when displayNewSearchHeader is true', async () => {
      render(reactQueryProviderHOC(<ThematicSearch />))

      await screen.findByText('Livres')

      expect(screen.getByLabelText('Revenir en arrière')).toBeOnTheScreen()
    })

    describe('When input is focused', () => {
      beforeEach(() => {
        mockedUseSearch.mockReturnValue({ ...defaultUseSearch, isFocusOnSuggestions: true })
      })

      it('should hide header', async () => {
        const { unmount } = render(reactQueryProviderHOC(<ThematicSearch />))

        await screen.findByTestId('searchInput')
        await act(async () => {})

        expect(screen.queryByText('Livres')).not.toBeOnTheScreen()

        unmount()
      })
    })
  })

  describe('route search parameters', () => {
    it.each([SearchGroupNameEnumv2.CINEMA, SearchGroupNameEnumv2.CONCERTS_FESTIVALS])(
      'should keep %s when the shared search is reset across three focus cycles',
      async (category) => {
        mockOfferCategoriesParams({ offerCategories: [category] })
        const { rerender } = render(reactQueryProviderHOC(<ThematicSearch />))
        await act(async () => {})

        expect(mockUseSearchResults).toHaveBeenCalledWith({
          ...initialSearchState,
          offerCategories: [category],
        })

        for (let cycle = 0; cycle < 3; cycle++) {
          useIsFocused.mockReturnValue(false)
          mockedUseSearch.mockReturnValue({
            ...defaultUseSearch,
            searchState: {
              ...initialSearchState,
              offerCategories: [SearchGroupNameEnumv2.LIVRES],
              offerNativeCategories: [BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE],
              query: 'roman',
            },
          })
          rerender(reactQueryProviderHOC(<ThematicSearch />))
          mockedUseSearch.mockReturnValue(defaultUseSearch)
          useIsFocused.mockReturnValue(true)
          rerender(reactQueryProviderHOC(<ThematicSearch />))
          await act(async () => {})
        }

        for (const [state] of mockUseSearchResults.mock.calls) {
          expect(state).toEqual({ ...initialSearchState, offerCategories: [category] })
        }
      }
    )

    it('should update the query when the route category changes', async () => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CINEMA] })
      const { rerender } = render(reactQueryProviderHOC(<ThematicSearch />))
      await act(async () => {})

      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      rerender(reactQueryProviderHOC(<ThematicSearch />))
      await act(async () => {})

      expect(mockUseSearchResults).toHaveBeenLastCalledWith({
        ...initialSearchState,
        offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS],
      })
    })

    it('should preserve route filters while following the current location', async () => {
      mockThematicRouteParams({
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
        query: 'cinéma',
        searchId: 'thematic-search',
        accessibilityFilter: { isAudioDisabilityCompliant: true },
        locationFilter: initialSearchState.locationFilter,
      })
      const { rerender } = render(reactQueryProviderHOC(<ThematicSearch />))
      await act(async () => {})
      const locationFilter = { locationType: LocationMode.AROUND_ME, aroundRadius: 20 } as const
      mockSharedSearchState({ ...initialSearchState, locationFilter })
      rerender(reactQueryProviderHOC(<ThematicSearch />))
      await act(async () => {})

      expect(mockUseSearchResults).toHaveBeenLastCalledWith({
        ...initialSearchState,
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
        query: 'cinéma',
        searchId: 'thematic-search',
        locationFilter,
      })
    })
  })
})

function mockOfferCategoriesParams(offerCategoriesParams: {
  offerCategories: SearchGroupNameEnumv2[]
}) {
  useRoute.mockImplementation(() => ({
    params: offerCategoriesParams,
    name: 'ThematicSearch',
  }))
}

function mockThematicRouteParams(params: SearchStackParamList['ThematicSearch']) {
  useRoute.mockReturnValue({ name: 'ThematicSearch', params })
}

function mockSharedSearchState(searchState: SearchState) {
  mockedUseSearch.mockReturnValue({ ...defaultUseSearch, searchState })
}
