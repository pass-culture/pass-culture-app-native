import React, { useCallback, useEffect } from 'react'
import { ViewToken } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import { ObservedPlaylist } from 'features/home/components/parsers/ObservedPlaylist'
import { RecommendedOffersModule } from 'features/home/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLocation } from 'libs/location/LocationWrapper'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

type RecommendationModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  index: number
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
  homeEntryId: string | undefined
  onViewableItemsChanged?: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    callId?: string | null
  ) => void
}

const keyExtractor = (item: Offer) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const {
    displayParameters,
    index,
    recommendationParameters,
    moduleId,
    homeEntryId,
    onViewableItemsChanged,
  } = props
  const { userLocation: position } = useLocation()
  const { user: profile } = useAuthContext()

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

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        call_id: recommendationApiParams?.call_id,
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

  const handleOnViewableItemsChanged = (items: Pick<ViewToken, 'key' | 'index'>[]) => {
    onViewableItemsChanged?.(items, recommendationApiParams?.call_id)
  }

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

  if (!shouldModuleBeDisplayed) return null
  return (
    <ObservedPlaylist onViewableItemsChanged={handleOnViewableItemsChanged}>
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
        />
      )}
    </ObservedPlaylist>
  )
}
