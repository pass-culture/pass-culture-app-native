import React from 'react'

import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { useThematicSearchPlaylistsQuery } from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicSearchPlaylistConfig } from 'features/search/pages/ThematicSearch/types'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useUserLocation } from 'libs/locationV2/location.store'
import { QueryKeys } from 'libs/queryKeys'

const FILMS_PLAYLISTS: ThematicSearchPlaylistConfig[] = [
  { id: 'films_abonnements_streaming', title: 'Abonnements streaming' },
  { id: 'films_videos_et_documentaires', title: 'Vidéos et documentaires' },
  { id: 'films_dvd_et_blu_ray', title: 'DVD et Blu-ray' },
]

export const FilmsPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const userLocation = useUserLocation()

  const { playlists: filmsPlaylists, isLoading: areFilmsPlaylistsLoading } =
    useThematicSearchPlaylistsQuery({
      playlistsConfig: FILMS_PLAYLISTS,
      fetchMethod: () => fetchFilmsOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={filmsPlaylists}
      isLoading={areFilmsPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      searchId={searchId}
      originId="thematicSearchFilmsSeriesDocumentaires"
    />
  )
}
