import React from 'react'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import * as useSameArtistPlaylist from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const useSameArtistPlaylistSpy = jest
  .spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist')
  .mockImplementation()
  .mockReturnValue({
    sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
  })

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('ArtistPlaylist', () => {
  it('should display artist playlist when there is some offer from this artist', () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist offer={mockOffer} subcategory={mockSubcategory} artistName="Céline Dion" />
      )
    )

    expect(screen.getByText('Toutes ses offres disponibles')).toBeOnTheScreen()
    expect(screen.getByText('Manga Série "One piece" - Tome 5')).toBeOnTheScreen()
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    useSameArtistPlaylistSpy.mockReturnValueOnce({
      sameArtistPlaylist: [],
    })
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist offer={mockOffer} subcategory={mockSubcategory} artistName="Céline Dion" />
      )
    )

    expect(screen.queryByText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    expect(screen.queryByText('Manga Série "One piece" - Tome 5')).not.toBeOnTheScreen()
  })
})
