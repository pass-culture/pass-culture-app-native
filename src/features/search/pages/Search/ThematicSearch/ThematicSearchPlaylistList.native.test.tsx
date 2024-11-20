import React from 'react'

import {
  cinemaPlaylistAlgoliaSnapshot,
  cinemaPlaylistAlgoliaSnapshotWithoutHits,
} from 'features/search/pages/Search/ThematicSearch/Cinema/fixtures/cinemaPlaylistAlgoliaSnapshot'
import { ThematicSearchPlaylistList } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicSearchPlaylistData } from 'features/search/pages/Search/ThematicSearch/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, cleanup } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true) // WIP_NEW_OFFER_TILE in renderPassPlaylist.tsx

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
jest.mock('libs/firebase/analytics/analytics')

describe('ThematicSearchPlaylistList', () => {
  afterEach(cleanup)

  it('should render playlist properly', async () => {
    renderThematicSearchPlaylistList(
      cinemaPlaylistAlgoliaSnapshot,
      false,
      'playlistsThematicSearchCinema'
    )

    await screen.findByText('Films à l’affiche')

    expect(await screen.findByText('Harry potter à l’école des sorciers')).toBeOnTheScreen()
  })

  it('should render OfferPlaylistSkeleton when playlists are loading', async () => {
    renderThematicSearchPlaylistList(
      cinemaPlaylistAlgoliaSnapshot,
      true,
      'playlistsThematicSearchCinema'
    )

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should not return a playlist without offers', async () => {
    renderThematicSearchPlaylistList(
      cinemaPlaylistAlgoliaSnapshotWithoutHits,
      false,
      'playlistsThematicSearchCinema'
    )

    expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
  })
})

function renderThematicSearchPlaylistList(
  playlists: ThematicSearchPlaylistData[],
  arePlaylistsLoading: boolean,
  testId: string
) {
  return render(
    reactQueryProviderHOC(
      <ThematicSearchPlaylistList
        playlists={playlists}
        arePlaylistsLoading={arePlaylistsLoading}
        testId={testId}
      />
    )
  )
}
