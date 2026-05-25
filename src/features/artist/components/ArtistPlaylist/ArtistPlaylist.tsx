import { useIsFocused } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useSubcategoryOfferLabelMapping } from 'libs/subcategories/mappings'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { AB_TESTS } from 'shared/useABSegment/abTests'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { PassPlaylist } from 'ui/components/PassPlaylist'

const analyticsFrom = 'artist'
const playlistTitle = 'Toutes ses offres disponibles'

type ArtistPlaylistProps = {
  artist: ArtistResponse
  items: AlgoliaOfferWithArtistAndEan[]
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    artistId: string,
    playlistIndex?: number
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
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useSubcategoryOfferLabelMapping()
  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('three-items')
  const isFocused = useIsFocused()
  const proAdvicesSegment = useABSegment(AB_TESTS.PRO_REVIEWS_ON_OFFER)
  const enableProAdvicesTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_PLAYLIST)

  const handleArtistOffersViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      if (!isFocused) return
      onViewableItemsChanged(items, 'all_offers', 'offer', artist.id, 0)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.ArtistOffers,
      module: {
        title: playlistTitle,
        offers: { hits: items },
        entryId: 'all_offers',
      },
    },
  }

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'artists',
      moduleName: playlistTitle,
      from: analyticsFrom,
    })
  }

  return items.length > 0 ? (
    <ObservedPlaylist onViewableItemsChanged={handleArtistOffersViewableItemsChanged}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PassPlaylist
          playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
          title={playlistTitle}
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
  ) : null
}
