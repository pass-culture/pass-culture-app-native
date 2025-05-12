import { useIsFocused } from '@react-navigation/native'
import { useMemo } from 'react'

import {
  OfferResponseV2,
  RecommendationApiParams,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
} from 'api/gen'
import { useSimilarOffersQuery } from 'features/offer/queries/useSimilarOffersQuery'
import { Position, useLocation } from 'libs/location'
import { Offer } from 'shared/offer/types'

type Props = {
  offer: OfferResponseV2
  offerSearchGroup: SearchGroupNameEnumv2
  searchGroupList: SearchGroupResponseModelv2[]
}

type UseOfferPlaylistType = {
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
}

export const useOfferPlaylist = ({
  offer,
  offerSearchGroup,
  searchGroupList,
}: Props): UseOfferPlaylistType => {
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
    shouldFetch: isFocused,
    position,
    categoryExcluded: offerSearchGroup,
    searchGroupList,
  })

  return {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  }
}
