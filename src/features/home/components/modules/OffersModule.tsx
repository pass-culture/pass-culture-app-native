import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import {
  ModuleData,
  OffersModule as OffersModuleType,
  RecommendedOffersModule,
} from 'features/home/types'
import { getSearchNavConfig } from 'features/navigation/SearchStackNavigator/getSearchNavConfig'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { ContentTypes } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLocation } from 'libs/location'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, ItemDimensions, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'

export type OffersModuleProps = {
  offersModuleParameters: OffersModuleType['offersModuleParameters']
  displayParameters: OffersModuleType['displayParameters']
  moduleId: string
  index: number
  homeEntryId: string | undefined
  data: ModuleData | undefined
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
}

const keyExtractor = (item: Offer) => item.objectID

export const OffersModule = (props: OffersModuleProps) => {
  const {
    displayParameters,
    offersModuleParameters,
    index,
    moduleId,
    homeEntryId,
    data,
    recommendationParameters,
    onViewableItemsChanged,
  } = props
  const adaptedPlaylistParameters = useAdaptOffersPlaylistParameters()
  const { user } = useAuthContext()
  const { userLocation } = useLocation()
  const isInView = useRef(false)

  const { offers: recommandationOffers, recommendationApiParams } = useHomeRecommendedOffers(
    userLocation,
    moduleId,
    recommendationParameters,
    user?.id
  )

  const { playlistItems, nbPlaylistResults } = data ?? {
    playlistItems: [],
    nbPlaylistResults: 0,
  }

  const [parameters = { title: '', hitsPerPage: 0 }] = offersModuleParameters
  // When we navigate to the search page, we want to show 20 results per page,
  // not what is configured in contentful

  const { offerParams, locationParams } = adaptedPlaylistParameters(parameters)
  const searchParams = {
    ...offerParams,
    locationParams,
    hitsPerPage: 20,
  }
  const searchTabConfig = getSearchNavConfig('SearchResults', searchParams)

  const moduleName = displayParameters.title ?? parameters?.title

  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({
      moduleName,
      numberOfTiles: playlistItems.length,
      apiRecoParams: props.recommendationParameters ? recommendationApiParams : undefined,
    })
  )

  const showSeeMore =
    nbPlaylistResults &&
    playlistItems.length < nbPlaylistResults &&
    !(parameters?.tags ?? parameters?.beginningDatetime ?? parameters?.endingDatetime)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPressSeeMore = showSeeMore
    ? () => {
        analytics.logClickSeeMore({ moduleName, moduleId })
      }
    : undefined

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

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }: ItemDimensions) => {
      return showSeeMore ? (
        <SeeMore
          navigateTo={{ ...searchTabConfig, withPush: true }}
          width={width}
          height={height}
          onPress={onPressSeeMore as () => void}
        />
      ) : null
    },
    [onPressSeeMore, showSeeMore, searchTabConfig]
  )

  const hybridPlaylistItems = useMemo(
    () => [...playlistItems, ...recommandationOffers],
    [recommandationOffers, playlistItems]
  )

  const hasRecommendationParameters = props.recommendationParameters
    ? Object.values(props.recommendationParameters).some((value) => value !== undefined)
    : false

  const offersToDisplay = hasRecommendationParameters ? hybridPlaylistItems : playlistItems

  const shouldModuleBeDisplayed =
    offersToDisplay.length > 0 && offersToDisplay.length >= displayParameters.minOffers

  const hybridModuleOffsetIndex = playlistItems.length === 0 ? 1 : playlistItems.length

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: props.recommendationParameters ? ContentTypes.HYBRID : ContentTypes.ALGOLIA,
        index,
        homeEntryId,
        hybridModuleOffsetIndex: props.recommendationParameters
          ? hybridModuleOffsetIndex
          : undefined,
        call_id: props.recommendationParameters ? recommendationApiParams?.call_id : undefined,
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
    props.recommendationParameters,
    recommendationApiParams?.call_id,
    shouldModuleBeDisplayed,
  ])

  const listRef = useRef<FlatList>(null)
  const lastViewableItems = useRef<ViewToken[]>([])

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (isInView.current) {
        onViewableItemsChanged?.(viewableItems.map(({ key, index }) => ({ key, index })))
        lastViewableItems.current = viewableItems
      }
    },
    // We cannot change onViewableItemsChanged on the fly
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleIntersectionObserverChange = useCallback(
    (value: boolean) => {
      isInView.current = value
      if (value) {
        if (lastViewableItems.current?.length) {
          handleViewableItemsChanged({
            viewableItems: lastViewableItems.current,
          })
        } else {
          listRef.current?.recordInteraction()
        }
      }
    },
    [handleViewableItemsChanged]
  )

  useFocusEffect(
    useCallback(() => {
      if (lastViewableItems.current?.length) {
        handleViewableItemsChanged({
          viewableItems: lastViewableItems.current,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  if (!shouldModuleBeDisplayed) return null

  return (
    <IntersectionObserver onChange={handleIntersectionObserverChange}>
      <PassPlaylist
        title={displayParameters.title}
        subtitle={displayParameters.subtitle}
        data={offersToDisplay}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        onPressSeeMore={onPressSeeMore}
        titleSeeMoreLink={{ ...searchTabConfig }}
        renderItem={renderItem}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
        onEndReached={logHasSeenAllTilesOnce}
        playlistRef={listRef}
        FlatListComponent={FlatList}
        onViewableItemsChanged={handleViewableItemsChanged}
      />
    </IntersectionObserver>
  )
}
