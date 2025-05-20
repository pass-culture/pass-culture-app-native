import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { fetchOffersByTags } from 'libs/algolia/fetchAlgolia/fetchOffersByTags'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaGeoloc } from 'libs/algolia/types'
import { useLocation } from 'libs/location'
import { Position } from 'libs/location/types'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

type UseHightlightOfferParams = {
  id: string
  offerId?: string
  offerEan?: string
  offerTag?: string
  isGeolocated?: boolean
  aroundRadius?: number
  publicationDate?: number
}

enum QueryMode {
  ID = 'ID',
  TAG = 'TAG',
  EAN = 'EAN',
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

  const newVariable = newFunction(offerId, isUserUnderage, offerTag, userLocation, offerEan, id)
  const { data } = newVariable
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
function newFunction(
  offerId: string | undefined,
  isUserUnderage: boolean,
  offerTag: string | undefined,
  userLocation: Position,
  offerEan: string | undefined,
  id: string
) {
  const offerByIdQuery = async () => {
    if (!offerId) return undefined

    const result = await getOfferByIdQuery(offerId, isUserUnderage)

    return result
  }

  const offerByTagQuery = async () => {
    if (!offerTag) return undefined

    const result = await getOfferByTagQuery(offerTag, isUserUnderage, userLocation)

    return result
  }

  const offerByEanQuery = async () => {
    if (!offerEan) return undefined

    return getOfferByEanQuery(offerEan, userLocation, isUserUnderage)
  }

  const newVariable = useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, id],
    queryFn: (() => {
      if (offerTag)
        return async () => {
          if (!offerTag) return undefined

          const result = await getOfferByTagQuery(offerTag, isUserUnderage, userLocation)

          return result
        }
      if (offerEan)
        return async () => {
          if (!offerEan) return undefined

          return getOfferByEanQuery(offerEan, userLocation, isUserUnderage)
        }
      return async () => {
        if (!offerId) return undefined

        const result = await getOfferByIdQuery(offerId, isUserUnderage)

        return result
      }
    })(),
  })
  return newVariable
}
async function getOfferByTagQuery(
  offerTag: string,
  isUserUnderage: boolean,
  userLocation: Position
) {
  return fetchOffersByTags({
    tags: [offerTag],
    isUserUnderage,
    userLocation,
  })
}

function getOfferByEanQuery(offerEan: string, userLocation: Position, isUserUnderage: boolean) {
  return fetchOffersByEan({
    eanList: [offerEan],
    userLocation,
    isUserUnderage,
  })
}

async function getOfferByIdQuery(offerId: string, isUserUnderage: boolean) {
  return fetchOffersByIds({
    objectIds: [offerId],
    isUserUnderage,
    shouldExcludeFutureOffers: false,
  })
}
