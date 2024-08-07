import { Hit, SearchResponse } from '@algolia/client-search'
import { flatten } from 'lodash'
import { useMemo, useRef } from 'react'
import { InfiniteQueryObserverOptions, useInfiniteQuery } from 'react-query'

import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { FetchOffersResponse, fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaHit, Geoloc } from 'libs/algolia/types'
import { Position } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import { LocationMode } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { getNextPageParam } from 'shared/getNextPageParam/getNextPageParam'
import { Offer } from 'shared/offer/types'

type Response = Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>

type UseSearchVenueOffersOptions = {
  allocineId?: number
  ean?: string
  offerId: number
  query: string
  geolocation: Position
  queryOptions?: Omit<InfiniteQueryObserverOptions<Response>, 'getNextPageParam'>
  venueId?: number
}

type OfferVenueType = VenueListItem & {
  price: number
  coordinates: Geoloc
  venueId?: number
}

type FilterVenueOfferType = {
  hit: AlgoliaHit
  offerId: number
  venueId: number | undefined
}

// Radius in meters
const AROUND_RADIUS = 50 * 1000

export function getVenueList(hits: Offer[]) {
  const offerVenues: OfferVenueType[] = []

  hits.forEach((hit) => {
    const venueAlreadyListedIndex = offerVenues.findIndex((venue) => venue.venueId === hit.venue.id)
    const venueAlreadyListedPrice = offerVenues[venueAlreadyListedIndex]?.price ?? 0
    if (
      venueAlreadyListedIndex >= 0 &&
      hit.offer.prices?.length &&
      // @ts-expect-error: because of noUncheckedIndexedAccess
      venueAlreadyListedPrice > hit.offer.prices[0]
    ) {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      offerVenues[venueAlreadyListedIndex].offerId = Number(hit.objectID)
      // @ts-expect-error: because of noUncheckedIndexedAccess
      offerVenues[venueAlreadyListedIndex].price = hit.offer.prices[0]
      return
    }

    offerVenues.push({
      offerId: Number(hit.objectID),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      price: hit.offer.prices?.length ? hit.offer.prices[0] : 0,
      venueId: hit.venue.id,
      title: hit.venue.publicName ? hit.venue.publicName : hit.venue.name ?? '',
      address: formatFullAddressStartsWithPostalCode(
        hit.venue.address,
        hit.venue.postalCode,
        hit.venue.city
      ),
      coordinates: hit._geoloc,
    })
  })

  const venueList: VenueListItem[] = offerVenues.map((offerVenue) => {
    return {
      offerId: offerVenue.offerId,
      title: offerVenue.title,
      address: offerVenue.address,
      distance: useDistance(offerVenue.coordinates),
    }
  })

  return venueList
}

export const filterVenueOfferHit = ({ hit, offerId, venueId }: FilterVenueOfferType): boolean =>
  typeof hit.offer.subcategoryId !== 'undefined' &&
  hit.objectID !== String(offerId) &&
  hit.venue.id !== venueId

export const useSearchVenueOffers = ({
  allocineId,
  ean,
  offerId,
  venueId,
  query,
  geolocation,
  queryOptions,
}: UseSearchVenueOffersOptions) => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])

  const { data, ...infiniteQuery } = useInfiniteQuery<FetchOffersResponse>(
    [QueryKeys.SEARCH_RESULTS, { ...initialSearchState, query }],
    async ({ pageParam: page = 0 }) => {
      const response = await fetchOffers({
        parameters: {
          ...initialSearchState,
          allocineId,
          eanList: ean ? [ean] : undefined,
          query,
          page,
          hitsPerPage: 10,
        },
        buildLocationParameterParams: {
          userLocation: geolocation,
          selectedLocationMode: LocationMode.AROUND_ME,
          aroundMeRadius: AROUND_RADIUS,
          aroundPlaceRadius: 'all',
        },
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        isFromOffer: true,
      })

      previousPageObjectIds.current = response.hits.map((hit: Hit<Offer>) => hit.objectID)
      return response
    },
    // first page is 0
    { getNextPageParam, ...queryOptions }
  )

  const venueList = useMemo(() => {
    const availablePages = data?.pages ?? []
    const transformedHitsList = availablePages.map((page) => {
      const availableHits = page?.hits ?? []
      return availableHits.map(transformHits)
    })
    const filteredHits = flatten(transformedHitsList).filter((hit) =>
      filterVenueOfferHit({ hit, offerId, venueId })
    ) as Offer[]

    return getVenueList(filteredHits)
  }, [data?.pages, offerId, transformHits, venueId])

  const nbVenueItems = venueList.length

  const nbLoadedHits =
    data?.pages.reduce((acc, curr) => {
      acc += curr.hits?.length ?? 0
      return acc
    }, 0) ?? 0

  const { nbHits } = data?.pages[0] ?? { nbHits: 0 }

  return { data, venueList, nbVenueItems, nbLoadedHits, nbHits, ...infiniteQuery }
}
