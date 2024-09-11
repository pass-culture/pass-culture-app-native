import { useMemo } from 'react'

import {
  OfferResponseV2,
  RecommendationApiParams,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
} from 'api/gen'
import { HitOfferWithArtistAndEan } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { useSameArtistPlaylist } from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import { Position, useLocation } from 'libs/location'
import { Offer } from 'shared/offer/types'

type Props = {
  offer: OfferResponseV2
  offerSearchGroup: SearchGroupNameEnumv2
  searchGroupList: SearchGroupResponseModelv2[]
}

type UseOfferPlaylistType = {
  sameArtistPlaylist: HitOfferWithArtistAndEan[]
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

  const artists = offer.extraData?.author
  const { sameArtistPlaylist } = useSameArtistPlaylist({
    artists,
    searchGroupName: offerSearchGroup,
  })

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
    useSimilarOffers({
      offerId: offer.id,
      position,
      categoryIncluded: offerSearchGroup,
    })

  const {
    similarOffers: otherCategoriesSimilarOffers,
    apiRecoParams: apiRecoParamsOtherCategories,
  } = useSimilarOffers({
    offerId: offer.id,
    position,
    categoryExcluded: offerSearchGroup,
    searchGroupList,
  })

  return {
    sameArtistPlaylist,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  }
}
