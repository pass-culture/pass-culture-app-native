import { OfferResponse, RecommendationApiParams } from 'api/gen'
import { useFavorite } from 'features/favorites/hooks/useFavorite'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { analytics } from 'libs/analytics/provider'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useRemoveFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type FavoriteAnalyticsParams = {
  from?: Referrals
  moduleName?: string
  moduleId?: string
  searchId?: string
  playlistType?: string
  apiRecoParams?: string
}

export const useOfferFavorites = (offer: OfferResponse, params?: FavoriteAnalyticsParams) => {
  const apiRecoParams: RecommendationApiParams = params?.apiRecoParams
    ? JSON.parse(params.apiRecoParams)
    : undefined

  const { mutate: addFavorite, isPending: isAddFavoriteLoading } = useAddFavoriteMutation({
    onSuccess: () => {
      if (typeof offer.id === 'number' && params) {
        const { from, moduleName, moduleId, searchId, playlistType } = params
        analytics.logHasAddedOfferToFavorites({
          from: getIsAComingSoonOffer(offer.bookingAllowedDatetime) ? 'comingSoonOffer' : from,
          offerId: offer.id,
          moduleName,
          moduleId,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      }
    },
  })

  const { mutate: removeFavorite, isPending: isRemoveFavoriteLoading } = useRemoveFavoriteMutation({
    onError: () => {
      showErrorSnackBar('L\u2019offre n\u2019a pas \u00e9t\u00e9 retir\u00e9e de tes favoris')
    },
  })

  const favorite = useFavorite({ offerId: offer.id })

  return {
    addFavorite,
    isAddFavoriteLoading,
    removeFavorite,
    isRemoveFavoriteLoading,
    favorite,
  }
}
