import { useEffect, useState } from 'react'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylists, GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'

type UseGTLPlaylistsProps = {
  venue: VenueResponse | undefined
}

export function useGTLPlaylists({ venue }: UseGTLPlaylistsProps) {
  const { position } = useHomePosition()
  const isUserUnderage = useIsUserUnderage()
  const [gtlPlaylists, setGtlPlaylists] = useState<GTLPlaylistResponse>([])

  useEffect(() => {
    if (!venue) return

    fetchGTLPlaylists({ position, isUserUnderage, venue }).then((response) => {
      setGtlPlaylists(response)
    })
  }, [isUserUnderage, position, venue])

  return gtlPlaylists
}
