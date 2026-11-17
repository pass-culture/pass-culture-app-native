import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import {
  FavoriteVenueRequest,
  FavoriteVenueResponse,
  PaginatedResponseFavoriteVenueResponse,
} from 'api/gen'
import { FavoriteType } from 'features/favorites/enum'
import { triggerFirstFavoriteSnackBar } from 'features/favorites/helpers/firstFavoriteSnackBar'
import { handleFavoriteError } from 'features/favorites/helpers/handleFavoriteError'
import { FavoriteVenueMutationContext } from 'features/favorites/queries/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

type UseAddVenueFavoriteMutationProps = {
  type: FavoriteType
  onSuccess?: (data?: FavoriteVenueResponse) => void
}

export const useAddVenueFavoriteMutation = ({
  type,
  onSuccess,
}: UseAddVenueFavoriteMutationProps) => {
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: FavoriteVenueRequest) => api.postNativeV2MeFavoritesVenues(body),
    onSuccess: async (data: FavoriteVenueResponse) => {
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteVenueResponse>([
        QueryKeys.FAVORITES_VENUE,
      ])

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites.filter((favorite) => favorite.venue.id !== data.venue.id),
          data,
        ]
        queryClient.setQueryData([QueryKeys.FAVORITES_VENUE], {
          ...previousFavorites,
          favorites,
        })
      } else {
        void queryClient.invalidateQueries({
          queryKey: [QueryKeys.FAVORITES_VENUE],
        })
      }

      if (enableFavoritesHub) {
        await triggerFirstFavoriteSnackBar(type)
      }

      if (onSuccess) {
        onSuccess(data)
      }
    },
    onMutate: ({ venueId }) => {
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteVenueResponse>([
        QueryKeys.FAVORITES_VENUE,
      ])
      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites,
          {
            id: Math.random(),
            venue: { id: venueId },
          },
        ]

        queryClient.setQueryData([QueryKeys.FAVORITES_VENUE], {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      return { previousFavorites: previousFavorites ?? [] } as FavoriteVenueMutationContext
    },
    onError: (
      error: Error | ApiError,
      _variables: FavoriteVenueRequest,
      context?: FavoriteVenueMutationContext
    ) => {
      handleFavoriteError(error, 'Le lieu n’a pas été ajouté à tes favoris')

      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES_VENUE], context.previousFavorites)
      }
    },
  })
}
