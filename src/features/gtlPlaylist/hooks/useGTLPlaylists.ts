import { useEffect, useState } from 'react'

import { fetchGTLPlaylists, GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'

export function useGTLPlaylists() {
  const { position } = useHomePosition()
  const isUserUnderage = useIsUserUnderage()
  const [gtlPlaylists, setGtlPlaylists] = useState<GTLPlaylistResponse>([])

  useEffect(() => {
    fetchGTLPlaylists({ position, isUserUnderage }).then((response) => {
      setGtlPlaylists(response)
    })
  }, [isUserUnderage, position])

  return gtlPlaylists
}
