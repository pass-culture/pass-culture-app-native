import React from 'react'

import { ConcertsAndFestivalsPlaylists } from 'features/search/pages/ThematicSearch/ConcertsAndFestivals/ConcertsAndFestivalsPlaylists'
import * as useThematicSearchPlaylistsAPI from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

const DEFAULT_PLAYLIST_OFFERS = mockBuilder.searchResponseOffer({})
const DEFAULT_PLAYLIST_TITLE = 'Festivals'

const useThematicSearchPlaylistsSpy = jest
  .spyOn(useThematicSearchPlaylistsAPI, 'useThematicSearchPlaylistsQuery')
  .mockReturnValue({
    playlists: [{ title: DEFAULT_PLAYLIST_TITLE, offers: DEFAULT_PLAYLIST_OFFERS }],
    isLoading: false,
  })

describe('ConcertsAndFestivalsPlaylists', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition({ latitude: 2, longitude: 2 })
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    setFeatureFlags([])
  })

  it('should render playlist when algolia returns offers', async () => {
    renderConcertsAndFestivals()

    expect(await screen.findByLabelText(DEFAULT_PLAYLIST_TITLE)).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    useThematicSearchPlaylistsSpy.mockReturnValueOnce({ playlists: [], isLoading: false })
    renderConcertsAndFestivals()

    expect(screen.queryByLabelText(DEFAULT_PLAYLIST_TITLE)).not.toBeOnTheScreen()
  })
})

const renderConcertsAndFestivals = () =>
  render(
    reactQueryProviderHOC(
      <ConcertsAndFestivalsPlaylists
        shouldDisplayVenuesPlaylist
        onViewableItemsChanged={jest.fn()}
      />
    )
  )
