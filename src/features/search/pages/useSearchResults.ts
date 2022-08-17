import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash/flatten'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { SearchState } from 'features/search/types'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffer, useTransformOfferHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'

import { useSearch, useStagedSearch } from './SearchWrapper'

export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { position } = useGeolocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, searchState],
    async ({ pageParam: page = 0 }) =>
      await fetchOffer({
        parameters: { page, ...searchState },
        userLocation: position,
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
      }),
    { getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined) }
  )

  const hits = useMemo(
    () =>
      flatten(data?.pages.map((page) => page.hits.map(transformHits))).filter(
        (hit) => typeof hit.offer.subcategoryId !== 'undefined'
      ) as SearchHit[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.pages]
  )

  const { nbHits } = data?.pages[0] || { nbHits: 0 }

  return { data, hits, nbHits, ...infiniteQuery }
}

export const useStagedSearchResults = () => {
  const { searchState } = useStagedSearch()
  return useSearchInfiniteQuery(searchState)
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}
