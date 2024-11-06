import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { ThematicSearch } from 'features/search/pages/Search/ThematicSearch/ThematicSearch'
import { env } from 'libs/environment'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
useFeatureFlagSpy.mockReturnValue(false)

const mockUseGtlPlaylist = jest.spyOn(useGTLPlaylists, 'useGTLPlaylists')
mockUseGtlPlaylist.mockReturnValue({
  isLoading: false,
  gtlPlaylists: gtlPlaylistAlgoliaSnapshot,
})

jest.spyOn(useSearch, 'useSearch').mockReturnValue({
  searchState: mockSearchState,
  dispatch: mockDispatch,
  resetSearch: jest.fn(),
  isFocusOnSuggestions: false,
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
})

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
let mockSelectedLocationMode = LocationMode.EVERYWHERE
const mockUseLocation = jest.fn(() => ({
  selectedLocationMode: mockSelectedLocationMode,
  onModalHideRef: jest.fn(),
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
let mockHits = {}
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: mockHits,
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

describe('<ThematicSearch/>', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
  })

  describe('book offerCategory', () => {
    beforeEach(() => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      mockHits = {}
      mockSelectedLocationMode = LocationMode.EVERYWHERE
    })

    it('should render <ThematicSearch />', async () => {
      render(reactQueryProviderHOC(<ThematicSearch />))

      await screen.findByText('Romans et littérature')

      expect(screen).toMatchSnapshot()
    })

    describe('Search bar', () => {
      it('should navigate to search results with the corresponding parameters', async () => {
        const QUERY = 'Harry'
        render(reactQueryProviderHOC(<ThematicSearch />))
        const searchInput = screen.getByPlaceholderText('Livres...')
        fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: QUERY } })

        await act(async () => {})

        expect(navigate).toHaveBeenCalledWith(
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
      it('should update SearchState with correct data', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))
        const subcategoryButton = await screen.findByText('Romans et littérature')
        fireEvent.press(subcategoryButton)
        await screen.findByText('Romans et littérature')

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              offerCategories: [SearchGroupNameEnumv2.LIVRES],
              offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
            }),
            type: 'SET_STATE',
          })
        )
      })

      it('should navigate to search results with the corresponding parameters', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))
        const subcategoryButton = await screen.findByText('Romans et littérature')

        fireEvent.press(subcategoryButton)
        await screen.findByText('Romans et littérature')

        expect(navigate).toHaveBeenCalledWith(
          'TabNavigator',
          expect.objectContaining({
            screen: 'SearchStackNavigator',
            params: expect.objectContaining({
              params: expect.objectContaining({
                offerCategories: ['LIVRES'],
                offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
              }),
            }),
          })
        )
      })
    })

    describe('gtl playlists', () => {
      it('should render gtl playlists when offerCategory is `LIVRES`', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))
        await screen.findByText('Romans et littérature')

        expect(await screen.findByText('GTL playlist')).toBeOnTheScreen()
      })

      it('should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME_B if FF ENABLE_REPLICA_ALGOLIA_INDEX is on', async () => {
        jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValueOnce(true)
        render(reactQueryProviderHOC(<ThematicSearch />))
        await screen.findByText('Romans et littérature')

        expect(mockUseGtlPlaylist).toHaveBeenCalledWith({
          queryKey: 'SEARCH_N1_BOOKS_GTL_PLAYLISTS',
          searchIndex: env.ALGOLIA_OFFERS_INDEX_NAME_B,
        })
      })
    })
  })

  describe('gtl playlists', () => {
    it('should not render gtl playlists when offerCategory is not `LIVRES`', async () => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Festivals')

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })
  })

  describe('cinema playlists', () => {
    it('should render cinema playlists when offerCategory is `CINEMA`', async () => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CINEMA] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Cinéma')

      expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
    })

    it('should not render cinema playlists when offerCategory is not `CINEMA`', async () => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Festivals')

      expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
    })
  })
})

function MockOfferCategoriesParams(offerCategoriesParams: {
  offerCategories: SearchGroupNameEnumv2[]
}) {
  useRoute.mockImplementation(() => ({
    params: offerCategoriesParams,
    name: 'ThematicSearch',
  }))
}
