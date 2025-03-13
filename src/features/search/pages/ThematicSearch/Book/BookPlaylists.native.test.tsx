import React from 'react'

import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { BookPlaylists } from 'features/search/pages/ThematicSearch/Book/BookPlaylists'
import { env } from 'libs/environment/__mocks__/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode, Position } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const useGTLPlaylistsSpy = jest
  .spyOn(useGTLPlaylists, 'useGTLPlaylists')
  .mockReturnValue({ isLoading: false, gtlPlaylists: gtlPlaylistAlgoliaSnapshot })

const DEFAULT_PLAYLIST_TITLE = 'GTL playlist'

describe('BookPlaylists', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  it('should render gtl playlists when algolia returns offers', async () => {
    renderBookPlaylists()

    expect(await screen.findByText(DEFAULT_PLAYLIST_TITLE)).toBeOnTheScreen()
  })

  it('should render skeleton when playlists are still loading', async () => {
    useGTLPlaylistsSpy.mockReturnValueOnce({
      isLoading: true,
      gtlPlaylists: [],
    })

    renderBookPlaylists()

    expect(screen.getByTestId('ThematicSearchSkeleton')).toBeOnTheScreen()
  })

  it('should not render gtl playlists when algolia does not return offers', async () => {
    useGTLPlaylistsSpy.mockReturnValueOnce({
      isLoading: false,
      gtlPlaylists: [],
    })

    renderBookPlaylists()

    expect(screen.queryByText(DEFAULT_PLAYLIST_TITLE)).not.toBeOnTheScreen()
  })

  it('should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME if FF is disabled', async () => {
    renderBookPlaylists()

    await screen.findByText(DEFAULT_PLAYLIST_TITLE)

    expect(useGTLPlaylistsSpy).toHaveBeenCalledWith({
      searchIndex: env.ALGOLIA_OFFERS_INDEX_NAME,
    })
  })

  it('should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME_B if FF is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX])
    renderBookPlaylists()

    await screen.findByText(DEFAULT_PLAYLIST_TITLE)

    expect(useGTLPlaylistsSpy).toHaveBeenCalledWith({
      searchIndex: env.ALGOLIA_OFFERS_INDEX_NAME_B,
    })
  })
})

const renderBookPlaylists = () => render(reactQueryProviderHOC(<BookPlaylists />))
