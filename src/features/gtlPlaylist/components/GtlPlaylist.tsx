import { Hit } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React from 'react'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { Referrals, ScreenNames, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useFunctionOnce } from 'libs/hooks'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer } from 'shared/offer/types'
import { renderPassPlaylist } from 'shared/renderPassPlaylist'
import { PassPlaylist } from 'ui/components/PassPlaylist'

export interface GtlPlaylistProps {
  analyticsFrom: Referrals
  route: Extract<ScreenNames, 'Venue' | 'ThematicSearch'>
  playlist: GtlPlaylistData
  venue?: VenueResponse
  noMarginBottom?: boolean
}
const keyExtractor = (item: Hit<Offer>) => item.objectID

export const GtlPlaylist = ({
  venue,
  playlist,
  analyticsFrom,
  route,
  noMarginBottom,
}: Readonly<GtlPlaylistProps>) => {
  const currentRoute = useRoute<UseRouteType<typeof route>>()
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

  const renderItem = renderPassPlaylist(
    entryId,
    analyticsFrom,
    currentRoute.params?.searchId,
    venue?.id
  )

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
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        title={playlist.title}
        onEndReached={logHasSeenAllTilesOnce}
        noMarginBottom={noMarginBottom}
        FlatListComponent={FlashList}
      />
    </IntersectionObserver>
  )
}
