import React from 'react'

import { useFilmsOffers } from 'features/search/pages/Search/ThematicSearch/Films/algolia/useFilmsOffers'
import { ThematicSearchPlaylistList } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylistList'

export const FilmsPlaylist: React.FC = () => {
  const { offers: filmsPlaylists, isLoading } = useFilmsOffers()

  return (
    <ThematicSearchPlaylistList
      playlists={filmsPlaylists}
      arePlaylistsLoading={isLoading}
      testId="playlistsThematicSearchFilms"
    />
  )
}
