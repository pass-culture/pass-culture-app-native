import { useIsFocused } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { OfferPagePlaylist, OfferResponse, RecommendationApiParams } from 'api/gen'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { OfferPlaylistListProps } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useAlgoliaSimilarOffersQuery } from 'queries/offer/useAlgoliaSimilarOffersQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

type OfferPlaylistSectionProps = {
  playlist: OfferPagePlaylist
  playlistIndex: number
  offer: OfferResponse
  fromOfferId?: number
  seeAllButton: OfferPlaylistListProps['seeAllButton']
}

export const OfferPlaylistSection: FunctionComponent<OfferPlaylistSectionProps> = ({
  playlist,
  playlistIndex,
  offer,
  fromOfferId,
  seeAllButton,
}) => {
  const theme = useTheme()
  const isFocused = useIsFocused()
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const enableSceneClubTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SCENE_CLUB)
  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  const offers = useAlgoliaSimilarOffersQuery(playlist.results, true)

  const playlistType = playlist.analyticsPlaylistType
  const apiRecoParams = playlist.params

  const logPlaylistVerticalScroll = useFunctionOnce(() => {
    void analytics.logPlaylistVerticalScroll({
      ...apiRecoParams,
      fromOfferId,
      offerId: offer.id,
      playlistType,
      nbResults: offers?.length ?? 0,
    })
  })

  const handlePlaylistDisplay = useLogScrollHandler(logPlaylistVerticalScroll)

  const trackingOnHorizontalScroll = (type: string, params?: RecommendationApiParams) => {
    void analytics.logPlaylistHorizontalScroll(fromOfferId, type, params)
  }

  if (!offers?.length) {
    return null
  }

  const navigateToVerticalPlaylist = seeAllButton.navigateToVerticalPlaylist(playlistType)
  const onBeforeNavigate = () => seeAllButton.onBeforeNavigate(playlistType, playlist.title)

  return (
    <ObservedPlaylist
      key={playlist.analyticsPlaylistType}
      onItemViewed={({ index: itemIndex, item }) => {
        if (isFocused) {
          void logViewItem({
            origin: 'offer',
            playlistIndex,
            index: itemIndex,
            type: 'offer',
            id: item.objectID,
            playlistId: playlistType,
            originId: offer.id.toString(),
            callId: apiRecoParams?.callId ?? undefined,
          })
        }
      }}
      onIntersectionChange={handlePlaylistDisplay}>
      {({ listRef, handleViewableItemsChanged }) => (
        <StyledPassPlaylist
          data={offers}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          renderItem={OfferPlaylistItem({
            offer,
            labelMapping,
            categoryMapping,
            currency,
            euroToPacificFrancRate,
            navigationMethod: 'push',
            apiRecoParams,
            priceDisplay: (item: Offer) =>
              getDisplayedPrice(item.offer.prices, currency, euroToPacificFrancRate),
            theme,
            enableSceneClubTag,
          })}
          title={playlist.title}
          playlistType={playlistType}
          onEndReached={() => trackingOnHorizontalScroll(playlistType, apiRecoParams)}
          playlistRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
          FlatListComponent={FlatList}
          keyExtractor={keyExtractor}
          seeAllButton={{
            navigateToVerticalPlaylist,
            onBeforeNavigate,
            hidePlaylistSeeAll: seeAllButton.hidePlaylistSeeAll,
            hideSearchSeeAll: seeAllButton.hideSearchSeeAll,
          }}
        />
      )}
    </ObservedPlaylist>
  )
}

const StyledPassPlaylist = styled(PassPlaylist)({
  paddingBottom: 0,
})
