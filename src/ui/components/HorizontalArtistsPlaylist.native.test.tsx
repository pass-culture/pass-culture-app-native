import React from 'react'

import { mockArtist, mockArtists } from 'features/artist/fixtures/mockArtist'
import { render, screen, userEvent } from 'tests/utils'

import {
  HorizontalArtistsPlaylist,
  HorizontalArtistsPlaylistProps,
} from './HorizontalArtistsPlaylist'

const mockSeeAllData: HorizontalArtistsPlaylistProps['seeAllData'] = {
  onBeforeNavigate: jest.fn(),
  navigateToVerticalPlaylist: {
    screen: 'VerticalPlaylistArtists',
    params: {
      title: 'Top Artists',
      originDetails: 'topArtistsPlaylist',
    },
  },
  hideSearchSeeAll: true,
}

const defaultProps: HorizontalArtistsPlaylistProps = {
  title: 'Top Artists',
  artists: mockArtists,
  onItemPress: jest.fn(),
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('HorizontalArtistsPlaylist', () => {
  it('should render the skeleton when isLoading is true', () => {
    render(<HorizontalArtistsPlaylist {...defaultProps} isLoading />)

    expect(screen.getByTestId('HorizontalArtistsPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should render nothing when the artists list is empty', () => {
    const { toJSON } = render(<HorizontalArtistsPlaylist {...defaultProps} artists={[]} />)

    expect(toJSON()).toBeNull()
  })

  it('should render the title and artist avatars when data is provided', () => {
    render(<HorizontalArtistsPlaylist {...defaultProps} />)

    expect(screen.getByLabelText('Top Artists')).toBeOnTheScreen()
    expect(screen.getByText('Avril Lavigne')).toBeOnTheScreen()
    expect(screen.getByText('Lady Gaga')).toBeOnTheScreen()
  })

  it('should render see all button when seeAllData is provided and there are multiple artists', () => {
    render(<HorizontalArtistsPlaylist {...defaultProps} seeAllData={mockSeeAllData} />)

    expect(screen.getByLabelText('Voir tout pour la sélection Top Artists')).toBeOnTheScreen()
  })

  it('should not render see all button when there is only one artist', () => {
    render(<HorizontalArtistsPlaylist {...defaultProps} artists={[mockArtist]} />)

    expect(screen.queryByLabelText('Voir tout pour la sélection Top Artists')).not.toBeOnTheScreen()
  })

  it('should not render see all button when seeAllData is not provided', () => {
    render(<HorizontalArtistsPlaylist {...defaultProps} />)

    expect(screen.queryByLabelText('Voir tout pour la sélection Top Artists')).not.toBeOnTheScreen()
  })

  it('should trigger item press with the artist id and name when item is pressed', async () => {
    const mockOnItemPress = jest.fn()
    render(<HorizontalArtistsPlaylist {...defaultProps} onItemPress={mockOnItemPress} />)

    await user.press(screen.getByText('Avril Lavigne'))

    expect(mockOnItemPress).toHaveBeenNthCalledWith(
      1,
      'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
      'Avril Lavigne'
    )
  })
})
