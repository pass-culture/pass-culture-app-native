import React from 'react'

import { useCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/useCinemaOffers'
import { ThematicSearchPlaylistList } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylistList'

export const CinemaPlaylist: React.FC = () => {
  const { offers: cinemaPlaylists, isLoading } = useCinemaOffers()

  return (
    <ThematicSearchPlaylistList
      playlists={cinemaPlaylists}
      arePlaylistsLoading={isLoading}
      testId="playlistsThematicSearchCinema"
    />
  )
}
