import React from 'react'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as ABSegmentModule from 'shared/useABSegment/useABSegment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

const useABSegmentSpy = jest.spyOn(ABSegmentModule, 'useABSegment')

describe('ArtistPlaylist', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display artist playlist when there is some offer from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Toutes ses offres disponibles')

    expect(screen.getByLabelText('Toutes ses offres disponibles')).toBeOnTheScreen()
    expect(screen.getByText('Manga Série "One piece" - Tome 3')).toBeOnTheScreen()
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await waitFor(() =>
      expect(screen.queryByLabelText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    )
  })

  it('should use bookFormat if available in playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Toutes ses offres disponibles')

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should not use bookFormat if is not in playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Toutes ses offres disponibles')

    expect(screen.getAllByText('Livre')[1]).toBeOnTheScreen()
  })

  it('should display pro advices tag when defined and pro advices AB testing segment is A', async () => {
    useABSegmentSpy.mockReturnValueOnce('A')
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[0],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[0].offer, proAdvicesCount: 1 },
            },
          ]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Toutes ses offres disponibles')

    expect(screen.getByText('1 avis')).toBeOnTheScreen()
  })

  it('should not display pro advices tag when defined and pro advices AB testing segment is B', async () => {
    useABSegmentSpy.mockReturnValueOnce('B')
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[0],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[0].offer, proAdvicesCount: 1 },
            },
          ]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Toutes ses offres disponibles')

    expect(screen.queryByText('1 avis')).not.toBeOnTheScreen()
  })
})
