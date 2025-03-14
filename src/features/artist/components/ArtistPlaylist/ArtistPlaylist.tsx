import React, { FunctionComponent } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import { getDisplayedPrice, getIfPricesShouldBeFix } from 'libs/parsers/getDisplayedPrice'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useSubcategoryOfferLabelMapping } from 'libs/subcategories/mappings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

type ArtistPlaylistProps = {
  offer: OfferResponseV2
  artistName: string
  items: AlgoliaOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({
  offer,
  artistName,
  items,
}) => {
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
        offer,
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
            undefined,
            undefined,
            getIfPricesShouldBeFix(item.offer.subcategoryId)
          ),
      })}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      keyExtractor={keyExtractor}
    />
  ) : null
}
