import React from 'react'

import { fetchConcertsAndFestivalsOffers } from 'features/search/pages/ThematicSearch/api/fetchConcertsAndFestivalsOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'

const CONCERTS_AND_FESTIVALS_PLAYLISTS_TITLES = ['Concerts', 'Festivals']

export const ConcertsAndFestivalsPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  onViewableItemsChanged,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const { userLocation } = useLocation()

  const { playlists: concertsAndFestivals, isLoading: areConcertsAndFestivalsPlaylistsLoading } =
    useThematicSearchPlaylists({
      playlistTitles: CONCERTS_AND_FESTIVALS_PLAYLISTS_TITLES,
      fetchMethod: () =>
        fetchConcertsAndFestivalsOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.CONCERTS_AND_FESTIVALS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={concertsAndFestivals}
      isLoading={areConcertsAndFestivalsPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  )
}
