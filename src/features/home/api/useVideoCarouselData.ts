import { SearchResponse } from '@algolia/client-search'
import { useEffect } from 'react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { VideoCarouselItem } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { fetchCarouselVideoOffers } from 'libs/algolia/fetchAlgolia/fetchCarouselVideoOffers'
import { buildVideoCarouselOffersQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildVideoCarouselOffersQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import {
  filterOfferHitWithImage,
  useTransformOfferHits,
} from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer, OfferModuleQuery } from 'libs/algolia/types'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export enum RedirectionMode {
  OFFER = 'OFFER',
  THEMATIC_HOME = 'THEMATIC_HOME',
}

export type EnrichedVideoCarouselItem = VideoCarouselItem & {
  offer?: Offer
  redirectionMode: RedirectionMode
}

const getRedirectionMode = (item: VideoCarouselItem): RedirectionMode => {
  if (item.homeEntryId) return RedirectionMode.THEMATIC_HOME
  return RedirectionMode.OFFER
}

const mapDataAndItem = (
  offersResultList: UseQueryResult<SearchResponse<Offer>[], unknown>,
  transformOfferHits: (hit: AlgoliaOffer) => AlgoliaOffer
) => {
  const { data } = offersResultList

  if (data) {
    return data
      .map((hits) => hits.hits.filter(filterOfferHitWithImage).map(transformOfferHits))
      .map((hits) => (hits.length ? (hits[0] as Offer) : undefined))
  }
  return [] as Offer[]
}

const isOfferQuery = (query: unknown): query is OfferModuleQuery =>
  typeof query === 'object' && query !== undefined

export const useVideoCarouselData = (
  items: VideoCarouselItem[],
  moduleId: string
): EnrichedVideoCarouselItem[] => {
  const isUserUnderage = useIsUserUnderage()
  const transformOfferHits = useTransformOfferHits()
  const { userLocation, selectedLocationMode } = useLocation()

  const locationParams: BuildLocationParameterParams = {
    selectedLocationMode,
    userLocation,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
  }

  const queries = items.map((item: VideoCarouselItem) => {
    if (getRedirectionMode(item) === RedirectionMode.THEMATIC_HOME) return undefined
    return buildVideoCarouselOffersQueries({
      offerId: item.offerId,
      tag: item.tag,
      isUserUnderage,
      locationParams,
    })
  })

  const queriesWithoutUndefined = queries.filter(isOfferQuery)

  const offersQuery = async () => {
    const offersResultList = await fetchCarouselVideoOffers(queriesWithoutUndefined)
    return offersResultList.filter(searchResponsePredicate)
  }

  const offersResultList = useQuery({
    queryKey: [QueryKeys.VIDEO_CAROUSEL_OFFERS, moduleId],
    queryFn: offersQuery,
    enabled: queriesWithoutUndefined.length > 0,
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    offersResultList.refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude])

  const offers = mapDataAndItem(offersResultList, transformOfferHits)

  let dataIterator = 0

  const enrichedItems = items.map((item: VideoCarouselItem): EnrichedVideoCarouselItem => {
    const hasOfferRedirection = getRedirectionMode(item) === RedirectionMode.OFFER
    const enrichedItem: EnrichedVideoCarouselItem = {
      ...item,
      redirectionMode: getRedirectionMode(item),
      offer: hasOfferRedirection ? offers[dataIterator] : undefined,
    }

    if (hasOfferRedirection) dataIterator++
    return enrichedItem
  })

  return enrichedItems.filter((enrichedItem: EnrichedVideoCarouselItem) => {
    return !(
      enrichedItem.redirectionMode === RedirectionMode.OFFER && enrichedItem.offer === undefined
    )
  })
}
