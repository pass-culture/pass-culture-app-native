import { Hit } from 'algoliasearch/lite'
import React, { Ref } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { Referrals, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
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
  playlistRef?: Ref<FlatList>
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken<unknown>[]
    changed: ViewToken<unknown>[]
  }) => void
  searchId?: string
}

export function ThematicSearchPlaylist({
  playlist,
  analyticsFrom,
  route,
  playlistRef,
  onViewableItemsChanged,
  searchId,
}: Readonly<ThematicSearchPlaylist>) {
  const renderPassPlaylist = useRenderPassPlaylist({ analyticsFrom, route, playlist, searchId })
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
      playlistRef={playlistRef}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  )
}
