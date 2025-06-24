import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'

import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useLocation } from 'libs/location'
import {
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useSubcategoryOfferLabelMapping } from 'libs/subcategories/mappings'
import { useArtistOffersPlaylistQuery } from 'queries/offer/useOffersByArtistQuery'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

type ArtistPlaylistProps = {
  artistId: string
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({ artistId }) => {
  const theme = useTheme()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useSubcategoryOfferLabelMapping()
  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('three-items')
  const { userLocation } = useLocation()
  const transformHits = useTransformOfferHits()
  const { data: artist } = useArtistQuery(artistId)
  const { data: artistTopOffers } = useArtistOffersPlaylistQuery({
    artistId,
    userLocation,
    transformHits,
  })

  return artistTopOffers && artistTopOffers.length > 0 ? (
    <PassPlaylist
      playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
      title="Toutes ses offres disponibles"
      data={artistTopOffers}
      FlatListComponent={FlatList}
      renderItem={OfferPlaylistItem({
        categoryMapping,
        labelMapping,
        currency,
        euroToPacificFrancRate,
        analyticsFrom: 'artist',
        artistName: artist?.name,
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
    />
  ) : null
}
