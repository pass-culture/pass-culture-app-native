import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteVenue } from 'features/favorites/components/FavoriteVenue'
import { FavoriteType } from 'features/favorites/enum'
import { favoriteVenueResponseSnap } from 'features/favorites/fixtures/favoriteVenueResponseSnap'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useRemoveVenueFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
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
const useRemoveVenueFavoriteMutationSpy = jest.spyOn(
  useRemoveFavoriteMutationModule,
  'useRemoveVenueFavoriteMutation'
)

const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

const user = userEvent.setup()
jest.useFakeTimers()

describe('<FavoriteVenue /> component', () => {
  beforeEach(() => {
    setFeatureFlags()
    useRemoveVenueFavoriteMutationSpy.mockReturnValue({
      mutate: mockRemoveFavorite,
      isPending: false,
    } as unknown as ReturnType<typeof useRemoveVenueFavoriteMutation>)
  })

  it('should display venue name', () => {
    renderFavoriteVenue()

    expect(screen.getByText(favoriteVenueResponseSnap.venue.name)).toBeOnTheScreen()
  })

  it('should display venue image when image url is provided', () => {
    renderFavoriteVenue()

    expect(screen.getByTestId('VenuePreviewImage')).toBeOnTheScreen()
  })

  it('should not display venue image when venue has no image', () => {
    renderFavoriteVenue({
      favorite: {
        ...favoriteVenueResponseSnap,
        venue: {
          ...favoriteVenueResponseSnap.venue,
          image: null,
        },
      },
    })

    expect(screen.queryByTestId('VenuePreviewImage')).not.toBeOnTheScreen()
  })

  it('should navigate to Venue screen when pressing the item', async () => {
    renderFavoriteVenue()

    await user.press(screen.getByText(favoriteVenueResponseSnap.venue.name))

    expect(navigate).toHaveBeenCalledWith('Venue', {
      id: favoriteVenueResponseSnap.venue.id,
    })
  })

  it('should trigger ConsultVenue log when pressing the item', async () => {
    renderFavoriteVenue()

    await user.press(screen.getByText(favoriteVenueResponseSnap.venue.name))

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({
      venueId: favoriteVenueResponseSnap.venue.id.toString(),
      from: 'favorites',
    })
  })

  it('should delete favorite on button click', async () => {
    renderFavoriteVenue()

    await user.press(screen.getByLabelText('Retirer des favoris'))

    await waitFor(() => {
      expect(mockRemoveFavorite).toHaveBeenNthCalledWith(1, favoriteVenueResponseSnap.id)
      expect(screen.queryByTestId('snackbar-error')).not.toBeOnTheScreen()
    })
  })

  it('should trigger RemoveItemFromFavorite log on button click', async () => {
    useRemoveVenueFavoriteMutationSpy.mockImplementationOnce(
      (options) =>
        ({
          mutate: () => options.onSuccess?.(undefined),
          isPending: false,
        }) as unknown as ReturnType<typeof useRemoveVenueFavoriteMutation>
    )
    renderFavoriteVenue()

    await user.press(screen.getByLabelText('Retirer des favoris'))

    await waitFor(() => {
      expect(analytics.logRemoveItemFromFavorite).toHaveBeenNthCalledWith(1, {
        id: favoriteVenueResponseSnap.venue.id.toString(),
        type: FavoriteType.VENUE,
        from: 'favorites',
      })
    })
  })

  it('should fail to delete favorite on button click', async () => {
    useRemoveVenueFavoriteMutationSpy.mockImplementationOnce(
      (options) =>
        ({
          mutate: () =>
            options.onError?.(new Error('API error'), favoriteVenueResponseSnap.id, undefined),
          isPending: false,
        }) as unknown as ReturnType<typeof useRemoveVenueFavoriteMutation>
    )

    renderFavoriteVenue()

    await user.press(screen.getByLabelText('Retirer des favoris'))

    await waitFor(() => {
      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(screen.getByText('Le lieu n’a pas été retiré de tes favoris')).toBeOnTheScreen()
    })
  })

  it('should call share when pressing share icon', async () => {
    renderFavoriteVenue()

    const shareButton = await screen.findByLabelText(
      `Partager le lieu ${favoriteVenueResponseSnap.venue.name}`
    )
    await user.press(shareButton)

    expect(shareSpy).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when pressing share icon', async () => {
    renderFavoriteVenue()

    const shareButton = await screen.findByLabelText(
      `Partager le lieu ${favoriteVenueResponseSnap.venue.name}`
    )
    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Venue',
      from: 'favorites',
      venueId: favoriteVenueResponseSnap.venue.id,
    })
  })
})

function renderFavoriteVenue(props?: Partial<React.ComponentProps<typeof FavoriteVenue>>) {
  return render(
    reactQueryProviderHOC(<FavoriteVenue favorite={favoriteVenueResponseSnap} {...props} />)
  )
}
