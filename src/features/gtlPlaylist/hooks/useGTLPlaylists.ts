import { useEffect, useState } from 'react'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylists, GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useLocation } from 'libs/location'

type UseGTLPlaylistsProps = {
  venue: VenueResponse | undefined
}

export function useGTLPlaylists({ venue }: UseGTLPlaylistsProps) {
  const { userLocation } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const [gtlPlaylists, setGtlPlaylists] = useState<GTLPlaylistResponse>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    if (!venue) return

    fetchGTLPlaylists({ position: userLocation, isUserUnderage, venue })
      .then((response) => {
        setGtlPlaylists(response.filter((playlist) => Boolean(playlist.offers.hits.length)))
      })
      .finally(() => setIsLoading(false))
  }, [isUserUnderage, userLocation, venue])

  return { gtlPlaylists, isLoading }
}
