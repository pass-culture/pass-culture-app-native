import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { SimilarArtistsResponse } from 'api/gen'
import { ArtistSimilarArtists } from 'features/artist/components/ArtistSimilarArtists/ArtistSimilarArtists'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockPush = jest.fn()
const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: mockPush,
})

const artistId = 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c'
const TITLE = 'Tu peux aussi aimer'

const similarArtistsResponse: SimilarArtistsResponse = {
  artists: [
    { id: 'artist-1', name: 'Coleen Hoover', image: 'https://example.com/coleen.jpg' },
    { id: 'artist-2', name: 'Sarah J. Maas', image: null },
  ],
}

const user = userEvent.setup()

describe('<ArtistSimilarArtists />', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockNavigate.mockClear()
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_SIMILAR_ARTISTS])
  })

  it('should not render anything when the feature flag is disabled', async () => {
    setFeatureFlags()
    mockServer.getApi(`/v1/artists/${artistId}/similar`, similarArtistsResponse)

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    await waitFor(() => {
      expect(screen.queryByTestId('playlistTitle')).not.toBeOnTheScreen()
    })
  })

  it('should display the section with similar artists when API returns at least one', async () => {
    mockServer.getApi(`/v1/artists/${artistId}/similar`, similarArtistsResponse)

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    expect(await screen.findByLabelText('Coleen Hoover')).toBeOnTheScreen()
    expect(screen.getByLabelText('Sarah J. Maas')).toBeOnTheScreen()
    expect(screen.getByTestId('playlistTitle')).toBeOnTheScreen()
  })

  it('should not render anything when API returns an empty list', async () => {
    mockServer.getApi(`/v1/artists/${artistId}/similar`, { artists: [] })

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    await waitFor(() => {
      expect(screen.queryByTestId('playlistTitle')).not.toBeOnTheScreen()
    })
  })

  it('should log consult artist analytics with from=artist when tapping a card', async () => {
    mockServer.getApi(`/v1/artists/${artistId}/similar`, similarArtistsResponse)

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    const card = await screen.findByLabelText('Coleen Hoover')
    await user.press(card)

    expect(analytics.logConsultArtist).toHaveBeenCalledWith(
      expect.objectContaining({
        artistId: 'artist-1',
        artistName: 'Coleen Hoover',
        from: 'artist',
      })
    )
  })

  it('should push a new Artist entry (not navigate) when tapping a card so back returns to the previous artist', async () => {
    mockServer.getApi(`/v1/artists/${artistId}/similar`, similarArtistsResponse)

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    const card = await screen.findByLabelText('Coleen Hoover')
    await user.press(card)

    expect(mockPush).toHaveBeenCalledWith('Artist', { id: 'artist-1' })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should navigate to the vertical similar-artists playlist when tapping "Voir tout"', async () => {
    mockServer.getApi(`/v1/artists/${artistId}/similar`, similarArtistsResponse)

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    const seeAllButton = await screen.findByLabelText(`Voir tout pour la sélection ${TITLE}`)
    await user.press(seeAllButton)

    expect(mockNavigate).toHaveBeenCalledWith('VerticalPlaylistArtists', {
      title: TITLE,
      subtitle: undefined,
      similarToArtistId: artistId,
    })
  })

  it('should log click see all analytics with from=artist when tapping "Voir tout"', async () => {
    mockServer.getApi(`/v1/artists/${artistId}/similar`, similarArtistsResponse)

    render(reactQueryProviderHOC(<ArtistSimilarArtists artistId={artistId} />))

    const seeAllButton = await screen.findByLabelText(`Voir tout pour la sélection ${TITLE}`)
    await user.press(seeAllButton)

    expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
      type: 'artists',
      moduleName: TITLE,
      from: 'artist',
    })
  })
})
