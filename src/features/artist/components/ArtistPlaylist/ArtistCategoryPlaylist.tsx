import { useIsFocused } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useSubcategoryOfferLabelMapping } from 'libs/subcategories/mappings'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { PassPlaylist } from 'ui/components/PassPlaylist'

const analyticsFrom = 'artist'

type ArtistCategoryPlaylistProps = {
  artist: ArtistResponse
  entryId: string
  items: AlgoliaOfferWithArtistAndEan[]
  playlistIndex: number
  title: string
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    artistId: string,
    playlistIndex?: number
  ) => void
  proAdvicesSegment?: string
  enableProAdvicesTag?: boolean
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export const ArtistCategoryPlaylist: FunctionComponent<ArtistCategoryPlaylistProps> = ({
  artist,
  entryId,
  items,
  playlistIndex,
  title,
  onViewableItemsChanged,
  proAdvicesSegment,
  enableProAdvicesTag,
}) => {
  const theme = useTheme()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useSubcategoryOfferLabelMapping()
  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('three-items')
  const isFocused = useIsFocused()

  const handleArtistOffersViewableItemsChanged = (items: Pick<ViewToken, 'key' | 'index'>[]) => {
    if (!isFocused) return
    onViewableItemsChanged(items, entryId, 'offer', artist.id, playlistIndex)
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.ArtistOffers,
      module: {
        title,
        offers: { hits: items },
        entryId,
      },
    },
  }

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'artists',
      moduleName: title,
      moduleId: entryId,
      from: analyticsFrom,
    })
  }

  return (
    <ObservedPlaylist onViewableItemsChanged={handleArtistOffersViewableItemsChanged}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PassPlaylist
          playlistType={PlaylistType.ARTIST_CATEGORY_PLAYLIST}
          title={title}
          data={items}
          FlatListComponent={FlatList}
          renderItem={OfferPlaylistItem({
            categoryMapping,
            labelMapping,
            currency,
            euroToPacificFrancRate,
            analyticsFrom,
            artistName: artist.name,
            theme,
            hasSmallLayout: true,
            priceDisplay: (item: Offer) =>
              getDisplayedPrice(item.offer.prices, currency, euroToPacificFrancRate),
            proAdvicesSegment,
            enableProAdvicesTag,
          })}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          keyExtractor={keyExtractor}
          playlistRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
          seeAllButton={{ onBeforeNavigate, navigateToVerticalPlaylist }}
        />
      )}
    </ObservedPlaylist>
  )
}
