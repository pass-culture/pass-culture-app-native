import React, { FunctionComponent } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { HitOfferWithArtistAndEan } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

type ArtistPlaylistProps = {
  offer: OfferResponseV2
  artistName: string
  items: HitOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer | HitOfferWithArtistAndEan) => item.objectID

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({
  offer,
  artistName,
  items,
}) => {
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout('three-items')

  return items.length > 0 ? (
    <PassPlaylist
      playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      title="Toutes ses offres disponibles"
      data={items}
      renderItem={OfferPlaylistItem({
        offer,
        categoryMapping,
        labelMapping,
        variant: 'new',
        analyticsFrom: 'artist',
        artistName,
      })}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      keyExtractor={keyExtractor}
    />
  ) : null
}
