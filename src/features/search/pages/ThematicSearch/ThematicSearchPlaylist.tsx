import { Hit } from 'algoliasearch/lite'
import React, { Ref } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { Referrals, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
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

  const logModuleDisplayedOnce = useFunctionOnce(() => {
    void analytics.logModuleDisplayed({
      moduleId: playlist.id,
      displayedOn: analyticsFrom,
      searchId,
    })
  })

  const handleLogModuleDisplayedScrolling = useLogScrollHandler(logModuleDisplayedOnce)

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
    <IntersectionObserver onChange={handleLogModuleDisplayedScrolling} threshold={0.5}>
      <PassPlaylist
        data={playlist.offers.hits}
        itemWidth={PLAYLIST_ITEM_WIDTH}
        itemHeight={PLAYLIST_ITEM_HEIGHT}
        nbItems={playlist.offers.hits.length}
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
    </IntersectionObserver>
  )
}
