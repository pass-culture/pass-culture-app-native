import React from 'react'

import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { FavoriteButton, FavoriteButtonProps } from 'ui/components/buttons/FavoriteButton'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<FavoriteButton />', () => {
  it('should render favorite icon', async () => {
    renderFavoriteButton()

    await screen.findByLabelText('Mettre en favori')

    expect(screen.getByTestId('icon-favorite')).toBeOnTheScreen()
  })

  it('should enable the favorites button when is not loading', async () => {
    renderFavoriteButton()

    await screen.findByLabelText('Mettre en favori')

    expect(screen.getByLabelText('Mettre en favori')).not.toBeDisabled()
  })

  it('should disabled the favorites button when is loading', async () => {
    renderFavoriteButton({
      ...defaultProps,
      isAddFavoriteLoading: true,
      isRemoveFavoriteLoading: true,
    })

    await screen.findByLabelText('Mettre en favori')

    expect(screen.getByLabelText('Mettre en favori')).toBeDisabled()
  })

  describe('user is logged in', () => {
    it('should show a favorite filled icon when viewing a offer in favorite', async () => {
      renderFavoriteButton({
        ...defaultProps,
        favorite: { id: favoriteResponseSnap.id, offer: favoriteResponseSnap.offer },
      })

      expect(screen.getByTestId('icon-favorite-filled')).toBeOnTheScreen()
    })
  })

  describe('user is not logged in', () => {
    beforeEach(() => {
      mockAuthContextWithoutUser()
    })

    it('should display SignIn modal when pressing Favorite', async () => {
      renderFavoriteButton()

      await user.press(screen.getByTestId('icon-favorite'))

      expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
    })
  })
})

const defaultProps = {
  offerId: 116656,
  animationState: undefined,
  addFavorite: jest.fn(),
  isAddFavoriteLoading: false,
  removeFavorite: jest.fn(),
  isRemoveFavoriteLoading: false,
  favorite: null,
}

const renderFavoriteButton = (props: FavoriteButtonProps = defaultProps) => {
  return render(reactQueryProviderHOC(<FavoriteButton {...props} />))
}
