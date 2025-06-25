import React from 'react'

import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as fetchOffersByArtistAPI from 'queries/offer/fetchOffersByArtist'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { ArtistPlaylistContainer } from './ArtistPlaylistContainer'

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

const fetchOffersByArtistSpy = jest
  .spyOn(fetchOffersByArtistAPI, 'fetchOffersByArtist')
  .mockResolvedValue({
    playlistHits: mockedAlgoliaOffersWithSameArtistResponse,
    topOffersHits: mockedAlgoliaOffersWithSameArtistResponse.splice(0, 4),
  })

describe('ArtistPlaylistContainer', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
    mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
  })

  it('should display artist playlist when there is some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistPlaylistContainer artistId={mockArtist.id} />))

    expect(await screen.findByText('Manga Série "One piece" - Tome 4')).toBeOnTheScreen()
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistPlaylistContainer artistId={mockArtist.id} />))

    await waitFor(() =>
      expect(screen.queryByText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    )
  })

  it.only('should use bookFormat if available in playlist item', async () => {
    render(reactQueryProviderHOC(<ArtistPlaylistContainer artistId={mockArtist.id} />))

    expect(await screen.findByText('Poche')).toBeOnTheScreen()
  })

  it('should not use bookFormat if is not in playlist item', async () => {
    render(reactQueryProviderHOC(<ArtistPlaylistContainer artistId={mockArtist.id} />))

    await screen.findByText('Toutes ses offres disponibles')

    expect(screen.getAllByText('Livre')[1]).toBeOnTheScreen()
  })
})
