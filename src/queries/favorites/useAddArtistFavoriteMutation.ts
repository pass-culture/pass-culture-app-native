import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import {
  FavoriteArtistRequest,
  FavoriteArtistResponse,
  PaginatedResponseFavoriteArtistResponse,
} from 'api/gen'
import { FavoriteType } from 'features/favorites/enum'
import { triggerFirstFavoriteSnackBar } from 'features/favorites/helpers/firstFavoriteSnackBar'
import { handleFavoriteError } from 'features/favorites/helpers/handleFavoriteError'
import { FavoriteArtistMutationContext } from 'features/favorites/queries/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

type UseAddArtistFavoriteMutationProps = {
  type: FavoriteType
  onSuccess?: (data?: FavoriteArtistResponse) => void
}

export const useAddArtistFavoriteMutation = ({
  type,
  onSuccess,
}: UseAddArtistFavoriteMutationProps) => {
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: FavoriteArtistRequest) => api.postNativeV2MeFavoritesArtists(body),
    onSuccess: async (data: FavoriteArtistResponse) => {
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteArtistResponse>([
        QueryKeys.FAVORITES_ARTIST,
      ])

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites.filter(
            (favorite) => favorite.artist.id !== data.artist.id
          ),
          data,
        ]
        queryClient.setQueryData([QueryKeys.FAVORITES_ARTIST], {
          ...previousFavorites,
          favorites,
        })
      } else {
        void queryClient.invalidateQueries({
          queryKey: [QueryKeys.FAVORITES_ARTIST],
        })
      }

      if (enableFavoritesHub) {
        await triggerFirstFavoriteSnackBar(type)
      }

      if (onSuccess) {
        onSuccess(data)
      }
    },
    onMutate: ({ artistId }) => {
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteArtistResponse>([
        QueryKeys.FAVORITES_ARTIST,
      ])
      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites,
          {
            id: Math.random(),
            artist: { id: artistId },
          },
        ]

        queryClient.setQueryData([QueryKeys.FAVORITES_ARTIST], {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      return { previousFavorites: previousFavorites ?? [] } as FavoriteArtistMutationContext
    },
    onError: (
      error: Error | ApiError,
      _variables: FavoriteArtistRequest,
      context?: FavoriteArtistMutationContext
    ) => {
      handleFavoriteError(error, 'L’artiste n’a pas été ajouté à tes favoris')

      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES_ARTIST], context.previousFavorites)
      }
    },
  })
}
