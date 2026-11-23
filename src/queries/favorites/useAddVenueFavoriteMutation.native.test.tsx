import React from 'react'
import { View } from 'react-native'

import { FavoriteVenueResponse } from 'api/gen'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoriteType } from 'features/favorites/enum'
import { favoriteVenueResponseSnap } from 'features/favorites/fixtures/favoriteVenueResponseSnap'
import * as firstFavoriteModule from 'features/favorites/helpers/firstFavoriteSnackBar'
import { simulateBackendForVenue } from 'features/favorites/tests/simulateBackendForVenue'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useAddVenueFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { DefaultWrapper, renderHook, waitFor } from 'tests/utils'
import * as SnackBarStore from 'ui/designSystem/Snackbar/snackBar.store'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const mockSnackBarOpen = jest.spyOn(SnackBarStore.snackBarActions, 'open')
const mockTriggerFirstFavoriteSnackBar = jest.spyOn(
  firstFavoriteModule,
  'triggerFirstFavoriteSnackBar'
)

const venueId = venueDataTest.id

describe('useAddVenueFavoriteMutation', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should add favorite', async () => {
    simulateBackendForVenue({
      id: venueId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onSuccess = jest.fn()
    const result = renderUseAddFavorite(onSuccess)

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ venueId })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(favoriteVenueResponseSnap)
    })
  })

  it('should trigger first favorite snack bar function when wipFavoritesHub FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    simulateBackendForVenue({
      id: venueId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ venueId })

    await waitFor(() => {
      expect(mockTriggerFirstFavoriteSnackBar).toHaveBeenCalledWith(FavoriteType.VENUE)
    })
  })

  it('should not trigger first favorite snack bar function when wipFavoritesHub FF deactivated', async () => {
    simulateBackendForVenue({
      id: venueId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ venueId })

    await waitFor(() => {
      expect(mockTriggerFirstFavoriteSnackBar).not.toHaveBeenCalled()
    })
  })

  it('should show snack bar when fail to add favorite', async () => {
    simulateBackendForVenue({
      id: venueId,
      hasAddFavoriteError: true,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ venueId })

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'Le lieu n’a pas été ajouté à tes favoris',
        'error'
      )
    })
  })

  it('should show snack bar when too many favorites when trying to add favorite', async () => {
    simulateBackendForVenue({
      id: venueId,
      hasAddFavoriteError: false,
      hasTooManyFavorites: true,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ venueId })

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        'error'
      )
    })
  })
})

const renderUseAddFavorite = (onSuccess?: (data?: FavoriteVenueResponse | undefined) => void) => {
  const { result } = renderHook(
    () => useAddVenueFavoriteMutation({ type: FavoriteType.VENUE, onSuccess }),
    {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <DefaultWrapper>
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          </DefaultWrapper>
        ),
    }
  )
  return result
}
