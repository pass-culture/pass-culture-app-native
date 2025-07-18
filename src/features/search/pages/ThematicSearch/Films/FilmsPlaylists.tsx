import React from 'react'

import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

const FILMS_PLAYLISTS_TITLES = [
  'Abonnements streaming',
  'Vidéos et documentaires',
  'DVD et Blu-ray',
]

export const FilmsPlaylists: React.FC = () => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const { userLocation } = useLocation()

  const { playlists: filmsPlaylists, isLoading: areFilmsPlaylistsLoading } =
    useThematicSearchPlaylists({
      playlistTitles: FILMS_PLAYLISTS_TITLES,
      fetchMethod: () => fetchFilmsOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList playlists={filmsPlaylists} isLoading={areFilmsPlaylistsLoading} />
  )
}
