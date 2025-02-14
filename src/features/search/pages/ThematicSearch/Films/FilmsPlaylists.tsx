import React from 'react'

import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { QueryKeys } from 'libs/queryKeys'

const FILMS_PLAYLISTS_TITLES = [
  'Abonnements streaming',
  'Vidéos et documentaires',
  'DVD et Blu-ray',
]

export const FilmsPlaylists: React.FC = () => {
  const { playlists: filmsPlaylists, isLoading: areFilmsPlaylistsLoading } =
    useThematicSearchPlaylists({
      playlistTitles: FILMS_PLAYLISTS_TITLES,
      fetchMethod: fetchFilmsOffers,
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList playlists={filmsPlaylists} isLoading={areFilmsPlaylistsLoading} />
  )
}
