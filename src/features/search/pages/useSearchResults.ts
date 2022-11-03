import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash/flatten'
import { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { SearchState } from 'features/search/types'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffer, useTransformOfferHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'

import { useSearch } from './SearchWrapper'

export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { position } = useGeolocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, searchState],
    async ({ pageParam: page = 0 }) => {
      const response = await fetchOffer({
        parameters: { page, ...searchState },
        userLocation: position,
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        excludedObjectIds: previousPageObjectIds.current,
      })
      previousPageObjectIds.current = response.hits.map((hit) => hit.objectID)
      return response
    },
    // first page is 0
    { getNextPageParam }
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

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}

// first page is 0
export const getNextPageParam = ({ page, nbPages }: { page: number; nbPages: number }) =>
  page + 1 < nbPages ? page + 1 : undefined
