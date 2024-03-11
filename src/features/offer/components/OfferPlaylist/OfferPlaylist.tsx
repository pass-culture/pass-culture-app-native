import React from 'react'
import { View } from 'react-native'

import { HitOfferWithArtistAndEan } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { PlaylistType } from 'features/offer/enums'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { Spacer } from 'ui/theme'

interface OfferPlaylistProps {
  items: Offer[] | HitOfferWithArtistAndEan[]
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

const keyExtractor = (item: Offer | HitOfferWithArtistAndEan) => item.objectID

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
      <Spacer.Column numberOfSpaces={2} />
      <PassPlaylist
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
