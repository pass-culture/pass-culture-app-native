import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { ViewToken } from 'react-native'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
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
  const { data: artist, isError, error, isLoading } = useArtistQuery(params.id)

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  // Handler for modules with the new system
  const handleViewableItemsChanged = React.useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      artistId: string,
      playlistIndex?: number
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        artistId,
        playlistIndex,
      })
    },
    [pageTracking]
  )

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (isLoading || !artist || !enableArtistPage) return null

  return (
    <ArtistBody
      artist={artist}
      artistPlaylist={artistPlaylist}
      artistTopOffers={artistTopOffers}
      onViewableItemsChanged={handleViewableItemsChanged}
    />
  )
}
