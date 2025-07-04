import { Hit, SearchResponse } from '@algolia/client-search'
import { onlineManager, useInfiniteQuery } from '@tanstack/react-query'
import { uniqBy } from 'lodash'
import flatten from 'lodash/flatten'
import { useMemo, useRef } from 'react'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { Artist, Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { isGeolocValid } from 'features/venueMap/helpers/isGeolocValid'
import { removeSelectedVenue, setVenues } from 'features/venueMap/store/venueMapStore'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchSearchResults } from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaVenue, FacetData } from 'libs/algolia/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

type SearchOfferResponse = {
  offers: Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  venues: Pick<SearchResponse<AlgoliaVenue>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  facets: Pick<SearchResponse<Offer>, 'facets'>
  duplicatedOffers: Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
  offerArtists: Pick<SearchResponse<Offer>, 'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'>
}

export type SearchOfferHits = {
  offers: Offer[]
  venues: AlgoliaVenue[]
  artists: Artist[]
  duplicatedOffers: Offer[]
}

export const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius, geolocPosition } =
    useLocation()
  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { setCurrentQueryID } = useSearchAnalyticsState()
  const previousPageObjectIds = useRef<string[]>([])
  const { aroundPrecision } = useRemoteConfigQuery()

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
      const {
        offersResponse,
        venuesResponse,
        facetsResponse,
        duplicatedOffersResponse,
        offerArtistsResponse,
      } = await fetchSearchResults({
        parameters: { page, ...searchState },
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode,
          aroundPlaceRadius,
          aroundMeRadius,
          geolocPosition,
        },
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        excludedObjectIds: previousPageObjectIds.current,
        disabilitiesProperties: disabilities,
        aroundPrecision,
      })

      previousPageObjectIds.current = offersResponse.hits.map((hit: Hit<Offer>) => hit.objectID)

      return {
        offers: offersResponse,
        venues: venuesResponse,
        facets: facetsResponse,
        duplicatedOffers: duplicatedOffersResponse,
        offerArtists: offerArtistsResponse,
      }
    },
    // first page is 0
    {
      getNextPageParam: ({ offers: { nbPages, page } }) => {
        return page + 1 < nbPages ? page + 1 : undefined
      },
      enabled: onlineManager.isOnline(),
    }
  )

  const hits: SearchOfferHits = useMemo(() => {
    const { pages = [] } = data ?? {}

    removeSelectedVenue()
    const venues = flatten(pages[0]?.venues.hits)
    if (userLocation && venues.length) {
      setVenues(
        adaptAlgoliaVenues(venues).filter((venue): venue is GeolocatedVenue =>
          isGeolocValid(venue._geoloc)
        )
      )
    } else {
      setVenues([])
    }

    return {
      offers: flatten(pages.map((page) => page.offers.hits.map(transformHits))),
      venues,
      duplicatedOffers: flatten(pages.map((page) => page.duplicatedOffers.hits.map(transformHits))),
      artists: uniqBy(
        pages[0]?.offerArtists.hits
          .filter((offer) => offer.artists?.length)
          .flatMap((offer) => offer.artists ?? []),
        (artist) => artist.name.toLowerCase()
      ),
    }
  }, [data, transformHits, userLocation])

  const offersData = data?.pages[0]?.offers
  const { nbHits, userData } = offersData ?? { nbHits: 0, userData: [] }
  const venuesUserData = data?.pages?.[0]?.venues?.userData
  const facets = data?.pages?.[0]?.facets.facets as FacetData

  const offerVenues: Venue[] = useMemo(() => {
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
