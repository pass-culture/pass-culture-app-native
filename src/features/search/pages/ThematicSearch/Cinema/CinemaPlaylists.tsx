import React from 'react'

import { fetchCinemaOffers } from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import { useThematicSearchPlaylistsQuery } from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'

const CINEMA_PLAYLISTS_TITLES = ['Films à l’affiche', 'Films de la semaine', 'Cartes ciné']

export const CinemaPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  onViewableItemsChanged,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const { userLocation } = useLocation()
  const { playlists: cinemaPlaylists, isLoading: areCinemaPlaylistsLoading } =
    useThematicSearchPlaylistsQuery({
      playlistTitles: CINEMA_PLAYLISTS_TITLES,
      fetchMethod: () => fetchCinemaOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={cinemaPlaylists}
      isLoading={areCinemaPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      onViewableItemsChanged={onViewableItemsChanged}
      searchId={searchId}
    />
  )
}
