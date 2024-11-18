import React from 'react'

import { searchResponseOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import * as useCinemaOffersAPI from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/useCinemaOffers'
import { PlaylistsThematicSearchCinema } from 'features/search/pages/Search/ThematicSearch/Cinema/PlaylistsThematicSearchCinema'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode, Position } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/network/NetInfoWrapper')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true) // WIP_NEW_OFFER_TILE in renderPassPlaylist.tsx

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const DEFAULT_CINEMA_OFFER = searchResponseOfferBuilder().build()
const DEFAULT_PLAYLIST_TITLE = 'Films à l’affiche'

const useCinemaOffersSpy = jest.spyOn(useCinemaOffersAPI, 'useCinemaOffers').mockReturnValue({
  offers: [{ title: DEFAULT_PLAYLIST_TITLE, offers: DEFAULT_CINEMA_OFFER }],
  isLoading: false,
})

describe('Cinema', () => {
  it('should render playlist when algolia returns offers', async () => {
    renderCinema()

    await screen.findByTestId('playlistsThematicSearchCinema')

    expect(await screen.findByText(DEFAULT_PLAYLIST_TITLE)).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    useCinemaOffersSpy.mockReturnValueOnce({ offers: [], isLoading: false })
    renderCinema()

    await screen.findByTestId('playlistsThematicSearchCinema')

    expect(screen.queryByText(DEFAULT_PLAYLIST_TITLE)).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<PlaylistsThematicSearchCinema />))
