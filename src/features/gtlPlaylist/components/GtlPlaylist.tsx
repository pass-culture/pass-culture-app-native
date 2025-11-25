import { Hit } from 'algoliasearch/lite'
import React, { Ref } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { Referrals, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
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
  venue?: Omit<VenueResponse, 'isVirtual'>
  noMarginBottom?: boolean
  playlistRef?: Ref<FlatList>
  onViewableItemsChanged?: (info: { viewableItems: ViewToken<unknown>[] }) => void
  searchId?: string
}

export function GtlPlaylist({
  venue,
  playlist,
  analyticsFrom,
  route,
  noMarginBottom,
  onViewableItemsChanged,
  playlistRef,
  searchId,
}: Readonly<GtlPlaylistProps>) {
  const entryId = playlist.entryId

  const logHasSeenAllTilesOnce = useFunctionOnce(() => {
    void analytics.logAllTilesSeen({
      moduleId: entryId,
      numberOfTiles: playlist.offers.hits.length,
      venueId: venue?.id,
    })
  })

  const logModuleDisplayedOnce = useFunctionOnce(() => {
    void analytics.logModuleDisplayed({
      moduleId: entryId,
      displayedOn: analyticsFrom,
      venueId: venue?.id,
    })
  })

  const handleLogModuleDisplayedScrolling = useLogScrollHandler(logModuleDisplayedOnce)

  const renderPassPlaylist = useRenderPassPlaylist({
    analyticsFrom,
    route,
    playlist,
    venue,
    searchId,
  })

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
        FlatListComponent={FlatList}
        playlistRef={playlistRef}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </IntersectionObserver>
  )
}
