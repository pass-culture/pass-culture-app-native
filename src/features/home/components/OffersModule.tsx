import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { GeoCoordinates } from 'react-native-geolocation-service'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { AlgoliaParametersFields, DisplayParametersFields } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { AlgoliaHit, parseAlgoliaParameters } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { isCloseToEndHorizontal } from 'libs/analytics.utils'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { ColorsEnum, LENGTH_M, RATIO_ALGOLIA, Spacer } from 'ui/theme'

import { Cover } from '../atoms/Cover'

type OffersModuleProps = {
  algolia: AlgoliaParametersFields
  display: DisplayParametersFields
  isBeneficiary?: boolean
  position: GeoCoordinates | null
  hits: AlgoliaHit[]
  nbHits: number
  cover: string | null
  index: number
}

export const OffersModule = (props: OffersModuleProps) => {
  const { nbHits, display, algolia: parameters, position, index, isBeneficiary } = props
  const { navigate } = useNavigation<UseNavigationType>()

  const moduleName = display.title || parameters.title
  const hits = props.hits
    .map((hit) => {
      const offerId = dehumanizeId(hit.offer.id)
      return offerId ? { ...hit, offerId } : undefined
    })
    .filter(Boolean) as Array<AlgoliaHit & { offerId: number }>

  const logHasSeenAllTiles = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const renderItem = useCallback(
    (hit: AlgoliaHit & { offerId: number }) => {
      const timestampsInMillis = hit.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <Row key={hit.objectID}>
          <OfferTile
            category={parseCategory(hit.offer.category)}
            categoryName={hit.offer.category}
            offerId={hit.offerId}
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

  const showSeeMore =
    hits.length < nbHits &&
    !(parameters.tags || parameters.beginningDatetime || parameters.endingDatetime)

  const imageHeight = display.layout === 'two-items' ? LENGTH_M : LENGTH_M
  const imageWidth = imageHeight * RATIO_ALGOLIA
  const padding = showSeeMore ? imageWidth : 0

  const checkIfAllTilesHaveBeenSeen = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToEndHorizontal({ ...nativeEvent, padding })) {
        logHasSeenAllTiles()
      }
    },
    []
  )

  const onPressSeeMore = useCallback(() => {
    analytics.logClickSeeMore(moduleName)
    navigate('Search', {
      parameters: parseAlgoliaParameters({ geolocation: position, parameters }),
    })
  }, [position])

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment />

  return (
    <React.Fragment>
      <ModuleTitle
        title={display.title}
        color={index === 0 ? ColorsEnum.WHITE : ColorsEnum.BLACK}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ScrollView
        horizontal={true}
        testID="offersModuleList"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        onScroll={checkIfAllTilesHaveBeenSeen}>
        <Spacer.Row numberOfSpaces={6} />
        {props.cover && (
          <Row>
            <Cover layout={display.layout} uri={props.cover} />
            <Spacer.Row numberOfSpaces={4} />
          </Row>
        )}
        {hits.map(renderItem)}
        {showSeeMore && <SeeMore layout={display.layout} onPress={onPressSeeMore} />}
        <Spacer.Row numberOfSpaces={6} />
      </ScrollView>
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
