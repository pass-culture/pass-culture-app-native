import React from 'react'

import { fetchMusicOffers } from 'features/search/pages/ThematicSearch/api/fetchMusicOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'

const MUSIC_PLAYLISTS_TITLES = [
  'Musique en ligne',
  'Concerts',
  'Festivals',
  'Instruments de musique',
  'CDs',
  'Vinyles',
]

export const MusicPlaylists: React.FC = () => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const { userLocation } = useLocation()

  const { playlists: musicPlaylists, isLoading: areMusicPlaylistsLoading } =
    useThematicSearchPlaylists({
      playlistTitles: MUSIC_PLAYLISTS_TITLES,
      fetchMethod: () => fetchMusicOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.MUSIC_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList playlists={musicPlaylists} isLoading={areMusicPlaylistsLoading} />
  )
}
