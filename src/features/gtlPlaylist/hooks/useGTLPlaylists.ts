import { useQuery } from 'react-query'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylists } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type UseGTLPlaylistsProps = {
  venue: VenueResponse | undefined
}

export function useGTLPlaylists({ venue }: UseGTLPlaylistsProps) {
  const netInfo = useNetInfoContext()
  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()

  const { data: gtlPlaylists, isLoading } = useQuery({
    queryKey: [QueryKeys.VENUE_GTL_PLAYLISTS, venue?.id, userLocation, selectedLocationMode],
    queryFn: () => {
      if (!venue) return Promise.resolve([])
      return fetchGTLPlaylists({
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage,
        venue,
      })
    },
    enabled: !!netInfo.isConnected && !!venue?.id,
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
