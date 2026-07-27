import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'

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
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { PassPlaylist } from 'ui/components/PassPlaylist'

const MAX_TOP_OFFERS = 4
const playlistTitle = 'Ses oeuvres populaires'

type Props = {
  artistName: string
  items: AlgoliaOfferWithArtistAndEan[]
  proAdvicesSegment?: string
  enableProAdvicesTag?: boolean
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export const ArtistTopOffers: FunctionComponent<Props> = ({
  artistName,
  items,
  proAdvicesSegment,
  enableProAdvicesTag,
}) => {
  const theme = useTheme()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useSubcategoryOfferLabelMapping()
  const enableSceneClubTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SCENE_CLUB)
  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('three-items')
  const topOffers = items.slice(0, MAX_TOP_OFFERS)

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.ArtistOffers,
      module: {
        title: playlistTitle,
        offers: { hits: topOffers },
        entryId: 'top_offers',
      },
    },
  }

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'artists',
      moduleName: playlistTitle,
      from: 'artist',
    })
  }

  return topOffers.length > 0 ? (
    <PassPlaylist
      playlistType={PlaylistType.ARTIST_TOP_OFFERS}
      title={playlistTitle}
      data={topOffers}
      FlatListComponent={FlatList}
      renderItem={OfferPlaylistItem({
        categoryMapping,
        labelMapping,
        currency,
        euroToPacificFrancRate,
        analyticsFrom: 'artist',
        artistName,
        originDetails: 'artistRecommendation',
        theme,
        hasSmallLayout: true,
        priceDisplay: (item: Offer) =>
          getDisplayedPrice(item.offer.prices, currency, euroToPacificFrancRate),
        proAdvicesSegment,
        enableProAdvicesTag,
        enableSceneClubTag,
      })}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      keyExtractor={keyExtractor}
      seeAllButton={{ onBeforeNavigate, navigateToVerticalPlaylist }}
      noMarginBottom
    />
  ) : null
}
