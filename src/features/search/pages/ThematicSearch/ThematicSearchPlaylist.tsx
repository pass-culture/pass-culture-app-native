import { Hit } from 'algoliasearch/lite'
import React, { Ref } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { analytics } from 'libs/analytics/provider'
import { Offer } from 'shared/offer/types'
import { useRenderPassPlaylist } from 'shared/renderPassPlaylist'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
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

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: { type: VerticalPlaylist.ThematicSearchOffers, module: playlist },
  }

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'offers',
      moduleName: playlist.title,
      from: analyticsFrom,
    })
  }

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
      seeAllButton={{
        onBeforeNavigate,
        navigateToVerticalPlaylist,
        hideSearchSeeAll: true,
      }}
    />
  )
}
