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
  const { userLocation } = useLocation()
  const isUserUnderage = useIsUserUnderage()

  const { data: gtlPlaylists, isLoading } = useQuery({
    queryKey: [QueryKeys.VENUE_GTL_PLAYLISTS, venue?.id],
    queryFn: () => {
      if (!venue) return Promise.resolve([])
      return fetchGTLPlaylists({ position: userLocation, isUserUnderage, venue })
    },
    enabled: !!netInfo.isConnected && !!venue?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes, as the GTL playlists are not often updated
  })

  if (!gtlPlaylists) {
    return { gtlPlaylists: [], isLoading }
  }

  return {
    gtlPlaylists: gtlPlaylists.filter((playlist) => Boolean(playlist.offers.hits.length)),
    isLoading,
  }
}
