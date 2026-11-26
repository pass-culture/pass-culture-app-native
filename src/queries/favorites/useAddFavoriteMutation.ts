import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import {
  FavoriteArtistRequest,
  FavoriteArtistResponse,
  FavoriteOfferResponseV2,
  FavoriteRequest,
  FavoriteVenueRequest,
  FavoriteVenueResponse,
  PaginatedResponseFavoriteArtistResponse,
  PaginatedResponseFavoriteOfferResponseV2,
  PaginatedResponseFavoriteVenueResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { useFavoritesTabViews } from 'features/favorites/context/FavoritesTabViewsProvider'
import { FavoriteType } from 'features/favorites/enum'
import { triggerFirstFavoriteSnackBar } from 'features/favorites/helpers/firstFavoriteSnackBar'
import { handleFavoriteError } from 'features/favorites/helpers/handleFavoriteError'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

type FavoritesList<TFavorite> = { favorites: TFavorite[]; nbFavorites: number }

type FavoriteMutationConfig<TRequest, TFavorite> = {
  queryKey: QueryKeys
  mutationFn: (body: TRequest) => Promise<TFavorite>
  getFavoriteId: (favorite: TFavorite) => number
  getEntityId: (favorite: TFavorite) => string | number
  buildOptimisticFavorite: (variables: TRequest) => TFavorite
  errorMessage: string
}

type MutationContext<TList> = { previousFavorites?: TList }

type UseAddFavoriteMutationProps<TFavorite> = {
  type: FavoriteType
  onSuccess?: (data?: TFavorite) => void
}

const useAddFavoriteMutation = <
  TRequest,
  TFavorite,
  TList extends FavoritesList<TFavorite> = FavoritesList<TFavorite>,
>(
  { type, onSuccess }: UseAddFavoriteMutationProps<TFavorite>,
  config: FavoriteMutationConfig<TRequest, TFavorite>
) => {
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const queryClient = useQueryClient()
  const { markFavoriteUnviewed } = useFavoritesTabViews()
  const queryKey = [config.queryKey]

  return useMutation<TFavorite, Error | ApiError, TRequest, MutationContext<TList>>({
    mutationFn: config.mutationFn,
    onMutate: (variables) => {
      const previousFavorites = queryClient.getQueryData<TList>(queryKey)

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites,
          config.buildOptimisticFavorite(variables),
        ]
        queryClient.setQueryData(queryKey, {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      return { previousFavorites }
    },
    onSuccess: async (data) => {
      markFavoriteUnviewed(type, config.getFavoriteId(data))
      const previousFavorites = queryClient.getQueryData<TList>(queryKey)

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites.filter(
            (favorite) => config.getEntityId(favorite) !== config.getEntityId(data)
          ),
          data,
        ]
        queryClient.setQueryData(queryKey, { ...previousFavorites, favorites })
      } else {
        void queryClient.invalidateQueries({ queryKey })
      }

      if (enableFavoritesHub) {
        await triggerFirstFavoriteSnackBar(type)
      }

      onSuccess?.(data)
    },
    onError: (error, _variables, context) => {
      handleFavoriteError(error, config.errorMessage)

      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites)
      }
    },
  })
}

const artistConfig: FavoriteMutationConfig<FavoriteArtistRequest, FavoriteArtistResponse> = {
  queryKey: QueryKeys.FAVORITES_ARTIST,
  mutationFn: (body) => api.postNativeV2MeFavoritesArtists(body),
  getFavoriteId: (favorite) => favorite.id,
  getEntityId: (favorite) => favorite.artist.id,
  buildOptimisticFavorite: ({ artistId }) =>
    ({ id: Math.random(), artist: { id: artistId } }) as FavoriteArtistResponse,
  errorMessage: 'L’artiste n’a pas été ajouté à tes favoris',
}

const offerConfig: FavoriteMutationConfig<FavoriteRequest, FavoriteOfferResponseV2> = {
  queryKey: QueryKeys.FAVORITES_OFFER,
  mutationFn: (body) => api.postNativeV2MeFavoritesOffers(body),
  getFavoriteId: (favorite) => favorite.id,
  getEntityId: (favorite) => favorite.offer.id,
  buildOptimisticFavorite: ({ offerId }) =>
    ({
      id: Math.random(),
      // Using a random subcategory so that it doesn't crash
      offer: { id: offerId, subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE },
    }) as FavoriteOfferResponseV2,
  errorMessage: 'L’offre n’a pas été ajoutée à tes favoris',
}

const venueConfig: FavoriteMutationConfig<FavoriteVenueRequest, FavoriteVenueResponse> = {
  queryKey: QueryKeys.FAVORITES_VENUE,
  mutationFn: (body) => api.postNativeV2MeFavoritesVenues(body),
  getFavoriteId: (favorite) => favorite.id,
  getEntityId: (favorite) => favorite.venue.id,
  buildOptimisticFavorite: ({ venueId }) =>
    ({ id: Math.random(), venue: { id: venueId } }) as FavoriteVenueResponse,
  errorMessage: 'Le lieu n’a pas été ajouté à tes favoris',
}

export const useAddArtistFavoriteMutation = (
  props: UseAddFavoriteMutationProps<FavoriteArtistResponse>
) =>
  useAddFavoriteMutation<
    FavoriteArtistRequest,
    FavoriteArtistResponse,
    PaginatedResponseFavoriteArtistResponse
  >(props, artistConfig)

export const useAddOfferFavoriteMutation = (
  props: UseAddFavoriteMutationProps<FavoriteOfferResponseV2>
) =>
  useAddFavoriteMutation<
    FavoriteRequest,
    FavoriteOfferResponseV2,
    PaginatedResponseFavoriteOfferResponseV2
  >(props, offerConfig)

export const useAddVenueFavoriteMutation = (
  props: UseAddFavoriteMutationProps<FavoriteVenueResponse>
) =>
  useAddFavoriteMutation<
    FavoriteVenueRequest,
    FavoriteVenueResponse,
    PaginatedResponseFavoriteVenueResponse
  >(props, venueConfig)
