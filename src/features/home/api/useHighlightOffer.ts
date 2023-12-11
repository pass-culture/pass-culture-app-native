import { useQuery } from 'react-query'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { AlgoliaLocationFilter } from 'libs/algolia'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { fetchOffersByTags } from 'libs/algolia/fetchAlgolia/fetchOffersByTags'
import { adaptAlgoliaLocationFilter } from 'libs/algolia/fetchAlgolia/helpers/adaptAlgoliaLocationFilter'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { Position } from 'libs/location/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { computeDistanceInMeters } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { Offer, OfferLocation } from 'shared/offer/types'

type UseHightlightOfferParams = {
  id: string
  offerId?: string
  offerEan?: string
  offerTag?: string
  isGeolocated?: boolean
  aroundRadius?: number
}

enum QueryMode {
  ID = 'ID',
  TAG = 'TAG',
  EAN = 'EAN',
}

const selectQueryMode = (offerTag?: string, offerEan?: string) => {
  if (offerTag) return QueryMode.TAG
  if (offerEan) return QueryMode.EAN
  return QueryMode.ID
}

export const useHighlightOffer = ({
  id,
  offerId,
  offerEan,
  offerTag,
  isGeolocated,
  aroundRadius,
}: UseHightlightOfferParams) => {
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()
  const transformOfferHits = useTransformOfferHits()
  const { position: userPosition } = useHomePosition()
  const { selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()
  const locationFilter: AlgoliaLocationFilter = adaptAlgoliaLocationFilter({
    userPosition,
    selectedLocationMode,
    aroundMeRadius,
    aroundPlaceRadius,
  })

  const offerByIdQuery = async () => {
    if (!offerId) return undefined

    const result = await fetchOffersByIds({
      objectIds: [offerId],
      isUserUnderage,
    })

    return result
  }

  const offerByTagQuery = async () => {
    if (!offerTag) return undefined

    const result = await fetchOffersByTags({
      tags: [offerTag],
      isUserUnderage,
      locationFilter,
    })

    return result
  }

  const offerByEanQuery = async () => {
    if (!offerEan) return undefined

    return fetchOffersByEan({
      eanList: [offerEan],
      isUserUnderage,
      locationFilter,
    })
  }

  const queryByQueryMode = {
    [QueryMode.ID]: offerByIdQuery,
    [QueryMode.TAG]: offerByTagQuery,
    [QueryMode.EAN]: offerByEanQuery,
  }

  const queryMode = selectQueryMode(offerTag, offerEan)

  const { data } = useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, id],
    queryFn: queryByQueryMode[queryMode],
    enabled: !!netInfo.isConnected,
  })
  const offers = (data?.map(transformOfferHits) as Offer[]) ?? []
  const highlightOffer = offers[0]

  if (
    shouldDisplayHighlightOffer(userPosition, highlightOffer?._geoloc, isGeolocated, aroundRadius)
  ) {
    return highlightOffer
  }
  return undefined
}

const shouldDisplayHighlightOffer = (
  position: Position,
  offerLocation?: OfferLocation,
  isGeolocated?: boolean,
  aroundRadius?: number
) => {
  if (!isGeolocated || !aroundRadius) return true
  if (!position || !offerLocation) return false

  const { lat: latitude, lng: longitude } = offerLocation
  if (!latitude || !longitude) return false

  const distance = computeDistanceInMeters(
    latitude,
    longitude,
    position.latitude,
    position.longitude
  )
  return distance <= 1000 * aroundRadius
}
