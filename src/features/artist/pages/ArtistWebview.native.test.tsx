import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { ArtistWebview } from './ArtistWebview'

jest.mock('libs/firebase/analytics/analytics')
useRoute.mockReturnValue({ params: { id: mockArtist.id } })

describe('ArtistWebview', () => {
  it('should display page not found when wipArtistPage FF deactivated', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    setFeatureFlags()

    render(reactQueryProviderHOC(<ArtistWebview />))

    expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
  })

  it('should display web view when wipArtistPage FF activated', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
    render(reactQueryProviderHOC(<ArtistWebview />))

    expect(await screen.findByText('Avril Lavigne sur Wikipédia')).toBeOnTheScreen()
    expect(screen.getByTestId('artist-webview')).toBeOnTheScreen()
  })
})
