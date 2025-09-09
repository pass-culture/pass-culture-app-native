import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { ViewToken } from 'react-native'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { useViewItemTracking } from 'shared/hook/useViewItemTracking'
import { setPlaylistTrackingInfo } from 'store/tracking/playlistTrackingStore'

const handleViewableItemsChanged = (
  items: Pick<ViewToken, 'key' | 'index'>[],
  moduleId: string,
  itemType: 'offer' | 'venue' | 'artist' | 'unknown',
  artistId: string
) => {
  setPlaylistTrackingInfo({
    index: items[0]?.index ?? 0,
    moduleId,
    viewedAt: new Date(),
    items,
    itemType,
    artistId,
  })
}

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params, name } = useRoute<UseRouteType<'Artist'>>()
  useViewItemTracking(name)

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })
  const { data: artist } = useArtistQuery(params.id)

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!artist || !enableArtistPage) return null

  return (
    <ArtistBody
      artist={artist}
      artistPlaylist={artistPlaylist}
      artistTopOffers={artistTopOffers}
      onViewableItemsChanged={handleViewableItemsChanged}
    />
  )
}
