import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import {
  FavoriteOfferResponseV2,
  FavoriteRequest,
  PaginatedResponseFavoriteOfferResponseV2,
  SubcategoryIdEnum,
} from 'api/gen'
import { FavoriteType } from 'features/favorites/enum'
import { triggerFirstFavoriteSnackBar } from 'features/favorites/helpers/firstFavoriteSnackBar'
import { handleFavoriteError } from 'features/favorites/helpers/handleFavoriteError'
import { FavoriteOfferMutationContext } from 'features/favorites/queries/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

type UseAddOfferFavoriteMutationProps = {
  type: FavoriteType
  onSuccess?: (data?: FavoriteOfferResponseV2) => void
}

export const useAddOfferFavoriteMutation = ({
  onSuccess,
  type,
}: UseAddOfferFavoriteMutationProps) => {
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: FavoriteRequest) => api.postNativeV2MeFavoritesOffers(body),
    onSuccess: async (data: FavoriteOfferResponseV2) => {
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteOfferResponseV2>([
        QueryKeys.FAVORITES_OFFER,
      ])

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites.filter((favoris) => favoris.offer.id !== data.offer.id),
          data,
        ]
        queryClient.setQueryData([QueryKeys.FAVORITES_OFFER], {
          ...previousFavorites,
          favorites,
        })
      } else {
        void queryClient.invalidateQueries({
          queryKey: [QueryKeys.FAVORITES_OFFER],
        })
      }

      if (enableFavoritesHub) {
        await triggerFirstFavoriteSnackBar(type)
      }

      if (onSuccess) {
        onSuccess(data)
      }
    },
    onMutate: ({ offerId }) => {
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteOfferResponseV2>([
        QueryKeys.FAVORITES_OFFER,
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

        queryClient.setQueryData([QueryKeys.FAVORITES_OFFER], {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      return { previousFavorites: previousFavorites ?? [] } as FavoriteOfferMutationContext
    },
    onError: (
      error: Error | ApiError,
      _variables: FavoriteRequest,
      context?: FavoriteOfferMutationContext
    ) => {
      handleFavoriteError(error, 'L’offre n’a pas été ajoutée à tes favoris')

      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES_OFFER], context.previousFavorites)
      }
    },
  })
}
