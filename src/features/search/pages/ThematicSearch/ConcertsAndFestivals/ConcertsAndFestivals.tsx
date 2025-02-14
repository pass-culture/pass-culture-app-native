import React from 'react'

import { fetchConcertsAndFestivalsOffers } from 'features/search/pages/ThematicSearch/api/fetchConcertsAndFestivalsOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { QueryKeys } from 'libs/queryKeys'

const CONCERTS_AND_FESTIVALS_PLAYLIST_TITLES = ['Concerts', 'Festivals']

export const ConcertsAndFestivalsPlaylist: React.FC = () => {
  const { playlists: concertsAndFestivals } = useThematicSearchPlaylists({
    playlistTitles: CONCERTS_AND_FESTIVALS_PLAYLIST_TITLES,
    fetchMethod: fetchConcertsAndFestivalsOffers,
    queryKey: QueryKeys.CONCERTS_AND_FESTIVALS,
  })

  return <ThematicSearchPlaylistList playlists={concertsAndFestivals} />
}
