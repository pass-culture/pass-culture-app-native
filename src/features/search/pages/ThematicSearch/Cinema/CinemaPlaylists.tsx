import React from 'react'

import { fetchCinemaOffers } from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import { useThematicSearchPlaylistsQuery } from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicSearchPlaylistConfig } from 'features/search/pages/ThematicSearch/types'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useUserLocation } from 'libs/locationV2/location.store'
import { QueryKeys } from 'libs/queryKeys'

const CINEMA_PLAYLISTS: ThematicSearchPlaylistConfig[] = [
  { id: 'cinema_films_a_l_affiche', title: 'Films à l’affiche' },
  { id: 'cinema_films_de_la_semaine', title: 'Films de la semaine' },
  { id: 'cinema_cartes_cine', title: 'Cartes ciné' },
]

export const CinemaPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const userLocation = useUserLocation()
  const { playlists: cinemaPlaylists, isLoading: areCinemaPlaylistsLoading } =
    useThematicSearchPlaylistsQuery({
      playlistsConfig: CINEMA_PLAYLISTS,
      fetchMethod: () => fetchCinemaOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.FILMS_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={cinemaPlaylists}
      isLoading={areCinemaPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      searchId={searchId}
      originId="thematicSearchCinema"
    />
  )
}
