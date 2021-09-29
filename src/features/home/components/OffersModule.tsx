import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { SearchParametersFields, DisplayParametersFields } from 'features/home/contentful'
import { useLayoutHits } from 'features/home/hooks/useLayoutHits'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavigateConfig } from 'features/navigation/TabBar/helpers'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics, isCloseToEndHorizontal } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { SearchHit, useParseSearchParameters } from 'libs/search'
import { ColorsEnum, LENGTH_L, LENGTH_M, RATIO_HOME_IMAGE, Spacer } from 'ui/theme'

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
  const parseSearchParameters = useParseSearchParameters()

  const layoutHits = useLayoutHits(hits, display.layout)
  const moduleName = display.title || parameters.title
  const logHasSeenAllTiles = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const renderItem: ListRenderItem<SearchHit> = useCallback(
    ({ item }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <OfferTile
          category={parseCategory(item.offer.category)}
          categoryName={item.offer.category}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
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
    // When we navigate to the search page, we want to show 20 results per page,
    // not what is configured in contentful
    const params = { ...parseSearchParameters(parameters), hitsPerPage: 20 }
    const tabNavigateConfig = getTabNavigateConfig('Search', params)
    navigate(tabNavigateConfig.screen, tabNavigateConfig.params)
  }, [])

  const ListHeaderComponent = useCallback(() => {
    if (!props.cover) return <HorizontalMargin />
    return (
      <Row>
        <HorizontalMargin />
        <Cover layout={display.layout} uri={props.cover} />
        <ItemSeparatorComponent />
      </Row>
    )
  }, [props.cover])

  const ListFooterComponent = useCallback(() => {
    if (!showSeeMore) return <HorizontalMargin />
    return (
      <Row>
        <ItemSeparatorComponent />
        <SeeMore
          containerHeight={display.layout === 'two-items' ? LENGTH_M : LENGTH_L}
          onPress={onPressSeeMore}
        />
        <HorizontalMargin />
      </Row>
    )
  }, [showSeeMore, display.layout])

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment />

  return (
    <React.Fragment>
      <ModuleTitle
        title={display.title}
        color={index === 0 ? ColorsEnum.WHITE : ColorsEnum.BLACK}
      />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        testID="offersModuleList"
        data={layoutHits}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        onScroll={checkIfAllTilesHaveBeenSeen}
        horizontal={true}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
const ItemSeparatorComponent = () => <Spacer.Row numberOfSpaces={4} />
const HorizontalMargin = () => <Spacer.Row numberOfSpaces={6} />
