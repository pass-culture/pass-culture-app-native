import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockArtistLadyGaga } from 'features/artist/fixtures/mockArtist'
import { HorizontalArtistTile } from 'shared/verticalPlaylist/components/HorizontalArtistTile'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()

jest.useFakeTimers()

describe('HorizontalArtistTile', () => {
  it('should render the artist name and role correctly', () => {
    render(<HorizontalArtistTile artist={{ ...mockArtistLadyGaga, role: 'Interprète' }} />)

    expect(screen.getByText('Lady Gaga')).toBeOnTheScreen()
    expect(screen.getByText('Interprète')).toBeOnTheScreen()
  })

  it('should render the artist image when an image URL is provided', () => {
    render(<HorizontalArtistTile artist={mockArtistLadyGaga} />)

    expect(screen.getByTestId('artistAvatar')).toBeOnTheScreen()
  })

  it('should render the default avatar when no image URL is provided', () => {
    render(<HorizontalArtistTile artist={{ ...mockArtistLadyGaga, image: undefined }} />)

    expect(screen.getByTestId('defaultArtistAvatar')).toBeOnTheScreen()
  })

  it('should navigate to artist page when artist has an id and pressing tile', async () => {
    render(<HorizontalArtistTile artist={{ ...mockArtistLadyGaga, role: 'Interprète' }} />)

    await user.press(screen.getByLabelText('Lady Gaga - Interprète'))

    expect(navigate).toHaveBeenCalledWith('Artist', { id: mockArtistLadyGaga.id })
  })

  it('should not activate artist page navigation when artist has not an id', () => {
    render(<HorizontalArtistTile artist={{ ...mockArtistLadyGaga, role: 'Interprète', id: '' }} />)

    expect(screen.queryByLabelText('Lady Gaga - Interprète')).not.toBeOnTheScreen()
  })
})
