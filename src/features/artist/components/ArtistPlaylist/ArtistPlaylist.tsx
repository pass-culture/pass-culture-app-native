import React, { FunctionComponent, useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import {
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useSubcategoryOfferLabelMapping } from 'libs/subcategories/mappings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

type ArtistPlaylistProps = {
  artist: ArtistResponse
  items: AlgoliaOfferWithArtistAndEan[]
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    artistId: string
  ) => void
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({
  artist,
  items,
  onViewableItemsChanged,
}) => {
  const theme = useTheme()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useSubcategoryOfferLabelMapping()
  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('three-items')

  const handleArtistOffersViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      onViewableItemsChanged(items, 'all_offers', 'offer', artist.id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return items.length > 0 ? (
    <ObservedPlaylist onViewableItemsChanged={handleArtistOffersViewableItemsChanged}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PassPlaylist
          playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
          title="Toutes ses offres disponibles"
          data={items}
          FlatListComponent={FlatList}
          renderItem={OfferPlaylistItem({
            categoryMapping,
            labelMapping,
            currency,
            euroToPacificFrancRate,
            analyticsFrom: 'artist',
            artistName: artist.name,
            theme,
            hasSmallLayout: true,
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
          playlistRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
      )}
    </ObservedPlaylist>
  ) : null
}
