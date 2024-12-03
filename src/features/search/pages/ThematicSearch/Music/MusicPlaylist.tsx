import React from 'react'

import { fetchMusicOffers } from 'features/search/pages/ThematicSearch/api/fetchMusicOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { QueryKeys } from 'libs/queryKeys'

const MUSIC_PLAYLIST_TITLES = [
  'Concerts',
  'Festivals',
  'Instruments de musique',
  'CDs',
  'Vinyles',
  'Musique en ligne',
]

export const MusicPlaylist: React.FC = () => {
  const { playlists: musicPlaylists, isLoading } = useThematicSearchPlaylists({
    playlistTitles: MUSIC_PLAYLIST_TITLES,
    fetchMethod: fetchMusicOffers,
    queryKey: QueryKeys.MUSIC_OFFERS,
  })

  return <ThematicSearchPlaylistList playlists={musicPlaylists} isLoading={isLoading} />
}
