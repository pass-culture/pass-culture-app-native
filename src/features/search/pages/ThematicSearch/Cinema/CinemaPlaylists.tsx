import React from 'react'

import { fetchCinemaOffers } from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { QueryKeys } from 'libs/queryKeys'

const CINEMA_PLAYLISTS_TITLES = ['Films à l’affiche', 'Films de la semaine', 'Cartes ciné']

export const CinemaPlaylists: React.FC = () => {
  const { playlists: cinemaPlaylists, isLoading: areCinemaPlaylistsLoading } =
    useThematicSearchPlaylists({
      playlistTitles: CINEMA_PLAYLISTS_TITLES,
      fetchMethod: fetchCinemaOffers,
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList playlists={cinemaPlaylists} isLoading={areCinemaPlaylistsLoading} />
  )
}
