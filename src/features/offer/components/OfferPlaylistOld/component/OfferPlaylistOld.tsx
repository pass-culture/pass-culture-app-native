import React from 'react'

import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylistOld/api/fetchOffersByArtist'
import { PlaylistType } from 'features/offer/enums'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

interface OfferPlaylistOldProps {
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

export function OfferPlaylistOld({
  items,
  renderItem,
  itemWidth,
  itemHeight,
  title,
  playlistType,
  onEndReached,
}: Readonly<OfferPlaylistOldProps>) {
  return (
    <SectionWithDivider testID={playlistType} visible>
      <Spacer.Column numberOfSpaces={6} />
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
    </SectionWithDivider>
  )
}
