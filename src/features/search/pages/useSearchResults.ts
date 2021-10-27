import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import omit from 'lodash.omit'
import { useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { PartialSearchState } from 'features/search/types'
import { fetchAlgolia, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { fetchHits as fetchAppSearchHits } from 'libs/search/fetch/search'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'
import { useSendAdditionalRequestToAppSearch } from 'libs/search/useSendAdditionalRequestToAppSearch'

import { useSearch, useStagedSearch } from './SearchWrapper'

export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

const useSearchInfiniteQuery = (partialSearchState: PartialSearchState) => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const { position } = useGeolocation()
  const sendAdditionalRequest = useSendAdditionalRequestToAppSearch()
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const transformHits = useTransformAlgoliaHits()

  const fetchHits = isAppSearchBackend ? fetchAppSearchHits : fetchAlgolia

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, partialSearchState],
    async (context: QueryFunctionContext<[string, PartialSearchState], number>) => {
      const page = context.pageParam || 0
      const searchState = context.queryKey[1]
      return await fetchHits({ page, ...searchState }, position, isUserUnderageBeneficiary)
    },
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
      enabled,
      onSuccess: sendAdditionalRequest(() =>
        fetchAppSearchHits({ page: 0, ...partialSearchState }, position, isUserUnderageBeneficiary)
      ),
    }
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
