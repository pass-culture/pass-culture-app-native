import { Hit } from '@algolia/client-search'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { Offer } from 'shared/offer/types'
import { useRenderPassPlaylist } from 'shared/renderPassPlaylist'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

const PLAYLIST_ITEM_HEIGHT = LENGTH_M
const PLAYLIST_ITEM_WIDTH = LENGTH_M * RATIO_HOME_IMAGE
export interface ThematicSearchPlaylist {
  playlist: ThematicSearchPlaylistData
  analyticsFrom: Referrals
  route: Extract<ScreenNames, 'ThematicSearch'>
}

export function ThematicSearchPlaylist({
  playlist,
  analyticsFrom,
  route,
}: Readonly<ThematicSearchPlaylist>) {
  const renderPassPlaylist = useRenderPassPlaylist({ analyticsFrom, route, playlist })
  return (
    <PassPlaylist
      data={playlist.offers.hits}
      itemWidth={PLAYLIST_ITEM_WIDTH}
      itemHeight={PLAYLIST_ITEM_HEIGHT}
      renderItem={renderPassPlaylist}
      keyExtractor={(item: Hit<Offer>) => item.objectID}
      title={playlist.title}
      noMarginBottom
      FlatListComponent={FlatList}
    />
  )
}
