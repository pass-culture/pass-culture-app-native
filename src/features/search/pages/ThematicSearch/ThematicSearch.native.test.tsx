import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { popTo, navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { env } from 'libs/environment/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

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

const defaultUseLocation = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  onModalHideRef: jest.fn(),
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

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
const mockUseSearchResults = jest.fn(() => defaultUseSearchResults)
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => mockUseSearchResults(),
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
  })

  describe('book offerCategory', () => {
    beforeEach(() => {
      mockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      mockUseLocation.mockReturnValue(defaultUseLocation)
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
        const searchInput = screen.getByPlaceholderText('Livres...')
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
          queryKey: 'THEMATIC_SEARCH_BOOKS_GTL_PLAYLISTS',
          isUserUnderage: false,
          searchIndex: env.ALGOLIA_OFFERS_INDEX_NAME_B,
          searchGroupLabel: 'Livres',
          selectedLocationMode: 'EVERYWHERE',
          transformHits: expect.any(Function),
          userLocation: undefined,
        })
      })
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

      expect(screen.getByTestId('icon-back')).toBeOnTheScreen()
    })

    describe('When input is focused', () => {
      beforeEach(() => {
        mockedUseSearch.mockReturnValue({ ...defaultUseSearch, isFocusOnSuggestions: true })
      })

      it('should hide header', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))

        await screen.findByTestId('searchInput')

        expect(screen.queryByText('Livres')).not.toBeOnTheScreen()
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
