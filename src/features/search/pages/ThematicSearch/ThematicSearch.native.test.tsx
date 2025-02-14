import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent } from 'tests/utils'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

const defaultUseLocation = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  onModalHideRef: jest.fn(),
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

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

const user = userEvent.setup()

describe('<ThematicSearch/>', () => {
  jest.useFakeTimers()

  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
    MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
    mockUseLocation.mockReturnValue(defaultUseLocation)
    mockUseSearchResults.mockReturnValue(defaultUseSearchResults)
  })

  it('should render <ThematicSearch />', async () => {
    render(reactQueryProviderHOC(<ThematicSearch />))

    await screen.findByText('Romans et littérature')

    expect(screen).toMatchSnapshot()
  })

  it('should render not <ThematicSearch /> when no offerCategory is provided', async () => {
    MockOfferCategoriesParams({ offerCategories: [] })

    render(reactQueryProviderHOC(<ThematicSearch />))

    expect(screen.queryAllByText(/.*/)).toHaveLength(0)
  })

  it('should render skeleton when playlists are loading', async () => {
    mockUseGtlPlaylist.mockReturnValueOnce({
      gtlPlaylists: [],
      isLoading: true,
    })

    render(reactQueryProviderHOC(<ThematicSearch />))

    await screen.findByText('Livres')

    expect(screen.getByTestId('ThematicSearchSkeleton')).toBeOnTheScreen()
  })

  describe('Search bar', () => {
    it('should navigate to search results with the corresponding parameters', async () => {
      const QUERY = 'Harry'
      render(reactQueryProviderHOC(<ThematicSearch />))
      const searchInput = screen.getByPlaceholderText('Livres...')
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: QUERY } })

      await screen.findByText('Romans et littérature')

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
      await user.press(subcategoryButton)
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
      await user.press(subcategoryButton)
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

    describe('book playlists', () => {
      it('should render gtl playlists when offerCategory is `LIVRES`', async () => {
        render(reactQueryProviderHOC(<ThematicSearch />))
        await screen.findByText('Romans et littérature')

        expect(await screen.findByText('GTL playlist')).toBeOnTheScreen()
      })

      it('should not render gtl playlists when offerCategory is not `LIVRES`', async () => {
        MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
        render(reactQueryProviderHOC(<ThematicSearch />))
        await screen.findByText('Festivals')

        expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
      })
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

  describe('films playlists', () => {
    it('should render films playlists when offerCategory is `FILMS_DOCUMENTAIRES_SERIES`', async () => {
      MockOfferCategoriesParams({
        offerCategories: [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES],
      })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Films, séries et documentaires')

      expect(await screen.findByText('DVD, Blu-Ray')).toBeOnTheScreen()
    })

    it('should not render films playlists when offerCategory is not `FILMS_DOCUMENTAIRES_SERIES`', async () => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Festivals')

      expect(screen.queryByText('DVD, Blu-Ray')).not.toBeOnTheScreen()
    })
  })

  describe('music playlists', () => {
    it('should render music playlists when offerCategory is `MUSIQUE`', async () => {
      MockOfferCategoriesParams({
        offerCategories: [SearchGroupNameEnumv2.MUSIQUE],
      })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Musique')

      expect(await screen.findByText('Achat & location d‘instrument')).toBeOnTheScreen()
    })

    it('should not render music playlists when offerCategory is not `MUSIQUE`', async () => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Livres')

      expect(screen.queryByText('Achat & location d‘instrument')).not.toBeOnTheScreen()
    })
  })

  describe('concerts and festivals playlists', () => {
    it('should render concerts and festivals playlists when offerCategory is `CONCERTS_FESTIVALS`', async () => {
      MockOfferCategoriesParams({
        offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS],
      })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Concerts & festivals')

      expect(await screen.findByText('Concerts, évènements')).toBeOnTheScreen()
    })

    it('should not render concerts and festivals when offerCategory is not `CONCERTS_FESTIVALS`', async () => {
      MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.LIVRES] })
      render(reactQueryProviderHOC(<ThematicSearch />))
      await screen.findByText('Livres')

      expect(screen.queryByText('Concerts, évènements')).not.toBeOnTheScreen()
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
