import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { ViewToken } from 'react-native'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { usePageTracking } from 'shared/tracking/usePageTracking'

// Handler will be created dynamically in the component with the new system

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const pageTracking = usePageTracking({
    pageName: 'Artist',
    pageLocation: 'artist',
    pageId: params.id,
  })

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })
  const { data: artist } = useArtistQuery(params.id)

  // Handler for modules with the new system
  const handleViewableItemsChanged = React.useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown'
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        artistId: params.id,
      })
    },
    [pageTracking, params.id]
  )

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
