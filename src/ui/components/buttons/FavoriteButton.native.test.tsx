import React from 'react'

import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { favoriteArtistResponseSnap } from 'features/favorites/fixtures/favoriteArtistResponseSnap'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { FavoriteButton, FavoriteButtonProps } from 'ui/components/buttons/FavoriteButton'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

jest.useFakeTimers()
const user = userEvent.setup()

const defaultOfferProps: FavoriteButtonProps = {
  offerId: 116656,
  addFavorite: jest.fn(),
  isAddFavoriteLoading: false,
  removeFavorite: jest.fn(),
  isRemoveFavoriteLoading: false,
  favorite: null,
}

const defaultArtistProps: FavoriteButtonProps = {
  artistId: mockArtist.id,
  addFavorite: jest.fn(),
  isAddFavoriteLoading: false,
  removeFavorite: jest.fn(),
  isRemoveFavoriteLoading: false,
  favorite: null,
}

const renderFavoriteButton = (props: FavoriteButtonProps = defaultOfferProps) => {
  return render(reactQueryProviderHOC(<FavoriteButton {...props} />))
}

describe('<FavoriteButton />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render favorite icon', async () => {
    renderFavoriteButton()

    expect(await screen.findByLabelText('Mettre en favori')).toBeOnTheScreen()
  })

  it('should enable the favorites button when is not loading', async () => {
    renderFavoriteButton()

    expect(await screen.findByLabelText('Mettre en favori')).toBeEnabled()
  })

  it('should disable the favorites button when is loading', async () => {
    renderFavoriteButton({
      ...defaultOfferProps,
      isAddFavoriteLoading: true,
      isRemoveFavoriteLoading: true,
    })

    expect(await screen.findByLabelText('Mettre en favori')).toBeDisabled()
  })

  describe('with offerId', () => {
    describe('user is logged in', () => {
      it('should show "Retirer des favoris" when offer is in favorite', async () => {
        renderFavoriteButton({
          ...defaultOfferProps,
          favorite: { id: favoriteResponseSnap.id, offer: favoriteResponseSnap.offer },
        })

        expect(await screen.findByLabelText('Retirer des favoris')).toBeOnTheScreen()
      })

      it('should call addFavorite with offerId when pressing button and offer is not in favorite', async () => {
        const mockAddFavorite = jest.fn()
        renderFavoriteButton({
          ...defaultOfferProps,
          addFavorite: mockAddFavorite,
        })

        const button = await screen.findByLabelText('Mettre en favori')
        await user.press(button)

        expect(mockAddFavorite).toHaveBeenCalledTimes(1)
        expect(mockAddFavorite).toHaveBeenCalledWith({ offerId: defaultOfferProps.offerId })
      })

      it('should call removeFavorite when pressing button and offer is in favorite', async () => {
        const mockRemoveFavorite = jest.fn()
        renderFavoriteButton({
          ...defaultOfferProps,
          favorite: { id: favoriteResponseSnap.id, offer: favoriteResponseSnap.offer },
          removeFavorite: mockRemoveFavorite,
        })

        const button = await screen.findByLabelText('Retirer des favoris')
        await user.press(button)

        expect(mockRemoveFavorite).toHaveBeenCalledTimes(1)
        expect(mockRemoveFavorite).toHaveBeenCalledWith(favoriteResponseSnap.id)
      })
    })

    describe('user is not logged in', () => {
      beforeEach(() => {
        mockAuthContextWithoutUser()
      })

      it('should display SignIn modal when pressing Favorite', async () => {
        renderFavoriteButton(defaultOfferProps)

        await user.press(await screen.findByLabelText('Mettre en favori'))

        expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
      })
    })
  })

  describe('with artistId', () => {
    describe('user is logged in', () => {
      it('should show "Retirer des favoris" when artist is in favorite', async () => {
        renderFavoriteButton({
          ...defaultArtistProps,
          favorite: {
            id: favoriteArtistResponseSnap.id,
            artist: mockArtist,
          },
        })

        expect(await screen.findByLabelText('Retirer des favoris')).toBeOnTheScreen()
      })

      it('should call addFavorite with artistId when pressing button and artist is not in favorite', async () => {
        const mockAddFavorite = jest.fn()
        renderFavoriteButton({
          ...defaultArtistProps,
          addFavorite: mockAddFavorite,
        })

        const button = await screen.findByLabelText('Mettre en favori')
        await user.press(button)

        expect(mockAddFavorite).toHaveBeenCalledTimes(1)
        expect(mockAddFavorite).toHaveBeenCalledWith({ artistId: mockArtist.id })
      })

      it('should call removeFavorite with favorite.id when pressing button and artist is in favorite', async () => {
        const mockRemoveFavorite = jest.fn()
        renderFavoriteButton({
          ...defaultArtistProps,
          favorite: {
            id: favoriteArtistResponseSnap.id,
            artist: mockArtist,
          },
          removeFavorite: mockRemoveFavorite,
        })

        const button = await screen.findByLabelText('Retirer des favoris')
        await user.press(button)

        expect(mockRemoveFavorite).toHaveBeenCalledTimes(1)
        expect(mockRemoveFavorite).toHaveBeenCalledWith(favoriteArtistResponseSnap.id)
      })
    })

    describe('user is not logged in', () => {
      beforeEach(() => {
        mockAuthContextWithoutUser()
      })

      it('should display SignIn modal when pressing Favorite with artistId', async () => {
        renderFavoriteButton(defaultArtistProps)

        await user.press(await screen.findByLabelText('Mettre en favori'))

        expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
      })
    })
  })
})
