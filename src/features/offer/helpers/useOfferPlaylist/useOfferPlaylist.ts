import { useIsFocused } from '@react-navigation/native'
import { useMemo } from 'react'

import {
  CategoryIdEnum,
  OfferResponse,
  RecommendationApiParams,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SimilarOffersRequestQuery,
} from 'api/gen'
import { useSimilarOffersQuery } from 'features/offer/queries/useSimilarOffersQuery'
import { Position, useLocation } from 'libs/location/location'
import { Offer } from 'shared/offer/types'

type OfferPlaylistProps = {
  offer: OfferResponse
  offerCategory: CategoryIdEnum
  offerSearchGroup: SearchGroupNameEnumv2
  searchGroupList: SearchGroupResponseModelv2[]
}

type UseOfferPlaylistType = {
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  booksSameCategorySimilarOffers?: Offer[]
  apiRecoParamsBooksSameCategory?: RecommendationApiParams
}

export const useOfferPlaylist = ({
  offer,
  offerCategory,
  offerSearchGroup,
  searchGroupList,
}: OfferPlaylistProps): UseOfferPlaylistType => {
  const { userLocation } = useLocation()
  const isFocused = useIsFocused()

  const { latitude, longitude } = userLocation ?? {}
  const roundedPosition: Position = useMemo(
    () => ({
      latitude: Number(latitude?.toFixed(3)),
      longitude: Number(longitude?.toFixed(3)),
    }),
    [latitude, longitude]
  )

  const position = userLocation ? roundedPosition : undefined
  const isBookOffer = offerCategory === CategoryIdEnum.LIVRE

  const { similarOffers: sameCategorySimilarOffers, apiRecoParams: apiRecoParamsSameCategory } =
    useSimilarOffersQuery({
      offerId: offer.id,
      shouldFetch: isFocused,
      position,
      categoryIncluded: offerSearchGroup,
    })

  const {
    similarOffers: otherCategoriesSimilarOffers,
    apiRecoParams: apiRecoParamsOtherCategories,
  } = useSimilarOffersQuery({
    offerId: offer.id,
    shouldFetch: isFocused && !isBookOffer,
    position,
    categoryExcluded: offerSearchGroup,
    searchGroupList,
  })

  const {
    similarOffers: booksSameCategorySimilarOffers,
    apiRecoParams: apiRecoParamsBooksSameCategory,
  } = useSimilarOffersQuery({
    offerId: offer.id,
    shouldFetch: isFocused && isBookOffer,
    position,
    categoryIncluded: SearchGroupNameEnumv2.LIVRES,
    retrievalModel: SimilarOffersRequestQuery.RetrievalModelEnum.Graph,
  })

  return {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
    booksSameCategorySimilarOffers,
    apiRecoParamsBooksSameCategory,
  }
}
