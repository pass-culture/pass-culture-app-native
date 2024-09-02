import { useQuery } from 'react-query'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type UseGTLPlaylistsProps = {
  queryKey: keyof typeof QueryKeys
  venue?: VenueResponse
  searchIndex?: string
}

export function useGTLPlaylists({
  queryKey: gtlPlaylistsQueryKey,
  venue,
  searchIndex,
}: UseGTLPlaylistsProps) {
  const netInfo = useNetInfoContext()
  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()

  const { data: gtlPlaylists, isLoading } = useQuery({
    queryKey: [gtlPlaylistsQueryKey, venue?.id, userLocation, selectedLocationMode],
    queryFn: async (): Promise<GtlPlaylistData[]> => {
      if (gtlPlaylistsQueryKey === 'VENUE_GTL_PLAYLISTS' && !venue) return Promise.resolve([])
      const gtlPlaylistsConfig = await fetchGTLPlaylistConfig()
      const offers = await fetchOffersByGTL(
        gtlPlaylistsConfig.map((request) => {
          const params = adaptPlaylistParameters(request.offersModuleParameters)
          return venue
            ? {
                ...params,
                offerParams: {
                  ...params.offerParams,
                  venue: {
                    venueId: venue.id,
                    info: venue.city ?? '',
                    label: venue.name,
                  },
                },
              }
            : params
        }),
        {
          userLocation,
          selectedLocationMode,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage,
        searchIndex
      )

      return gtlPlaylistsConfig.map((item, index) => ({
        title: item.displayParameters.title,
        offers: offers[index] ?? { hits: [] },
        layout: item.displayParameters.layout,
        minNumberOfOffers: item.displayParameters.minOffers,
        entryId: item.id,
      }))
    },
    enabled: !!netInfo.isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes, as the GTL playlists are not often updated
  })

  if (!gtlPlaylists) {
    return { gtlPlaylists: [], isLoading }
  }

  return {
    gtlPlaylists: gtlPlaylists.filter(
      (playlist) => playlist.offers.hits.length >= Math.max(playlist.minNumberOfOffers, 1)
    ),
    isLoading,
  }
}
