import { SearchResponse } from '@algolia/client-search'
import { flatten } from 'lodash'
import { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { AlgoliaHit } from 'libs/algolia'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { Position } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { getNextPageParam } from 'shared/getNextPageParam/getNextPageParam'
import { Offer } from 'shared/offer/types'

export type UseSearchVenueOffersType = {
  offerId: number
  query: string
  geolocation: Position
  shouldExecuteQuery: boolean
  venueId?: number
}

export type Response = Pick<
  SearchResponse<Offer>,
  'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'
>

export function getOfferVenues(hits: Offer[]) {
  const offerVenues: VenueListItem[] = []

  hits.forEach((hit) => {
    const venueAlreadyListedIndex = offerVenues.findIndex((venue) => venue.venueId === hit.venue.id)
    const venueAlreadyListedPrice = offerVenues[venueAlreadyListedIndex]?.price ?? 0
    if (
      venueAlreadyListedIndex >= 0 &&
      hit.offer.prices?.length &&
      venueAlreadyListedPrice > hit.offer.prices[0]
    ) {
      offerVenues[venueAlreadyListedIndex].offerId = Number(hit.objectID)
      offerVenues[venueAlreadyListedIndex].price = hit.offer.prices[0]
      return
    }

    offerVenues.push({
      offerId: Number(hit.objectID),
      price: hit.offer.prices?.length ? hit.offer.prices[0] : 0,
      venueId: hit.venue.id,
      title: hit.venue.publicName ? hit.venue.publicName : hit.venue.name ?? '',
      address: formatFullAddress(hit.venue.address, hit.venue.postalCode, hit.venue.city),
      coordinates: hit._geoloc,
    })
  })

  return offerVenues
}

type FilterVenueOfferType = {
  hit: AlgoliaHit
  offerId: number
  venueId: number | undefined
}

export const filterVenueOfferHit = ({ hit, offerId, venueId }: FilterVenueOfferType): boolean =>
  typeof hit.offer.subcategoryId !== 'undefined' &&
  hit.objectID !== String(offerId) &&
  hit.venue.id !== venueId

export const useSearchVenueOffersInfiniteQuery = ({
  offerId,
  venueId,
  query,
  geolocation,
  shouldExecuteQuery,
}: UseSearchVenueOffersType) => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, { ...initialSearchState, view: undefined, query }],
    async ({ pageParam: page = 0 }) => {
      const response = await fetchOffers({
        parameters: { ...initialSearchState, query, page, hitsPerPage: 10 },
        userLocation: geolocation,
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        excludedObjectIds: previousPageObjectIds.current,
        isFromOffer: true,
      })

      previousPageObjectIds.current = response.hits.map((hit) => hit.objectID)
      return response
    },
    // first page is 0
    { getNextPageParam, enabled: shouldExecuteQuery }
  )

  const offerVenues = useMemo(() => {
    const flattenedHits = flatten(data?.pages.map((page) => page.hits.map(transformHits))).filter(
      (hit) => filterVenueOfferHit({ hit, offerId, venueId })
    ) as Offer[]

    return getOfferVenues(flattenedHits)
  }, [data?.pages, offerId, transformHits, venueId])

  const { nbHits: nbOfferVenues } = data?.pages[0] ?? { nbHits: 0 }

  return { data, offerVenues, nbOfferVenues, ...infiniteQuery }
}

export const useSearchVenueOffers = ({
  offerId,
  venueId,
  query,
  geolocation,
  shouldExecuteQuery,
}: UseSearchVenueOffersType) => {
  return useSearchVenueOffersInfiniteQuery({
    offerId,
    venueId,
    query,
    geolocation,
    shouldExecuteQuery,
  })
}
