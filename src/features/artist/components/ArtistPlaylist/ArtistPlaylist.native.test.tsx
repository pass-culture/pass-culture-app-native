import React from 'react'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

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

describe('ArtistPlaylist', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display artist playlist when there is some offer from this artist', () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByText('Toutes ses offres disponibles')).toBeOnTheScreen()
    expect(screen.getByText('Manga Série "One piece" - Tome 5')).toBeOnTheScreen()
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistPlaylist artistName="Céline Dion" items={[]} />))

    expect(screen.queryByText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    expect(screen.queryByText('Manga Série "One piece" - Tome 5')).not.toBeOnTheScreen()
  })

  it('should use bookFormat if available in playlist item', () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should not use bookFormat if is not in playlist item', () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getAllByText('Livre')[1]).toBeOnTheScreen()
  })
})
