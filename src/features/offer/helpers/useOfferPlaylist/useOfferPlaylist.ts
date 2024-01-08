import { useMemo } from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'

import { OfferResponse, SearchGroupNameEnumv2, SearchGroupResponseModelv2 } from 'api/gen'
import { useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylist/api/fetchOffersByArtist'
import { useSameArtistPlaylist } from 'features/offer/components/OfferPlaylist/hook/useSameArtistPlaylist'
import { useLocation, Position } from 'libs/location'
import { Offer, RecommendationApiParams } from 'shared/offer/types'

type Props = {
  offer: OfferResponse
  offerSearchGroup: SearchGroupNameEnumv2
  searchGroupList: SearchGroupResponseModelv2[]
}

type UseOfferPlaylistType = {
  sameArtistPlaylist: HitOfferWithArtistAndEan[]
  refetchSameArtistPlaylist: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<HitOfferWithArtistAndEan[], unknown>>
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
  const ean = offer.extraData?.ean
  const venueLocation = offer.venue.coordinates
  const { sameArtistPlaylist, refetchSameArtistPlaylist } = useSameArtistPlaylist({
    artists,
    ean,
    searchGroupName: offerSearchGroup,
    venueLocation,
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
    refetchSameArtistPlaylist,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  }
}
