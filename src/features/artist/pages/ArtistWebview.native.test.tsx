import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { ArtistWebview } from './ArtistWebview'

jest.mock('libs/firebase/analytics/analytics')
useRoute.mockReturnValue({ params: { id: mockArtist.id } })

describe('ArtistWebview', () => {
  it('should display page not found when artist has not a description source', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
      ...mockArtist,
      descriptionSource: undefined,
    })
    setFeatureFlags()

    render(reactQueryProviderHOC(<ArtistWebview />))

    expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
  })

  it('should display web view when artist has a description source', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    render(reactQueryProviderHOC(<ArtistWebview />))

    expect(await screen.findByText('Avril Lavigne sur Wikipédia')).toBeOnTheScreen()
    expect(screen.getByTestId('artist-webview')).toBeOnTheScreen()
  })
})
