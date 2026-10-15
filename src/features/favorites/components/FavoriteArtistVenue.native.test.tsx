import React from 'react'
import { View } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteArtistVenue } from 'features/favorites/components/FavoriteArtistVenue'
import { render, screen, userEvent } from 'tests/utils'

const defaultProps = {
  title: 'Super ciné',
  subtitle: '1 rue de la paix, 75000 PARIS',
  navigateTo: { screen: 'Venue' as const, params: { id: 123 } },
  shareAccessibilityLabel: 'Partager le lieu',
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('FavoriteArtistVenue', () => {
  it('should compute accessibility label and redirect to page in navigateTo', async () => {
    render(<FavoriteArtistVenue {...defaultProps} />)

    await user.press(screen.getByLabelText('Super ciné - 1 rue de la paix, 75000 PARIS'))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: 123 })
  })

  it('should trigger item pressing when item pressed', async () => {
    const mockOnPress = jest.fn()
    render(<FavoriteArtistVenue {...defaultProps} onPress={mockOnPress} />)

    await user.press(screen.getByText('Super ciné'))

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('should render item with title and subtitle', () => {
    render(<FavoriteArtistVenue {...defaultProps} />)

    expect(screen.getByText('Super ciné')).toBeOnTheScreen()
    expect(screen.getByText('1 rue de la paix, 75000 PARIS')).toBeOnTheScreen()
  })

  it('should display thumbnail component when defined', () => {
    render(
      <FavoriteArtistVenue
        {...defaultProps}
        thumbnailComponent={<View testID="custom-thumbnail" />}
      />
    )

    expect(screen.getByTestId('custom-thumbnail')).toBeOnTheScreen()
  })
})
