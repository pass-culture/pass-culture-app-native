import { Hit, SearchResponse } from '@algolia/client-search'
import flatten from 'lodash/flatten'
import { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchSearchResults } from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaVenue, FacetData } from 'libs/algolia/types'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

type SearchOfferResponse = {
  offers: Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  venues: Pick<SearchResponse<AlgoliaVenue>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  facets: Pick<SearchResponse<Offer>, 'facets'>
  duplicatedOffers: Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
}

export type SearchOfferHits = {
  offers: Offer[]
  venues: AlgoliaVenue[]
  duplicatedOffers: Offer[]
}

export const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius } = useLocation()
  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])
  const { setInitialVenues } = useInitialVenuesActions()

  const { data, ...infiniteQuery } = useInfiniteQuery<SearchOfferResponse>(
    [
      QueryKeys.SEARCH_RESULTS,
      searchState,
      userLocation,
      selectedLocationMode,
      aroundPlaceRadius,
      aroundMeRadius,
      disabilities,
    ],
    async ({ pageParam: page = 0 }) => {
      const { offersResponse, venuesResponse, facetsResponse, duplicatedOffersResponse } =
        await fetchSearchResults({
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
          disabilitiesProperties: disabilities,
        })

      previousPageObjectIds.current = offersResponse.hits.map((hit: Hit<Offer>) => hit.objectID)
      return {
        offers: offersResponse,
        venues: venuesResponse,
        facets: facetsResponse,
        duplicatedOffers: duplicatedOffersResponse,
      }
    },
    // first page is 0
    {
      getNextPageParam: ({ offers: { nbPages, page } }) => {
        return page + 1 < nbPages ? page + 1 : undefined
      },
    }
  )

  const hits = useMemo<SearchOfferHits>(() => {
    const venues = flatten(data?.pages?.[0]?.venues.hits)
    if (userLocation && venues.length) {
      setInitialVenues(adaptAlgoliaVenues(venues))
    } else {
      setInitialVenues([])
    }
    return {
      offers: flatten(data?.pages.map((page) => page.offers.hits.map(transformHits))).filter(
        (hit) => typeof hit.offer.subcategoryId !== 'undefined'
      ) as Offer[],
      venues,
      duplicatedOffers: flatten(
        data?.pages.map((page) => page.duplicatedOffers.hits.map(transformHits))
      ).filter((hit) => typeof hit.offer.subcategoryId !== 'undefined') as Offer[],
    }
  }, [data?.pages, setInitialVenues, transformHits, userLocation])

  // @ts-expect-error: because of noUncheckedIndexedAccess
  const { nbHits, userData } = data?.pages[0].offers ?? { nbHits: 0, userData: [] }
  const venuesUserData = data?.pages?.[0]?.venues?.userData
  const facets = data?.pages?.[0]?.facets.facets as FacetData

  const offerVenues = useMemo(() => {
    const venueMap = new Map()
    hits.duplicatedOffers.forEach((hit) => {
      if (hit.venue) {
        const { id, name, address, city, ...restVenue } = hit.venue
        const venue = {
          venueId: id,
          label: name,
          info: address && city ? `${address}, ${city}` : '',
          ...restVenue,
          _geoloc: hit._geoloc,
        }
        venueMap.set(id, venue)
      }
    })
    return Array.from(venueMap.values())
  }, [hits.duplicatedOffers])

  return {
    data,
    hits,
    nbHits: nbHits === 0 ? hits.offers.length : nbHits, // (PC-28287) there is an algolia bugs that return 0 nbHits but there are hits
    userData,
    venuesUserData,
    facets,
    offerVenues,
    ...infiniteQuery,
  }
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}
