import { SearchResponse } from '@algolia/client-search'
import { useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers/fetchOffers'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { Offer, OffersWithPage } from 'shared/offer/types'

export type Response = Pick<
  SearchResponse<Offer>,
  'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'
>

export const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { userPosition: position } = useGeolocation()
  const isUserUnderage = useIsUserUnderage()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])
  const { data: settings } = useSettingsContext()
  const { objectStorageUrl: imageUrlPrefix } = settings || {}

  const { data, ...infiniteQuery } = useInfiniteQuery<OffersWithPage>(
    [QueryKeys.SEARCH_RESULTS, { ...searchState, view: undefined }],
    async ({ pageParam: page = 0 }) => {
      const response = await fetchOffers({
        parameters: { page, ...searchState },
        userLocation: position,
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        excludedObjectIds: previousPageObjectIds.current,
        imageUrlPrefix,
      })

      analytics.logPerformSearch(searchState, response.nbOffers)

      previousPageObjectIds.current = response.offers.map((offer) => offer.objectID)
      return response
    },
    // first page is 0
    { getNextPageParam }
  )

  const { nbOffers, userData, offers } = data?.pages[0] || {
    nbOffers: 0,
    userData: [],
    offers: [] as Offer[],
  }

  return { data, offers, nbOffers, userData, ...infiniteQuery }
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}

// first page is 0
export const getNextPageParam = ({ page, nbPages }: { page: number; nbPages: number }) =>
  page + 1 < nbPages ? page + 1 : undefined
