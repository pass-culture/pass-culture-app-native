import React from 'react'

import * as useThematicSearchPlaylistsAPI from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { CinemaPlaylists } from 'features/search/pages/ThematicSearch/Cinema/CinemaPlaylists'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode, Position } from 'libs/location/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const DEFAULT_PLAYLIST_OFFERS = mockBuilder.searchResponseOffer({})
const DEFAULT_PLAYLIST_TITLE = 'Films à l’affiche'

const useThematicSearchPlaylistsSpy = jest
  .spyOn(useThematicSearchPlaylistsAPI, 'useThematicSearchPlaylists')
  .mockReturnValue({
    playlists: [{ title: DEFAULT_PLAYLIST_TITLE, offers: DEFAULT_PLAYLIST_OFFERS }],
    isLoading: false,
  })

describe('CinemaPlaylists', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  it('should render playlist when algolia returns offers', async () => {
    renderCinema()

    expect(await screen.findByText(DEFAULT_PLAYLIST_TITLE)).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    useThematicSearchPlaylistsSpy.mockReturnValueOnce({ playlists: [], isLoading: false })
    renderCinema()

    expect(screen.queryByText(DEFAULT_PLAYLIST_TITLE)).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<CinemaPlaylists />))
