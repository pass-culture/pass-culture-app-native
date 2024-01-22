import React from 'react'

import { OfferPlaylistOld } from 'features/offer/components/OfferPlaylistOld/component/OfferPlaylistOld'
import { PlaylistType } from 'features/offer/enums'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { render, screen } from 'tests/utils'

const renderItemMock = jest.fn().mockReturnValue(null)
const itemWidth = 100
const itemHeight = 50

describe('<OfferPlaylistOld />', () => {
  it('should display correctly the playlist', async () => {
    render(
      <OfferPlaylistOld
        items={mockedAlgoliaOffersWithSameArtistResponse}
        renderItem={renderItemMock}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        title="Du même auteur"
        playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      />
    )

    expect(screen.getByTestId('sameArtistPlaylist')).toBeOnTheScreen()
  })

  it('should render the playlist title', () => {
    render(
      <OfferPlaylistOld
        items={mockedAlgoliaOffersWithSameArtistResponse}
        renderItem={renderItemMock}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        title="Ça peut aussi te plaire"
        playlistType={PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS}
      />
    )

    expect(screen.getByText('Ça peut aussi te plaire')).toBeOnTheScreen()
  })

  it('should call the list with the data from the mock', async () => {
    render(
      <OfferPlaylistOld
        items={mockedAlgoliaOffersWithSameArtistResponse}
        renderItem={renderItemMock}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        title="Du même auteur"
        playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      />
    )

    expect(renderItemMock).toHaveBeenCalledWith({
      item: mockedAlgoliaOffersWithSameArtistResponse[0],
      index: 0,
      target: 'Cell',
      height: itemHeight,
      width: itemWidth,
      playlistType: 'sameArtistPlaylist',
    })
    expect(renderItemMock).toHaveBeenCalledWith({
      item: mockedAlgoliaOffersWithSameArtistResponse[1],
      index: 1,
      target: 'Cell',
      height: itemHeight,
      width: itemWidth,
      playlistType: 'sameArtistPlaylist',
    })
    expect(renderItemMock).toHaveBeenCalledWith({
      item: mockedAlgoliaOffersWithSameArtistResponse[2],
      index: 2,
      target: 'Cell',
      height: itemHeight,
      width: itemWidth,
      playlistType: 'sameArtistPlaylist',
    })
  })
})
