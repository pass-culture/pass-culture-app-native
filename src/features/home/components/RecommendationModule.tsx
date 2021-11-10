import React, { useCallback } from 'react'
import { LayoutChangeEvent } from 'react-native'

import { HomeOfferTile, ModuleTitle } from 'features/home/atoms'
import { DisplayParametersFields } from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { CustomListRenderItem, Playlist } from 'ui/components/Playlist'
import { ColorsEnum, Spacer } from 'ui/theme'

type RecommendationModuleProps = {
  display: DisplayParametersFields
  isBeneficiary?: boolean
  position: GeoCoordinates | null
  hits: SearchHit[]
  index: number
  setRecommendationY: (y: number) => void
}

const keyExtractor = (item: SearchHit) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { display, isBeneficiary, position, index, setRecommendationY, hits } = props
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const moduleName = display.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const onLayout = (event: LayoutChangeEvent) => setRecommendationY(event.nativeEvent.layout.y)

  const renderItem: CustomListRenderItem<SearchHit> = useCallback(
    ({ item, width, height }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <HomeOfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          distance={formatDistance(item._geoloc, position)}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          isBeneficiary={isBeneficiary}
          moduleName={moduleName}
          width={width}
          height={height}
        />
      )
    },
    [position, isBeneficiary]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(display.layout)

  return (
    <React.Fragment>
      <ModuleTitle
        title={display.title}
        color={index === 0 ? ColorsEnum.WHITE : ColorsEnum.BLACK}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Playlist
        testID="recommendationModuleList"
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        scrollButtonOffsetY={itemHeight / 2}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={logHasSeenAllTilesOnce}
      />
      <Spacer.Column testID="recommendationModuleTracker" numberOfSpaces={0} onLayout={onLayout} />
    </React.Fragment>
  )
}
