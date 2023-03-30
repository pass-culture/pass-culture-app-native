import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { ApiError, isApiError } from 'api/apiHelpers'
import {
  FavoriteRequest,
  FavoriteResponse,
  PaginatedFavoritesResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { FavoriteMutationContext } from 'features/favorites/api/types'
import { QueryKeys } from 'libs/queryKeys'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useAddFavorite({ onSuccess }: { onSuccess?: (data?: FavoriteResponse) => void }) {
  const queryClient = useQueryClient()
  const { showErrorSnackBar } = useSnackBarContext()

  return useMutation((body: FavoriteRequest) => api.postnativev1mefavorites(body), {
    onSuccess: (data: FavoriteResponse) => {
      const previousFavorites = queryClient.getQueryData<PaginatedFavoritesResponse>([
        QueryKeys.FAVORITES,
      ])

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites.filter((favoris) => favoris.offer.id !== data.offer.id),
          data,
        ]
        queryClient.setQueryData([QueryKeys.FAVORITES], { ...previousFavorites, favorites })
        queryClient.setQueryData([QueryKeys.FAVORITES_COUNT], { count: favorites.length })
      } else {
        queryClient.invalidateQueries([QueryKeys.FAVORITES])
        queryClient.invalidateQueries([QueryKeys.FAVORITES_COUNT])
      }
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onMutate: ({ offerId }) => {
      const previousFavorites = queryClient.getQueryData<PaginatedFavoritesResponse>([
        QueryKeys.FAVORITES,
      ])
      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites,
          {
            id: Math.random(),
            // Using a random subcategory so that it doesn't crash
            offer: { id: offerId, subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE },
          },
        ]

        queryClient.setQueryData([QueryKeys.FAVORITES], {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
        queryClient.setQueryData([QueryKeys.FAVORITES_COUNT], { count: favorites.length })
      }

      return { previousFavorites: previousFavorites || [] } as FavoriteMutationContext
    },
    onError: (
      error: Error | ApiError,
      variables: FavoriteRequest,
      context: FavoriteMutationContext | undefined
    ) => {
      showErrorSnackBar({
        message:
          isApiError(error) && error.content.code === 'MAX_FAVORITES_REACHED'
            ? 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.'
            : 'L’offre n’a pas été ajoutée à tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES], context.previousFavorites)
        queryClient.setQueryData([QueryKeys.FAVORITES_COUNT], {
          count: context.previousFavorites.length,
        })
      }
    },
  })
}
