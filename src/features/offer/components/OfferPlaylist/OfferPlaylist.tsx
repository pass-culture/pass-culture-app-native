import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

interface OfferPlaylistProps {
  items: Offer[] | AlgoliaOfferWithArtistAndEan[]
  renderItem: (props: {
    item: Offer
    width: number
    height: number
    playlistType?: PlaylistType
  }) => React.ReactElement
  itemWidth: number
  itemHeight: number
  title: string
  playlistType: PlaylistType
  onEndReached?: () => void
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
      />
    </View>
  )
}

const StyledPassPlaylist = styled(PassPlaylist)({
  paddingBottom: 0,
})
