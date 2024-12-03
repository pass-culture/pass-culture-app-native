import React from 'react'

import * as useThematicSearchPlaylistsAPI from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { FilmsPlaylist } from 'features/search/pages/ThematicSearch/Films/FilmsPlaylist'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode, Position } from 'libs/location/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true) // WIP_NEW_OFFER_TILE in renderPassPlaylist.tsx

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const DEFAULT_OFFERS = mockBuilder.searchResponseOffer({})
const DEFAULT_PLAYLIST_TITLE = 'Vidéos et documentaires'

const useThematicSearchPlaylistsSpy = jest
  .spyOn(useThematicSearchPlaylistsAPI, 'useThematicSearchPlaylists')
  .mockReturnValue({
    playlists: [{ title: DEFAULT_PLAYLIST_TITLE, offers: DEFAULT_OFFERS }],
    isLoading: false,
  })

describe('Films', () => {
  it('should render playlist when algolia returns offers', async () => {
    renderFilms()

    expect(await screen.findByText(DEFAULT_PLAYLIST_TITLE)).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    useThematicSearchPlaylistsSpy.mockReturnValueOnce({ playlists: [], isLoading: false })
    renderFilms()

    expect(screen.queryByText(DEFAULT_PLAYLIST_TITLE)).not.toBeOnTheScreen()
  })
})

const renderFilms = () => render(reactQueryProviderHOC(<FilmsPlaylist />))
