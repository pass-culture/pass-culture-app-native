import React, { useCallback } from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle } from 'features/home/atoms'
import { DisplayParametersFields } from 'features/home/contentful'
import { useLayoutHits } from 'features/home/hooks/useLayoutHits'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics, isCloseToEndHorizontal } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { ColorsEnum, Spacer } from 'ui/theme'

type RecommendationModuleProps = {
  display: DisplayParametersFields
  isBeneficiary?: boolean
  position: GeoCoordinates | null
  hits: SearchHit[]
  index: number
  setRecommendationY: (y: number) => void
}

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { display, isBeneficiary, position, index, setRecommendationY, hits } = props
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const layoutHits = useLayoutHits(hits, display.layout)

  const moduleName = display.title
  const logHasSeenAllTiles = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const onLayout = (event: LayoutChangeEvent) => setRecommendationY(event.nativeEvent.layout.y)

  const renderItem = useCallback(
    (hit: SearchHit) => {
      const timestampsInMillis = hit.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <Row key={hit.objectID}>
          <OfferTile
            categoryLabel={labelMapping[hit.offer.subcategoryId]}
            categoryId={mapping[hit.offer.subcategoryId]}
            subcategoryId={hit.offer.subcategoryId}
            offerId={+hit.objectID}
            distance={formatDistance(hit._geoloc, position)}
            name={hit.offer.name}
            date={formatDates(timestampsInMillis)}
            isDuo={hit.offer.isDuo}
            thumbUrl={hit.offer.thumbUrl}
            price={getDisplayPrice(hit.offer.prices)}
            layout={display.layout}
            isBeneficiary={isBeneficiary}
            moduleName={moduleName}
          />
          <Spacer.Row numberOfSpaces={4} />
        </Row>
      )
    },
    [position, isBeneficiary]
  )

  const checkIfAllTilesHaveBeenSeen = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToEndHorizontal({ ...nativeEvent, padding: 0 })) {
        logHasSeenAllTiles()
      }
    },
    []
  )

  return (
    <React.Fragment>
      <ModuleTitle
        title={display.title}
        color={index === 0 ? ColorsEnum.WHITE : ColorsEnum.BLACK}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ScrollView
        horizontal={true}
        testID="recommendationModuleList"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        onScroll={checkIfAllTilesHaveBeenSeen}>
        <Spacer.Row numberOfSpaces={6} />
        {layoutHits.map(renderItem)}
        <Spacer.Row numberOfSpaces={6} />
      </ScrollView>
      <Spacer.Column testID="recommendationModuleTracker" numberOfSpaces={0} onLayout={onLayout} />
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
