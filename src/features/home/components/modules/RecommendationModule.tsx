import React, { useCallback, useEffect } from 'react'
import { useTheme } from 'styled-components'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import { HomepageModuleType, RecommendedOffersModule } from 'features/home/types'
import { getSearchPropConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchPropConfig'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useUserLocation } from 'libs/locationV2/location.store'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

type RecommendationModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  index: number
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
  homeEntryId: string | undefined
}

const keyExtractor = (item: Offer) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { displayParameters, index, recommendationParameters, moduleId, homeEntryId } = props
  const position = useUserLocation()
  const { user: profile } = useAuthContext()
  const { designSystem } = useTheme()
  const { offers, recommendationApiParams } = useHomeRecommendedOffers(
    position,
    moduleId,
    recommendationParameters,
    profile?.id
  )
  const nbOffers = offers.length
  const shouldModuleBeDisplayed = nbOffers > displayParameters.minOffers

  const moduleName = displayParameters.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({ moduleName, numberOfTiles: nbOffers, ...recommendationApiParams })
  )

  const searchParams = { hitsPerPage: 20 }
  const searchTabConfig = getSearchPropConfig('SearchResults', searchParams)
  const onBeforeNavigate = () =>
    analytics.logClickSeeAll({ type: 'offers', moduleName, moduleId, from: 'home' })

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      void analytics.logModuleDisplayedOnHomepage({
        call_id: recommendationApiParams?.callId,
        moduleId,
        moduleType: ContentTypes.RECOMMENDATION,
        index,
        homeEntryId,
        offers: offers.map((offer) => offer.objectID),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => (
      <OfferTileWrapper
        item={item}
        width={width}
        height={height}
        moduleId={moduleId}
        moduleName={moduleName}
        homeEntryId={homeEntryId}
        apiRecoParams={recommendationApiParams}
        analyticsFrom="home"
      />
    ),
    [moduleId, moduleName, recommendationApiParams, homeEntryId]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

  if (!shouldModuleBeDisplayed) return null

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.RecommendationOffers,
      module: {
        id: moduleId,
        type: HomepageModuleType.RecommendedOffersModule,
        displayParameters,
        recommendationParameters,
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
          callId: recommendationApiParams?.callId,
        })
      }}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PassPlaylist
          testID="recommendationModuleList"
          title={displayParameters.title}
          subtitle={displayParameters.subtitle}
          data={offers}
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={logHasSeenAllTilesOnce}
          playlistRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
          withMargin
          contentContainerStyle={{ paddingHorizontal: designSystem.size.spacing.xl }}
          seeAllButton={{
            onBeforeNavigate,
            navigateToVerticalPlaylist,
            navigateToSearchPlaylist: searchTabConfig,
          }}
        />
      )}
    </ObservedPlaylist>
  )
}
