import React, { useCallback, useEffect, useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import { HomeOfferTile } from 'features/home/components/HomeOfferTile'
import {
  ModuleData,
  OffersModule as OffersModuleType,
  RecommendedOffersModule,
} from 'features/home/types'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLocation } from 'libs/location'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
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
}

const keyExtractor = (item: Offer) => item.objectID

export const OffersModule = (props: OffersModuleProps) => {
  const isNewOfferTileDisplayed = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)
  const {
    displayParameters,
    offersModuleParameters,
    index,
    moduleId,
    homeEntryId,
    data,
    recommendationParameters,
  } = props
  const adaptedPlaylistParameters = useAdaptOffersPlaylistParameters()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { user } = useAuthContext()
  const { userLocation } = useLocation()

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

  const [parameters] = offersModuleParameters
  // When we navigate to the search page, we want to show 20 results per page,
  // not what is configured in contentful
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // @ts-expect-error: because of noUncheckedIndexedAccess
  const { offerParams, locationParams } = adaptedPlaylistParameters(parameters)
  const searchParams = {
    ...offerParams,
    locationParams,
    hitsPerPage: 20,
  }
  const searchTabConfig = getSearchStackConfig('SearchResults', searchParams)
  // @ts-expect-error: because of noUncheckedIndexedAccess
  const moduleName = displayParameters.title ?? parameters.title
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
    // @ts-expect-error: because of noUncheckedIndexedAccess
    !(parameters.tags ?? parameters.beginningDatetime ?? parameters.endingDatetime)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPressSeeMore = showSeeMore
    ? () => {
        analytics.logClickSeeMore({ moduleName, moduleId })
      }
    : undefined

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <HomeOfferTile
          offerLocation={item._geoloc}
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          isBeneficiary={user?.isBeneficiary}
          moduleName={moduleName}
          moduleId={moduleId}
          homeEntryId={homeEntryId}
          width={width}
          height={height}
          variant={isNewOfferTileDisplayed ? 'new' : 'default'}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.isBeneficiary, labelMapping, mapping]
  )

  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout(
    displayParameters.layout,
    homeEntryId
  )

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }: ItemDimensions) => {
      return showSeeMore ? (
        <SeeMore
          navigateTo={{ screen: searchTabConfig[0], params: searchTabConfig[1], withPush: true }}
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

  const offersToDisplay = useMemo(() => {
    return hasRecommendationParameters ? hybridPlaylistItems : playlistItems
  }, [hybridPlaylistItems, playlistItems, hasRecommendationParameters])

  const shouldModuleBeDisplayed =
    offersToDisplay.length > 0 && offersToDisplay.length >= displayParameters.minOffers

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        call_id: props.recommendationParameters ? recommendationApiParams?.call_id : undefined,
        moduleId,
        moduleType: ContentTypes.ALGOLIA,
        index,
        homeEntryId,
        offers: (playlistItems as Offer[]).map((item) => item.objectID),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  return (
    <PassPlaylist
      testID="offersModuleList"
      title={displayParameters.title}
      subtitle={displayParameters.subtitle}
      data={offersToDisplay}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
      onPressSeeMore={onPressSeeMore}
      titleSeeMoreLink={{ screen: searchTabConfig[0], params: searchTabConfig[1] }}
      renderItem={renderItem}
      renderFooter={renderFooter}
      keyExtractor={keyExtractor}
      onEndReached={logHasSeenAllTilesOnce}
    />
  )
}
