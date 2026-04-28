import React from 'react'

import { render, screen } from 'tests/utils/web'

import { SeeAllButton } from './SeeAllButton'

const accessibilityLabel = 'Tout voir pour la sélection Ma playlist'

describe('<SeeAllButton />', () => {
  it('should not be displayed when no navigation targets are provided', () => {
    render(
      <SeeAllButton
        playlistTitle="Ma playlist"
        data={{
          hidePlaylistSeeAll: false,
          navigateToVerticalPlaylist: { screen: 'VerticalPlaylistOffers' },
          navigateToSearchPlaylist: undefined,
          onBeforeNavigate: jest.fn(),
        }}
      />
    )

    const seeAllInVerticalPlaylistButton = screen.queryByTestId(accessibilityLabel)

    expect(seeAllInVerticalPlaylistButton).not.toBeInTheDocument()
  })

  it('should display search button', async () => {
    render(
      <SeeAllButton
        playlistTitle="Ma playlist"
        data={{
          hidePlaylistSeeAll: false,
          navigateToVerticalPlaylist: undefined,
          onBeforeNavigate: jest.fn(),
          navigateToSearchPlaylist: {
            screen: 'TabNavigator',
            params: { screen: 'SearchStackNavigator', params: { screen: 'SearchResults' } },
          },
        }}
      />
    )

    const seeAllInSearchButton = screen.getByTestId(accessibilityLabel)

    expect(seeAllInSearchButton).toBeInTheDocument()
  })
})
