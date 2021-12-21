import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import omit from 'lodash.omit'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { PartialSearchState } from 'features/search/types'
import { fetchAlgolia, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'

import { useSearch, useStagedSearch } from './SearchWrapper'

export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

const useSearchInfiniteQuery = (partialSearchState: PartialSearchState) => {
  const { position } = useGeolocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformAlgoliaHits()

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, partialSearchState],
    async ({ pageParam: page = 0 }) =>
      await fetchAlgolia({ page, ...partialSearchState }, position, isUserUnderage),
    { getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined) }
  )

  const hits = useMemo(
    () =>
      flatten(data?.pages.map((page) => page.hits.map(transformHits))).filter(
        (hit) => typeof hit.offer.subcategoryId !== 'undefined'
      ) as SearchHit[],
    [data?.pages]
  )

  const { nbHits } = data?.pages[0] || { nbHits: 0 }

  return { data, hits, nbHits, ...infiniteQuery }
}

export const useStagedSearchResults = () => {
  const { searchState } = useStagedSearch()
  return useSearchInfiniteQuery(omit(searchState, ['showResults']) as PartialSearchState)
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(omit(searchState, ['showResults']) as PartialSearchState)
}
