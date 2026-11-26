import React from 'react'
import { View } from 'react-native'

import { FavoriteArtistResponse } from 'api/gen'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { useFavoritesTabViews } from 'features/favorites/context/FavoritesTabViewsProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoriteType } from 'features/favorites/enum'
import { favoriteArtistResponseSnap } from 'features/favorites/fixtures/favoriteArtistResponseSnap'
import * as firstFavoriteModule from 'features/favorites/helpers/firstFavoriteSnackBar'
import { simulateBackendForArtist } from 'features/favorites/tests/simulateBackendForArtist'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { useAddArtistFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
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

const artistId = mockArtist.id

describe('useAddArtistMutation', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should add favorite', async () => {
    simulateBackendForArtist({
      id: artistId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onSuccess = jest.fn()
    const result = renderUseAddFavorite(onSuccess)

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ artistId })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(favoriteArtistResponseSnap)
    })
  })

  it('should show the favorites badge again after a favorite is added', async () => {
    await storage.saveObject('unviewed_favorite_artist_ids', [])
    simulateBackendForArtist({
      id: artistId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const { result } = renderHook(
      () => ({
        mutation: useAddArtistFavoriteMutation({ type: FavoriteType.ARTIST }),
        favoritesTabViews: useFavoritesTabViews(),
      }),
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

    await waitFor(() => expect(result.current.favoritesTabViews.isReady).toBe(true))

    result.current.mutation.mutate({ artistId })

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true))

    expect(result.current.favoritesTabViews.unviewedFavorites[FavoriteType.ARTIST]).toEqual([
      favoriteArtistResponseSnap.id,
    ])
    expect(await storage.readObject('unviewed_favorite_artist_ids')).toEqual([
      favoriteArtistResponseSnap.id,
    ])
  })

  it('should trigger first favorite snack bar function when wipFavoritesHub FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    simulateBackendForArtist({
      id: artistId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ artistId })

    await waitFor(() => {
      expect(mockTriggerFirstFavoriteSnackBar).toHaveBeenCalledWith(FavoriteType.ARTIST)
    })
  })

  it('should not trigger first favorite snack bar function when wipFavoritesHub FF deactivated', async () => {
    simulateBackendForArtist({
      id: artistId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ artistId })

    await waitFor(() => {
      expect(mockTriggerFirstFavoriteSnackBar).not.toHaveBeenCalled()
    })
  })

  it('should show snack bar when fail to add favorite', async () => {
    simulateBackendForArtist({
      id: artistId,
      hasAddFavoriteError: true,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ artistId })

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'L’artiste n’a pas été ajouté à tes favoris',
        'error'
      )
    })
  })

  it('should show snack bar when too many favorites when trying to add favorite', async () => {
    simulateBackendForArtist({
      id: artistId,
      hasAddFavoriteError: false,
      hasTooManyFavorites: true,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ artistId })

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        'error'
      )
    })
  })
})

const renderUseAddFavorite = (onSuccess?: (data?: FavoriteArtistResponse | undefined) => void) => {
  const { result } = renderHook(
    () => useAddArtistFavoriteMutation({ type: FavoriteType.ARTIST, onSuccess }),
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
