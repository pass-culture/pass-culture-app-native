import { Hit, SearchResponse } from '@algolia/client-search'
import flatten from 'lodash/flatten'
import { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearchVenues } from 'features/search/context/SearchVenuesWrapper'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffersAndVenues } from 'libs/algolia/fetchAlgolia/fetchOffersAndVenues/fetchOffersAndVenues'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { getNextPageParam } from 'shared/getNextPageParam/getNextPageParam'
import { Offer } from 'shared/offer/types'

export type SearchOfferResponse = Pick<
  SearchResponse<Offer>,
  'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'
>

export const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { userPosition: position } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])
  const { dispatch } = useSearchVenues()

  const { data, ...infiniteQuery } = useInfiniteQuery<SearchOfferResponse>(
    [QueryKeys.SEARCH_RESULTS, { ...searchState, view: undefined }],
    async ({ pageParam: page = 0 }) => {
      const { offersResponse, venuesResponse } = await fetchOffersAndVenues({
        parameters: { page, ...searchState },
        userLocation: position,
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        excludedObjectIds: previousPageObjectIds.current,
      })

      dispatch({ type: 'SET_VENUES', payload: venuesResponse.hits })
      analytics.logPerformSearch(searchState, offersResponse.nbHits)

      previousPageObjectIds.current = offersResponse.hits.map((hit: Hit<Offer>) => hit.objectID)
      return offersResponse
    },
    // first page is 0
    { getNextPageParam }
  )

  const hits = useMemo(
    () =>
      flatten(data?.pages.map((page) => page.hits.map(transformHits))).filter(
        (hit) => typeof hit.offer.subcategoryId !== 'undefined'
      ) as Offer[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.pages]
  )

  const { nbHits, userData } = data?.pages[0] ?? { nbHits: 0, userData: [] }

  return { data, hits, nbHits, userData, ...infiniteQuery }
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}
