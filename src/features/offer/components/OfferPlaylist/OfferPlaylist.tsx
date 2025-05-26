import React, { ComponentProps } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

interface OfferPlaylistProps
  extends Omit<ComponentProps<typeof PassPlaylist>, 'data' | 'keyExtractor'> {
  items: Offer[] | AlgoliaOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export function OfferPlaylist({
  items,
  renderItem,
  itemWidth,
  itemHeight,
  title,
  playlistType,
  onEndReached,
  playlistRef,
  onViewableItemsChanged,
}: Readonly<OfferPlaylistProps>) {
  return (
    <View>
      <StyledPassPlaylist
        data={items}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        title={title}
        playlistType={playlistType}
        onEndReached={onEndReached}
        onViewableItemsChanged={onViewableItemsChanged}
        playlistRef={playlistRef}
        FlatListComponent={FlatList}
      />
    </View>
  )
}

const StyledPassPlaylist = styled(PassPlaylist)({
  paddingBottom: 0,
})
