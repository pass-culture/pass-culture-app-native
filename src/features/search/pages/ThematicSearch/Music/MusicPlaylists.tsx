import React from 'react'

import { fetchMusicOffers } from 'features/search/pages/ThematicSearch/api/fetchMusicOffers'
import { useThematicSearchPlaylistsQuery } from 'features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery'
import { ThematicSearchPlaylistList } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { ThematicSearchPlaylistConfig } from 'features/search/pages/ThematicSearch/types'
import { ThematicPlaylistProps } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useUserLocation } from 'libs/locationV2/location.store'
import { QueryKeys } from 'libs/queryKeys'

const MUSIC_PLAYLISTS: ThematicSearchPlaylistConfig[] = [
  { id: 'musique_musique_en_ligne', title: 'Musique en ligne' },
  { id: 'musique_concerts', title: 'Concerts' },
  { id: 'musique_festivals', title: 'Festivals' },
  { id: 'musique_instruments_de_musique', title: 'Instruments de musique' },
  { id: 'musique_cds', title: 'CDs' },
  { id: 'musique_vinyles', title: 'Vinyles' },
]

export const MusicPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const userLocation = useUserLocation()

  const { playlists: musicPlaylists, isLoading: areMusicPlaylistsLoading } =
    useThematicSearchPlaylistsQuery({
      playlistsConfig: MUSIC_PLAYLISTS,
      fetchMethod: () => fetchMusicOffers({ userLocation, isReplicaAlgoliaIndexActive }),
      queryKey: QueryKeys.MUSIC_OFFERS,
    })

  return (
    <ThematicSearchPlaylistList
      playlists={musicPlaylists}
      isLoading={areMusicPlaylistsLoading}
      shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
      searchId={searchId}
      originId="thematicSearchMusique"
    />
  )
}
