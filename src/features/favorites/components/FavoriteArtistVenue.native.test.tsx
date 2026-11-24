import React from 'react'
import { View } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteArtistVenue } from 'features/favorites/components/FavoriteArtistVenue'
import { favoriteArtistResponseSnap } from 'features/favorites/fixtures/favoriteArtistResponseSnap'
import { favoriteVenueResponseSnap } from 'features/favorites/fixtures/favoriteVenueResponseSnap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

const mockOnSharePress = jest.fn()

const defaultProps = {
  favorite: favoriteVenueResponseSnap,
  title: favoriteVenueResponseSnap.venue.name,
  subtitle: '1 rue de la paix, 75000 PARIS',
  navigateTo: { screen: 'Venue' as const, params: { id: 123 } },
  shareAccessibilityLabel: 'Partager le lieu',
  isRemoving: false,
  onRemove: jest.fn(),
  onSharePress: mockOnSharePress,
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('FavoriteArtistVenue', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should compute accessibility label and redirect to page in navigateTo', async () => {
    render(<FavoriteArtistVenue {...defaultProps} />)

    await user.press(screen.getByLabelText('Le Petit Rintintin 1 - 1 rue de la paix, 75000 PARIS'))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: 123 })
  })

  it('should trigger item pressing when item pressed', async () => {
    const mockOnPress = jest.fn()
    render(<FavoriteArtistVenue {...defaultProps} onPress={mockOnPress} />)

    await user.press(screen.getByText('Le Petit Rintintin 1'))

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('should render item with title and subtitle', () => {
    render(<FavoriteArtistVenue {...defaultProps} />)

    expect(screen.getByText('Le Petit Rintintin 1')).toBeOnTheScreen()
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

  describe('actions', () => {
    it('should call onSharePress when share button pressed', async () => {
      render(<FavoriteArtistVenue {...defaultProps} />)

      await user.press(screen.getByLabelText('Partager le lieu'))

      expect(mockOnSharePress).toHaveBeenCalledTimes(1)
    })

    it('should use the share accessibility label given in props', () => {
      render(
        <FavoriteArtistVenue
          {...defaultProps}
          favorite={favoriteArtistResponseSnap}
          shareAccessibilityLabel="Partager l’artiste"
        />
      )

      expect(screen.getByLabelText('Partager l’artiste')).toBeOnTheScreen()
    })
  })
})
