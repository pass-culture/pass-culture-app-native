import React from 'react'

import { HitOfferWithArtistAndEan } from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { PlaylistType } from 'features/offer/enums'
import { Offer, RecommendationApiParams } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

interface SameArtistPlaylistProps {
  sameArtistPlaylist: HitOfferWithArtistAndEan[]
  renderItem: (
    props: {
      item: Offer
      width: number
      height: number
      playlistType?: PlaylistType
    },
    apiRecoParams?: RecommendationApiParams
  ) => React.ReactElement
  itemWidth: number
  itemHeight: number
  keyExtractor: (item: HitOfferWithArtistAndEan) => string
}

export function SameArtistPlaylist({
  sameArtistPlaylist,
  renderItem,
  itemWidth,
  itemHeight,
  keyExtractor,
}: Readonly<SameArtistPlaylistProps>) {
  return (
    <SectionWithDivider testID="sameArtistPlaylist" visible>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        data={sameArtistPlaylist}
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
