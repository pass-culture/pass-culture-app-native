import React, { FunctionComponent } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { HitOfferWithArtistAndEan } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { useSameArtistPlaylist } from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Subcategory } from 'libs/subcategories/types'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

type ArtistPlaylistProps = {
  offer: OfferResponseV2
  subcategory: Subcategory
  artistName: string
}

const keyExtractor = (item: Offer | HitOfferWithArtistAndEan) => item.objectID

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({
  subcategory,
  offer,
  artistName,
}) => {
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout('two-items')

  const artists = offer?.extraData?.author
  const venueLocation = offer?.venue.coordinates
  const { sameArtistPlaylist } = useSameArtistPlaylist({
    artists,
    searchGroupName: subcategory.searchGroupName,
    venueLocation,
  })

  return sameArtistPlaylist.length > 0 ? (
    <PassPlaylist
      playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      title="Toutes ses offres disponibles"
      data={sameArtistPlaylist}
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
