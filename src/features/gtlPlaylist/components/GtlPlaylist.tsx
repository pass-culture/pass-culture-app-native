import { Hit } from '@algolia/client-search'
import { FlashList } from '@shopify/flash-list'
import React from 'react'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useFunctionOnce } from 'libs/hooks'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer } from 'shared/offer/types'
import { useRenderPassPlaylist } from 'shared/renderPassPlaylist'
import { PassPlaylist } from 'ui/components/PassPlaylist'

export interface GtlPlaylistProps {
  analyticsFrom: Referrals
  route: Extract<ScreenNames, 'Venue' | 'ThematicSearch'>
  playlist: GtlPlaylistData
  venue?: VenueResponse
  noMarginBottom?: boolean
}

export function GtlPlaylist({
  venue,
  playlist,
  analyticsFrom,
  route,
  noMarginBottom,
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

  return (
    <IntersectionObserver
      onChange={handleLogModuleDisplayedScrolling}
      threshold="50%"
      key={entryId}>
      <PassPlaylist
        data={playlist.offers.hits}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        renderItem={renderPassPlaylist}
        keyExtractor={(item: Hit<Offer>) => item.objectID}
        title={playlist.title}
        onEndReached={logHasSeenAllTilesOnce}
        noMarginBottom={noMarginBottom}
        FlatListComponent={FlashList}
      />
    </IntersectionObserver>
  )
}
