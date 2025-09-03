import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { ViewToken } from 'react-native'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { logViewItem, setViewOfferTrackingFn } from 'shared/analytics/logViewItem'
import {
  resetPageTrackingInfo,
  setPageTrackingInfo,
  setPlaylistTrackingInfo,
  useOfferPlaylistTrackingStore,
} from 'store/tracking/playlistTrackingStore'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params, name } = useRoute<UseRouteType<'Artist'>>()

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })
  const { data: artist } = useArtistQuery(params.id)

  useEffect(() => {
    setViewOfferTrackingFn(analytics.logViewItem)
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!name) {
        return
      }
      setPageTrackingInfo({
        pageId: '',
        pageLocation: name,
      })
    }, [name])
  )

  useAppStateChange(undefined, () => logViewItem(useOfferPlaylistTrackingStore.getState()))

  useFocusEffect(
    useCallback(() => {
      return () => {
        logViewItem(useOfferPlaylistTrackingStore.getState())
        resetPageTrackingInfo()
      }
    }, [])
  )

  const handleViewableItemsChanged = (items: Pick<ViewToken, 'key' | 'index'>[]) => {
    setPlaylistTrackingInfo({
      index: items[0]?.index ?? 0,
      moduleId: 'all_offers',
      viewedAt: new Date(),
      items,
      itemType: 'offer',
    })
  }

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
