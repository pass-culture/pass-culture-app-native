import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import {
  HomepageModuleType,
  ModuleData,
  OffersModule as OffersModuleType,
  RecommendedOffersModule,
} from 'features/home/types'
import { getSearchPropConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchPropConfig'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { ContentTypes } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useUserLocation } from 'libs/locationV2/location.store'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

const isWeb = Platform.OS === 'web'

export type OffersModuleProps = {
  offersModuleParameters: OffersModuleType['offersModuleParameters']
  displayParameters: OffersModuleType['displayParameters']
  moduleId: string
  index: number
  homeEntryId: string | undefined
  data: ModuleData | undefined
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
}

const keyExtractor = (item: Offer) => item.objectID

export const OffersModule: FC<OffersModuleProps> = ({
  displayParameters,
  offersModuleParameters,
  index,
  moduleId,
  homeEntryId,
  data,
  recommendationParameters,
}) => {
  const adaptedPlaylistParameters = useAdaptOffersPlaylistParameters()
  const { user } = useAuthContext()
  const userLocation = useUserLocation()
  const { designSystem } = useTheme()

  const { offers: recommandationOffers, recommendationApiParams } = useHomeRecommendedOffers(
    userLocation,
    moduleId,
    recommendationParameters,
    user?.id
  )

  const { playlistItems } = data ?? { playlistItems: [] }

  const [parameters = { title: '', hitsPerPage: 0 }] = offersModuleParameters
  // When we navigate to the search page, we want to show 20 results per page,
  // not what is configured in contentful

  const { offerParams, locationParams } = adaptedPlaylistParameters(parameters)
  const searchParams = {
    ...offerParams,
    locationParams,
    hitsPerPage: 20,
  }
  const searchTabConfig = getSearchPropConfig('SearchResults', searchParams)

  const moduleName = displayParameters.title ?? parameters?.title

  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({
      moduleName,
      numberOfTiles: playlistItems.length,
      apiRecoParams: recommendationParameters ? recommendationApiParams : undefined,
    })
  )

  const onBeforeNavigate = () =>
    analytics.logClickSeeAll({ type: 'offers', moduleName, moduleId, from: 'home' })

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
      return (
        <OfferTileWrapper
          item={item}
          moduleName={moduleName}
          moduleId={moduleId}
          homeEntryId={homeEntryId}
          width={width}
          height={height}
          analyticsFrom="home"
          hasSmallLayout={displayParameters.layout === 'three-items'}
        />
      )
    },

    [moduleName, moduleId, homeEntryId, displayParameters.layout]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

  const hybridPlaylistItems = useMemo(
    () => [...playlistItems, ...recommandationOffers],
    [recommandationOffers, playlistItems]
  )

  const hasRecommendationParameters = recommendationParameters
    ? Object.values(recommendationParameters).some((value) => value !== undefined)
    : false

  const offersToDisplay = hasRecommendationParameters ? hybridPlaylistItems : playlistItems

  const shouldModuleBeDisplayed =
    offersToDisplay.length > 0 && offersToDisplay.length >= displayParameters.minOffers

  const hybridModuleOffsetIndex = playlistItems.length === 0 ? 1 : playlistItems.length

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      void analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: recommendationParameters ? ContentTypes.HYBRID : ContentTypes.ALGOLIA,
        index,
        homeEntryId,
        hybridModuleOffsetIndex: recommendationParameters ? hybridModuleOffsetIndex : undefined,
        call_id: recommendationParameters ? recommendationApiParams?.callId : undefined,
        offers: (offersToDisplay as Offer[]).map((item) => item.objectID),
      })
    }
  }, [
    homeEntryId,
    hybridModuleOffsetIndex,
    hybridPlaylistItems,
    index,
    moduleId,
    offersToDisplay,
    playlistItems,
    recommendationParameters,
    recommendationApiParams?.callId,
    shouldModuleBeDisplayed,
  ])

  if (!shouldModuleBeDisplayed) return null

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.ModuleOffers,
      module: {
        id: moduleId,
        type: HomepageModuleType.OffersModule,
        title: moduleName,
        offersModuleParameters,
        displayParameters,
      },
    },
  }
  return (
    <ObservedPlaylist
      onItemViewed={({ index: itemIndex, item }) => {
        if (!homeEntryId) return
        void logViewItem({
          origin: 'home',
          playlistIndex: index,
          index: itemIndex,
          type: 'offer',
          id: item.objectID,
          playlistId: moduleId,
          originId: homeEntryId,
          callId: recommendationParameters ? recommendationApiParams?.callId : undefined,
        })
      }}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PassPlaylist
          title={displayParameters.title}
          subtitle={displayParameters.subtitle}
          data={offersToDisplay}
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={logHasSeenAllTilesOnce}
          playlistRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
          contentContainerStyle={{ paddingHorizontal: designSystem.size.spacing.xl }}
          seeAllButton={{
            onBeforeNavigate,
            navigateToVerticalPlaylist,
            navigateToSearchPlaylist: searchTabConfig,
            hideSearchSeeAll: isWeb,
          }}
        />
      )}
    </ObservedPlaylist>
  )
}
