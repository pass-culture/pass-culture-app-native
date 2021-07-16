import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { GeoCoordinates } from 'react-native-geolocation-service'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { SearchParametersFields, DisplayParametersFields } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToEndHorizontal } from 'libs/analytics.utils'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { SearchHit, parseSearchParameters } from 'libs/search'
import { ColorsEnum, LENGTH_M, RATIO_HOME_IMAGE, Spacer } from 'ui/theme'

import { Cover } from '../atoms/Cover'

type OffersModuleProps = {
  search: SearchParametersFields
  display: DisplayParametersFields
  isBeneficiary?: boolean
  position: GeoCoordinates | null
  hits: SearchHit[]
  nbHits: number
  cover: string | null
  index: number
}

const keyExtractor = (item: SearchHit) => item.objectID

export const OffersModule = (props: OffersModuleProps) => {
  const { nbHits, display, search: parameters, position, index, isBeneficiary, hits } = props
  const { navigate } = useNavigation<UseNavigationType>()

  const moduleName = display.title || parameters.title
  const logHasSeenAllTiles = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const renderItem: ListRenderItem<SearchHit> = useCallback(
    ({ item }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <Row key={item.objectID}>
          <OfferTile
            category={parseCategory(item.offer.category)}
            categoryName={item.offer.category}
            offerId={+item.objectID}
            description={item.offer.description || ''}
            distance={formatDistance(item._geoloc, position)}
            name={item.offer.name}
            date={formatDates(timestampsInMillis)}
            isDuo={item.offer.isDuo}
            thumbUrl={item.offer.thumbUrl}
            price={getDisplayPrice(item.offer.prices)}
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
  const imageWidth = imageHeight * RATIO_HOME_IMAGE
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
      parameters: parseSearchParameters({ geolocation: position, parameters }),
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
        {!!props.cover && (
          <Row>
            <Cover layout={display.layout} uri={props.cover} />
            <Spacer.Row numberOfSpaces={4} />
          </Row>
        )}
        <FlatList
          data={hits}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={200}
          horizontal={true}
          keyExtractor={keyExtractor}
        />
        {!!showSeeMore && <SeeMore layout={display.layout} onPress={onPressSeeMore} />}
        <Spacer.Row numberOfSpaces={6} />
      </ScrollView>
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
