import { Hit, SearchResponse } from '@algolia/client-search'
import flatten from 'lodash/flatten'
import { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { AlgoliaVenue, FacetData } from 'libs/algolia'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchSearchResults } from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

type SearchOfferResponse = {
  offers: Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  venues: Pick<SearchResponse<AlgoliaVenue>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  facets: Pick<SearchResponse<Offer>, 'facets'>
}

export type SearchOfferHits = {
  offers: Offer[]
  venues: AlgoliaVenue[]
}

export const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])

  const { data, ...infiniteQuery } = useInfiniteQuery<SearchOfferResponse>(
    [
      QueryKeys.SEARCH_RESULTS,
      { ...searchState, view: undefined },
      userLocation,
      selectedLocationMode,
      aroundPlaceRadius,
      aroundMeRadius,
    ],
    async ({ pageParam: page = 0 }) => {
      const { offersResponse, venuesResponse, facetsResponse } = await fetchSearchResults({
        parameters: { page, ...searchState },
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode,
          aroundPlaceRadius,
          aroundMeRadius,
        },
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        excludedObjectIds: previousPageObjectIds.current,
      })

      previousPageObjectIds.current = offersResponse.hits.map((hit: Hit<Offer>) => hit.objectID)
      return { offers: offersResponse, venues: venuesResponse, facets: facetsResponse }
    },
    // first page is 0
    {
      getNextPageParam: ({ offers: { nbPages, page } }) => {
        return page + 1 < nbPages ? page + 1 : undefined
      },
    }
  )

  const hits = useMemo<SearchOfferHits>(
    () => ({
      offers: flatten(data?.pages.map((page) => page.offers.hits.map(transformHits))).filter(
        (hit) => typeof hit.offer.subcategoryId !== 'undefined'
      ) as Offer[],
      venues: flatten(data?.pages?.[0]?.venues.hits),
    }),
    [data?.pages, transformHits]
  )

  const { nbHits, userData } = data?.pages[0].offers ?? { nbHits: 0, userData: [] }
  const venuesUserData = data?.pages?.[0]?.venues?.userData
  const facets = data?.pages?.[0]?.facets.facets as FacetData

  return { data, hits, nbHits, userData, venuesUserData, facets, ...infiniteQuery }
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}
