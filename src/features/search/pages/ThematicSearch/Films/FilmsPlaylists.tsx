import React from 'react'

import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { useThematicSearchPlaylistsQuery } from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'

const FILMS_PLAYLISTS_TITLES = [
  'Abonnements streaming',
  'Vidéos et documentaires',
  'DVD et Blu-ray',
]

export const FilmsPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  onViewableItemsChanged,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const { userLocation } = useLocation()

  const { playlists: filmsPlaylists, isLoading: areFilmsPlaylistsLoading } =
    useThematicSearchPlaylistsQuery({
      playlistTitles: FILMS_PLAYLISTS_TITLES,
      fetchMethod: () => fetchFilmsOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={filmsPlaylists}
      isLoading={areFilmsPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      onViewableItemsChanged={onViewableItemsChanged}
      searchId={searchId}
    />
  )
}
