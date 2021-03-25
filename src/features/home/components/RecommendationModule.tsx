import React, { useCallback } from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { GeoCoordinates } from 'react-native-geolocation-service'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle } from 'features/home/atoms'
import { DisplayParametersFields } from 'features/home/contentful'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { AlgoliaHit } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { isCloseToEndHorizontal } from 'libs/analytics.utils'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { ColorsEnum, Spacer } from 'ui/theme'

type RecommendationModuleProps = {
  display: DisplayParametersFields
  isBeneficiary?: boolean
  position: GeoCoordinates | null
  hits: AlgoliaHit[]
  index: number
  setRecommendationY: (y: number) => void
}

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { display, isBeneficiary, position, index, setRecommendationY, hits } = props

  const moduleName = display.title
  const logHasSeenAllTiles = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const onLayout = (event: LayoutChangeEvent) => setRecommendationY(event.nativeEvent.layout.y)

  const renderItem = useCallback(
    (hit: AlgoliaHit) => {
      const timestampsInMillis = hit.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <Row key={hit.objectID}>
          <OfferTile
            category={parseCategory(hit.offer.category)}
            categoryName={hit.offer.category}
            offerId={+hit.objectID}
            description={hit.offer.description || ''}
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
        {hits.map(renderItem)}
        <Spacer.Row numberOfSpaces={6} />
      </ScrollView>
      <Spacer.Column testID="recommendationModuleTracker" numberOfSpaces={0} onLayout={onLayout} />
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
