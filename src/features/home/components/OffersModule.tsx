import { Hit } from '@algolia/client-search'
import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { AlgoliaParametersFields, DisplayParametersFields, Layout } from 'features/home/contentful'
import { AlgoliaHit } from 'libs/algolia'
import { logAllTilesSeen } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { ColorsEnum, Spacer } from 'ui/theme'

import { Cover } from '../atoms/Cover'

type OffersModuleProps = {
  algolia: AlgoliaParametersFields
  display: DisplayParametersFields
  position: ReturnType<typeof useGeolocation>
  hits: Hit<AlgoliaHit>[]
  nbHits: number
  cover: string | null
  index: number
}

const renderHeaderCover = (cover: string | null, layout: Layout) =>
  cover ? (
    <Row>
      {/* Margin: 24px */}
      <Spacer.Row numberOfSpaces={6} />
      <Cover layout={layout} uri={cover} />
      {/* Gutter: 16px */}
      <Spacer.Row numberOfSpaces={4} />
    </Row>
  ) : (
    <Spacer.Row numberOfSpaces={6} />
  )

const renderSeeMore = (showSeeMore: boolean, layout: Layout) =>
  showSeeMore ? (
    <Row>
      {/* Gutter: 16px */}
      <Spacer.Row numberOfSpaces={4} />
      <SeeMore layout={layout} />
      {/* Margin: 24px */}
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  ) : (
    <Spacer.Row numberOfSpaces={6} />
  )

export const OffersModule = (props: OffersModuleProps) => {
  const { hits, nbHits, display, algolia: parameters, position, index } = props
  const [hasSeenAllTiles, setHasSeenAllTiles] = useState<boolean>(false)

  const renderItem = useCallback(
    ({ item }: { item: Hit<AlgoliaHit> }) => (
      <OfferTile
        key={item.objectID}
        category={parseCategory(item.offer.category, item.offer.label)}
        offerId={item.offer.id}
        distance={formatDistance(item._geoloc, position)}
        name={item.offer.name}
        date={formatDates(item.offer.dates)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayPrice(item.offer.prices)}
        layout={display.layout}
      />
    ),
    [display.layout, position]
  )

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment></React.Fragment>

  const showSeeMore =
    hits.length < nbHits &&
    !(parameters.tags || parameters.beginningDatetime || parameters.endingDatetime)

  const checkIfAllTilesHaveBeenSeen = () => {
    if (!hasSeenAllTiles) {
      setHasSeenAllTiles(true)
      logAllTilesSeen(display.title, hits.length)
    }
  }

  return (
    <React.Fragment>
      <ModuleTitle
        title={display.title}
        color={index === 0 ? ColorsEnum.WHITE : ColorsEnum.BLACK}
      />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        horizontal
        data={hits}
        renderItem={renderItem}
        keyExtractor={(item) => item.objectID}
        ListHeaderComponent={renderHeaderCover(props.cover, display.layout)}
        ItemSeparatorComponent={() => <Spacer.Row numberOfSpaces={4} />}
        ListFooterComponent={renderSeeMore(showSeeMore, display.layout)}
        showsHorizontalScrollIndicator={false}
        onEndReached={checkIfAllTilesHaveBeenSeen}
        onEndReachedThreshold={showSeeMore ? 0.6 : 0.1} // We remove the margin
      />
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
