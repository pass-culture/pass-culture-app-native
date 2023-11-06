import React from 'react'

import { SameArtistPlaylist } from 'features/offer/components/SameArtistPlaylist/component/SameArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { render, screen } from 'tests/utils'

const renderItemMock = jest.fn().mockReturnValue(null)
const itemWidth = 100
const itemHeight = 50

describe('<SameArtistPlaylist />', () => {
  it('should display correctly the same artist playlist', async () => {
    render(
      <SameArtistPlaylist
        items={mockedAlgoliaOffersWithSameArtistResponse}
        renderItem={renderItemMock}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
      />
    )

    expect(screen.getByTestId('sameArtistPlaylist')).toBeOnTheScreen()
  })

  it('should call the list with the data from the mock', async () => {
    render(
      <SameArtistPlaylist
        items={mockedAlgoliaOffersWithSameArtistResponse}
        renderItem={renderItemMock}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
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
