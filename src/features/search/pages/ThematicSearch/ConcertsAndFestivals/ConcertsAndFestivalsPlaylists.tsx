import React from 'react'

import { fetchConcertsAndFestivalsOffers } from 'features/search/pages/ThematicSearch/api/fetchConcertsAndFestivalsOffers'
import { useThematicSearchPlaylistsQuery } from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicSearchPlaylistConfig } from 'features/search/pages/ThematicSearch/types'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useUserLocation } from 'libs/locationV2/location.store'
import { QueryKeys } from 'libs/queryKeys'

const CONCERTS_AND_FESTIVALS_PLAYLISTS: ThematicSearchPlaylistConfig[] = [
  { id: 'concerts_festivals_concerts', title: 'Concerts' },
  { id: 'concerts_festivals_festivals', title: 'Festivals' },
]

export const ConcertsAndFestivalsPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const userLocation = useUserLocation()

  const { playlists: concertsAndFestivals, isLoading: areConcertsAndFestivalsPlaylistsLoading } =
    useThematicSearchPlaylistsQuery({
      playlistsConfig: CONCERTS_AND_FESTIVALS_PLAYLISTS,
      fetchMethod: () =>
        fetchConcertsAndFestivalsOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.CONCERTS_AND_FESTIVALS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={concertsAndFestivals}
      isLoading={areConcertsAndFestivalsPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      searchId={searchId}
      originId="thematicSearchConcertsFestivals"
    />
  )
}
