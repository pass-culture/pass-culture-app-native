import { uniqBy } from 'lodash'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { Artist, VenueOffersArtists } from 'features/venue/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useVenueOffersArtists = (
  venue?: VenueResponse
): UseQueryResult<VenueOffersArtists> => {
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()

  const buildPlaylistOfferParams = useCallback(
    (offerParams: SearchQueryParameters) => ({
      locationParams: {
        userLocation,
        selectedLocationMode,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: MAX_RADIUS,
      },
      offerParams,
    }),
    [userLocation, selectedLocationMode]
  )

  return useQuery(
    [QueryKeys.VENUE_OFFERS_ARTISTS, venue?.id, userLocation, selectedLocationMode],
    () =>
      fetchMultipleOffers({
        paramsList: [
          buildPlaylistOfferParams({
            ...searchState,
            venue: venueSearchParams.venue,
            hitsPerPage: venueSearchParams.hitsPerPage,
          }),
          buildPlaylistOfferParams(venueSearchParams),
        ],
        isUserUnderage,
        indexName: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
      }),
    {
      enabled: !!(netInfo.isConnected && netInfo.isInternetReachable && venue),
      select: ({ hits }) => {
        const filteredHits = hits.filter(filterOfferHit).map(transformHits)

        const offers = filteredHits.filter((hit): hit is Offer => hit !== null)

        const artists: Artist[] = uniqBy(
          offers
            .map((offer) => {
              if (!offer.offer.artist) return null

              const artist: Artist = { name: offer.offer.artist, imageUrl: offer.offer.thumbUrl }

              return artist
            })
            .filter((item): item is Artist => item !== null),
          'name'
        )

        return {
          artists,
          nbArtists: artists.length,
        }
      },
    }
  )
}
