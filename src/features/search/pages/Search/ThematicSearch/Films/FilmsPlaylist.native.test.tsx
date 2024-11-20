import React from 'react'

import * as useFilmsOffersAPI from 'features/search/pages/Search/ThematicSearch/Films/algolia/useFilmsOffers'
import { FilmsPlaylist } from 'features/search/pages/Search/ThematicSearch/Films/FilmsPlaylist'
import { filmsPlaylistAlgoliaSnapshot } from 'features/search/pages/Search/ThematicSearch/Films/fixtures/filmsPlaylistAlgoliaSnapshot'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode, Position } from 'libs/location/types'
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

const DEFAULT_PLAYLIST_TITLE = 'Vidéos et documentaires'
const DEFAULT_PLAYLIST_OFFERS = filmsPlaylistAlgoliaSnapshot
const useFilmsOffersSpy = jest.spyOn(useFilmsOffersAPI, 'useFilmsOffers').mockReturnValue({
  offers: DEFAULT_PLAYLIST_OFFERS,
  isLoading: false,
})

describe('Films', () => {
  it('should render playlist when algolia returns offers', async () => {
    renderCinema()

    await screen.findByTestId('playlistsThematicSearchFilms')

    expect(await screen.findByText(DEFAULT_PLAYLIST_TITLE)).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    useFilmsOffersSpy.mockReturnValueOnce({ offers: [], isLoading: false })
    renderCinema()

    await screen.findByTestId('playlistsThematicSearchFilms')

    expect(screen.queryByText(DEFAULT_PLAYLIST_TITLE)).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<FilmsPlaylist />))
