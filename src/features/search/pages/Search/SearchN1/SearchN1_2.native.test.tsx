import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import algoliasearch from '__mocks__/algoliasearch'
import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { SearchWrapper } from 'features/search/context/__mocks__/SearchWrapper'
import { SearchN1 } from 'features/search/pages/Search/SearchN1/SearchN1'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
useFeatureFlagSpy.mockReturnValue(true)

const mockUseGtlPlaylist = jest.spyOn(useGTLPlaylists, 'useGTLPlaylists')
mockUseGtlPlaylist.mockReturnValue({
  isLoading: false,
  gtlPlaylists: gtlPlaylistAlgoliaSnapshot,
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

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const mockSelectedLocationMode = LocationMode.EVERYWHERE
const mockUseLocation = jest.fn(() => ({
  selectedLocationMode: mockSelectedLocationMode,
  onModalHideRef: jest.fn(),
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

const { multipleQueries } = algoliasearch()

useRoute.mockReturnValue({
  params: {
    offerCategories: [SearchGroupNameEnumv2.CINEMA],
  },
})

describe('<SearchN1/>', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
  })

  it('should query with the searchGroup from params', async () => {
    render(
      reactQueryProviderHOC(
        <SearchWrapper>
          <SearchN1 />
        </SearchWrapper>
      )
    )

    await screen.findByText('Cartes cinéma')

    await act(async () => {})
    await act(async () => {})
    await act(async () => {})
    await act(async () => {})

    expect(multipleQueries).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          query: SearchGroupNameEnumv2.CINEMA,
        }),
      ])
    )
  })
})
