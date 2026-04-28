import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { SeeAllButton } from './SeeAllButton'

const user = userEvent.setup()
const accessibilityLabel = 'Tout voir pour la sélection Ma playlist'
const baseProps = { playlistTitle: 'Ma playlist', data: { onBeforeNavigate: jest.fn() } }

describe('<SeeAllButton />', () => {
  it('should not be displayed when data is undefined', () => {
    render(<SeeAllButton playlistTitle="Ma playlist" />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should not be displayed when no navigation targets are provided', () => {
    render(<SeeAllButton {...baseProps} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should be displayed when vertical playlist button is available', async () => {
    render(
      <SeeAllButton
        {...baseProps}
        data={{
          ...baseProps.data,
          hidePlaylistSeeAll: false,
          navigateToVerticalPlaylist: { screen: 'VerticalPlaylistOffers' },
          navigateToSearchPlaylist: undefined,
        }}
      />
    )

    const seeAllInVerticalPlaylistButton = screen.getByTestId(accessibilityLabel)
    await user.press(seeAllInVerticalPlaylistButton)

    expect(navigate).toHaveBeenCalledWith('VerticalPlaylistOffers', undefined)
  })

  it('should be displayed when search button is available and vertical playlist is not', async () => {
    render(
      <SeeAllButton
        {...baseProps}
        data={{
          ...baseProps.data,
          hidePlaylistSeeAll: false,
          navigateToVerticalPlaylist: undefined,
          navigateToSearchPlaylist: {
            screen: 'TabNavigator',
            params: { screen: 'SearchStackNavigator', params: { screen: 'SearchResults' } },
          },
        }}
      />
    )

    const seeAllInSearchButton = screen.getByTestId(accessibilityLabel)
    await user.press(seeAllInSearchButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchResults' },
    })
  })

  it('should prioritize vertical playlist over search when both are provided', async () => {
    render(
      <SeeAllButton
        {...baseProps}
        data={{
          ...baseProps.data,
          hidePlaylistSeeAll: false,
          navigateToVerticalPlaylist: { screen: 'VerticalPlaylistOffers' },
          navigateToSearchPlaylist: {
            screen: 'TabNavigator',
            params: { screen: 'SearchStackNavigator', params: { screen: 'SearchResults' } },
          },
        }}
      />
    )

    const seeAllInVerticalPlaylistButton = screen.getByTestId(accessibilityLabel)
    await user.press(seeAllInVerticalPlaylistButton)

    expect(navigate).toHaveBeenCalledWith('VerticalPlaylistOffers', undefined)
  })

  it('should not be displayed when hidePlaylistSeeAll is true', () => {
    render(
      <SeeAllButton
        {...baseProps}
        data={{
          ...baseProps.data,
          hidePlaylistSeeAll: true,
          navigateToVerticalPlaylist: { screen: 'VerticalPlaylistOffers' },
          navigateToSearchPlaylist: undefined,
        }}
      />
    )

    expect(screen.toJSON()).toBeNull()
  })

  it('should not be displayed when hideSearchSeeAll is true', () => {
    render(
      <SeeAllButton
        {...baseProps}
        data={{
          ...baseProps.data,
          hidePlaylistSeeAll: true,
          hideSearchSeeAll: true,
          navigateToVerticalPlaylist: undefined,
          navigateToSearchPlaylist: {
            screen: 'TabNavigator',
            params: { screen: 'SearchStackNavigator', params: { screen: 'SearchResults' } },
          },
        }}
      />
    )

    expect(screen.toJSON()).toBeNull()
  })
})
