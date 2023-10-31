import React from 'react'

import { HitOfferWithArtistAndEan } from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { SameArtistPlaylist } from 'features/offer/components/SameArtistPlaylist/component/SameArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { render, screen } from 'tests/utils'

const renderItemMock = jest.fn().mockReturnValue(null)
const itemWidth = 100
const itemHeight = 50
const keyExtractor = (offer: HitOfferWithArtistAndEan) => offer.objectID

describe('<SameArtistPlaylist />', () => {
  it('should display correctly the same artist playlist', async () => {
    render(
      <SameArtistPlaylist
        sameArtistPlaylist={mockedAlgoliaOffersWithSameArtistResponse}
        renderItem={renderItemMock}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        keyExtractor={keyExtractor}
      />
    )

    expect(screen.getByTestId('sameArtistPlaylist')).toBeOnTheScreen()
  })
})
