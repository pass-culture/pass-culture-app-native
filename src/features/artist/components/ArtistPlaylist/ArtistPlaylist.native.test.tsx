import React from 'react'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

describe('ArtistPlaylist', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display artist playlist when there is some offer from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    await screen.findByText('Toutes ses offres disponibles')

    expect(screen.getByText('Toutes ses offres disponibles')).toBeOnTheScreen()
    expect(screen.getByText('Manga Série "One piece" - Tome 3')).toBeOnTheScreen()
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistPlaylist artistName="Céline Dion" items={[]} />))

    await waitFor(() =>
      expect(screen.queryByText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    )
  })

  it('should use bookFormat if available in playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    await screen.findByText('Toutes ses offres disponibles')

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should not use bookFormat if is not in playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    await screen.findByText('Toutes ses offres disponibles')

    expect(screen.getAllByText('Livre')[1]).toBeOnTheScreen()
  })
})
