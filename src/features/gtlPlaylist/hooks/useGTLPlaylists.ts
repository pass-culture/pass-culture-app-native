import { useEffect, useState } from 'react'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylists, GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'

type UseGTLPlaylistsProps = {
  venue: VenueResponse | undefined
}

export function useGTLPlaylists({ venue }: UseGTLPlaylistsProps) {
  const isUserUnderage = useIsUserUnderage()
  const [gtlPlaylists, setGtlPlaylists] = useState<GTLPlaylistResponse>([])

  useEffect(() => {
    if (!venue) return

    fetchGTLPlaylists({ isUserUnderage, venue }).then((response) => {
      setGtlPlaylists(response.filter((playlist) => Boolean(playlist.offers.hits.length)))
    })
  }, [isUserUnderage, venue])

  return gtlPlaylists
}
