import { Hit } from '@algolia/client-search'
import React, { useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useFunctionOnce } from 'libs/hooks'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { useRenderPassPlaylist } from 'shared/renderPassPlaylist'
import { PassPlaylist } from 'ui/components/PassPlaylist'

export interface GtlPlaylistProps {
  analyticsFrom: Referrals
  route: Extract<ScreenNames, 'Venue' | 'ThematicSearch'>
  playlist: GtlPlaylistData
  venue?: VenueResponse
  noMarginBottom?: boolean
  onViewableItemsChanged?: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown'
  ) => void
}

export function GtlPlaylist({
  venue,
  playlist,
  analyticsFrom,
  route,
  noMarginBottom,
  onViewableItemsChanged,
}: Readonly<GtlPlaylistProps>) {
  const entryId = playlist.entryId

  const logHasSeenAllTilesOnce = useFunctionOnce(() => {
    analytics.logAllTilesSeen({
      moduleId: entryId,
      numberOfTiles: playlist.offers.hits.length,
      venueId: venue?.id,
    })
  })

  const logModuleDisplayedOnce = useFunctionOnce(() => {
    analytics.logModuleDisplayed({
      moduleId: entryId,
      displayedOn: analyticsFrom,
      venueId: venue?.id,
    })
  })

  const handleLogModuleDisplayedScrolling = useLogScrollHandler(logModuleDisplayedOnce)

  const renderPassPlaylist = useRenderPassPlaylist({ analyticsFrom, route, playlist, venue })

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(playlist.layout)

  const handleGtlPlaylistViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      onViewableItemsChanged?.(items, playlist.title, 'offer')
    },
    [onViewableItemsChanged, playlist.title]
  )

  return (
    <IntersectionObserver
      onChange={handleLogModuleDisplayedScrolling}
      threshold="50%"
      key={entryId}>
      <ObservedPlaylist onViewableItemsChanged={handleGtlPlaylistViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <PassPlaylist
            data={playlist.offers.hits}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={renderPassPlaylist}
            keyExtractor={(item: Hit<Offer>) => item.objectID}
            title={playlist.title}
            onEndReached={logHasSeenAllTilesOnce}
            noMarginBottom={noMarginBottom}
            FlatListComponent={FlatList}
            playlistRef={listRef}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
        )}
      </ObservedPlaylist>
    </IntersectionObserver>
  )
}
