import React, { useCallback, useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { HomeOfferTile } from 'features/home/components/HomeOfferTile'
import { ModuleData, OffersModule as OffersModuleType } from 'features/home/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { ContentTypes } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLocation } from 'libs/location/LocationWrapper'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
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
}

const keyExtractor = (item: Offer) => item.objectID

export const OffersModule = (props: OffersModuleProps) => {
  const { displayParameters, offersModuleParameters, index, moduleId, homeEntryId, data } = props
  const { userLocation } = useLocation()
  const adaptedPlaylistParameters = useAdaptOffersPlaylistParameters()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { user } = useAuthContext()

  const { playlistItems, nbPlaylistResults } = data ?? {
    playlistItems: [],
    nbPlaylistResults: 0,
  }

  const [parameters] = offersModuleParameters
  // When we navigate to the search page, we want to show 20 results per page,
  // not what is configured in contentful
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const { offerParams, locationParams } = adaptedPlaylistParameters(parameters)
  const searchParams = {
    ...offerParams,
    locationParams,
    hitsPerPage: 20,
    view: SearchView.Results,
  }
  const searchTabConfig = getTabNavConfig('Search', searchParams)
  const moduleName = displayParameters.title ?? parameters.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({ moduleName, numberOfTiles: playlistItems.length })
  )

  const showSeeMore =
    nbPlaylistResults &&
    playlistItems.length < nbPlaylistResults &&
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
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          distance={formatDistance(item._geoloc, userLocation)}
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
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userLocation, user?.isBeneficiary, labelMapping, mapping]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

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

  const shouldModuleBeDisplayed =
    playlistItems.length > 0 && playlistItems.length >= displayParameters.minOffers

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.ALGOLIA, index, homeEntryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  return (
    <PassPlaylist
      testID="offersModuleList"
      title={displayParameters.title}
      subtitle={displayParameters.subtitle}
      data={playlistItems}
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
