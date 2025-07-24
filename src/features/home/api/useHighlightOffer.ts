import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { fetchOffersByTags } from 'libs/algolia/fetchAlgolia/fetchOffersByTags'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaGeoloc } from 'libs/algolia/types'
import { useLocation } from 'libs/location'
import { Position } from 'libs/location/types'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'
import { Offer } from 'shared/offer/types'

import { useGetHighlightOfferQuery } from '../queries/useGetHighlightOfferQuery'

type UseHightlightOfferParams = {
  id: string
  offerId?: string
  offerEan?: string
  offerTag?: string
  isGeolocated?: boolean
  aroundRadius?: number
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

  const transformOfferHits = useTransformOfferHits()
  const { userLocation } = useLocation()

  const getHighlightOffer = async () => {
    if (offerTag) {
      return fetchOffersByTags({
        tags: [offerTag],
        isUserUnderage,
        userLocation,
      })
    }

    if (offerEan) {
      return fetchOffersByEan({
        eanList: [offerEan],
        userLocation,
        isUserUnderage,
      })
    }

    if (!offerId) return undefined

    return fetchOffersByIds({
      objectIds: [offerId],
      isUserUnderage,
    })
  }
  const { data } = useGetHighlightOfferQuery({ id, getHighlightOffer })
  const offers = (data?.map(transformOfferHits) as Offer[]) ?? []
  const highlightOffer = offers[0]

  if (
    shouldDisplayHighlightOffer(userLocation, highlightOffer?._geoloc, isGeolocated, aroundRadius)
  ) {
    return highlightOffer
  }
  return undefined
}

const shouldDisplayHighlightOffer = (
  position: Position,
  offerLocation?: AlgoliaGeoloc,
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
