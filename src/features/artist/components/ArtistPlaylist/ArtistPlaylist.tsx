import React, { FunctionComponent } from 'react'

import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import {
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useSubcategoryOfferLabelMapping } from 'libs/subcategories/mappings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

type ArtistPlaylistProps = {
  artistName: string
  items: AlgoliaOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({ artistName, items }) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useSubcategoryOfferLabelMapping()
  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout('three-items')

  return items.length > 0 ? (
    <PassPlaylist
      playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      title="Toutes ses offres disponibles"
      data={items}
      renderItem={OfferPlaylistItem({
        categoryMapping,
        labelMapping,
        currency,
        euroToPacificFrancRate,
        analyticsFrom: 'artist',
        artistName,
        priceDisplay: (item: Offer) =>
          getDisplayedPrice(
            item.offer.prices,
            currency,
            euroToPacificFrancRate,
            getIfPricesShouldBeFixed(item.offer.subcategoryId) ? undefined : formatStartPrice
          ),
      })}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      keyExtractor={keyExtractor}
    />
  ) : null
}
