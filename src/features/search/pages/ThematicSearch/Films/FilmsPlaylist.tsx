import React from 'react'

import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { QueryKeys } from 'libs/queryKeys'

const FILMS_PLAYLIST_TITLES = ['Abonnements streaming', 'Vidéos et documentaires', 'DVD et Blu-ray']

export const FilmsPlaylist: React.FC = () => {
  const { playlists: filmsPlaylists, isLoading } = useThematicSearchPlaylists({
    playlistTitles: FILMS_PLAYLIST_TITLES,
    fetchMethod: fetchFilmsOffers,
    queryKey: QueryKeys.FILMS_OFFERS,
  })

  return <ThematicSearchPlaylistList playlists={filmsPlaylists} isLoading={isLoading} />
}
