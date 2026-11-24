import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteArtist } from 'features/favorites/components/FavoriteArtist'
import { FavoriteType } from 'features/favorites/enum'
import { favoriteArtistResponseSnap } from 'features/favorites/fixtures/favoriteArtistResponseSnap'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useRemoveFavoriteMutationModule from 'queries/favorites/useRemoveFavoriteMutation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockRemoveFavorite = jest.fn()
const useRemoveArtistFavoriteMutationSpy = jest.spyOn(
  useRemoveFavoriteMutationModule,
  'useRemoveArtistFavoriteMutation'
)

const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

const user = userEvent.setup()
jest.useFakeTimers()

describe('<FavoriteArtist /> component', () => {
  beforeEach(() => {
    setFeatureFlags()
    useRemoveArtistFavoriteMutationSpy.mockReturnValue({
      mutate: mockRemoveFavorite,
      isPending: false,
    } as unknown as ReturnType<
      typeof useRemoveFavoriteMutationModule.useRemoveArtistFavoriteMutation
    >)
  })

  it('should display artist name', () => {
    renderFavoriteArtist()

    expect(screen.getByText(favoriteArtistResponseSnap.artist.name)).toBeOnTheScreen()
  })

  it('should display artist image when image url is provided', () => {
    renderFavoriteArtist()

    expect(screen.getByTestId('ArtistImage')).toBeOnTheScreen()
    expect(screen.queryByTestId('defaultArtistAvatar')).not.toBeOnTheScreen()
  })

  it('should display default avatar when artist has no image', () => {
    renderFavoriteArtist({
      favorite: {
        ...favoriteArtistResponseSnap,
        artist: {
          ...favoriteArtistResponseSnap.artist,
          image: undefined,
        },
      },
    })

    expect(screen.getByTestId('defaultArtistAvatar')).toBeOnTheScreen()
    expect(screen.queryByTestId('ArtistImage')).not.toBeOnTheScreen()
  })

  it('should navigate to Artist screen when pressing the item', async () => {
    renderFavoriteArtist()

    await user.press(screen.getByText(favoriteArtistResponseSnap.artist.name))

    expect(navigate).toHaveBeenCalledWith('Artist', {
      id: favoriteArtistResponseSnap.artist.id,
    })
  })

  it('should delete favorite on button click', async () => {
    renderFavoriteArtist()

    await user.press(screen.getByLabelText('Retirer des favoris'))

    await waitFor(() => {
      expect(mockRemoveFavorite).toHaveBeenNthCalledWith(1, favoriteArtistResponseSnap.id)
      expect(screen.queryByTestId('snackbar-error')).not.toBeOnTheScreen()
    })
  })

  it('should trigger RemoveItemFromFavorite log on button click', async () => {
    useRemoveArtistFavoriteMutationSpy.mockImplementationOnce(
      (options) =>
        ({
          mutate: () => options.onSuccess?.(undefined),
          isPending: false,
        }) as unknown as ReturnType<
          typeof useRemoveFavoriteMutationModule.useRemoveArtistFavoriteMutation
        >
    )
    renderFavoriteArtist()

    await user.press(screen.getByLabelText('Retirer des favoris'))

    await waitFor(() => {
      expect(analytics.logRemoveItemFromFavorite).toHaveBeenNthCalledWith(1, {
        id: favoriteArtistResponseSnap.artist.id,
        type: FavoriteType.ARTIST,
        from: 'favorites',
      })
    })
  })

  it('should fail to delete favorite on button click', async () => {
    useRemoveArtistFavoriteMutationSpy.mockImplementationOnce(
      (options) =>
        ({
          mutate: () =>
            options.onError?.(new Error('API error'), favoriteArtistResponseSnap.id, undefined),
          isPending: false,
        }) as unknown as ReturnType<
          typeof useRemoveFavoriteMutationModule.useRemoveArtistFavoriteMutation
        >
    )

    renderFavoriteArtist()

    await user.press(screen.getByLabelText('Retirer des favoris'))

    await waitFor(() => {
      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(screen.getByText('L’artiste n’a pas été retiré de tes favoris')).toBeOnTheScreen()
    })
  })

  it('should call share when pressing share icon', async () => {
    renderFavoriteArtist()

    const shareButton = await screen.findByLabelText(
      `Partager l’artiste ${favoriteArtistResponseSnap.artist.name}`
    )
    await user.press(shareButton)

    expect(shareSpy).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when pressing share icon', async () => {
    renderFavoriteArtist()

    const shareButton = await screen.findByLabelText(
      `Partager l’artiste ${favoriteArtistResponseSnap.artist.name}`
    )
    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Artist',
      from: 'favorites',
      artistId: favoriteArtistResponseSnap.artist.id,
      artistName: favoriteArtistResponseSnap.artist.name,
    })
  })
})

function renderFavoriteArtist(props?: Partial<React.ComponentProps<typeof FavoriteArtist>>) {
  return render(
    reactQueryProviderHOC(<FavoriteArtist favorite={favoriteArtistResponseSnap} {...props} />)
  )
}
