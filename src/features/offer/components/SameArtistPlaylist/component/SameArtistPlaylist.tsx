import React from 'react'

import { HitOfferWithArtistAndEan } from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { PlaylistType } from 'features/offer/enums'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

interface SameArtistPlaylistProps {
  items: HitOfferWithArtistAndEan[]
  renderItem: (props: {
    item: Offer
    width: number
    height: number
    playlistType?: PlaylistType
  }) => React.ReactElement
  itemWidth: number
  itemHeight: number
}

const keyExtractor = (item: HitOfferWithArtistAndEan) => item.objectID

export function SameArtistPlaylist({
  items,
  renderItem,
  itemWidth,
  itemHeight,
}: Readonly<SameArtistPlaylistProps>) {
  return (
    <SectionWithDivider testID="sameArtistPlaylist" visible>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        data={items}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        title="Du même auteur"
        playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      />
    </SectionWithDivider>
  )
}
