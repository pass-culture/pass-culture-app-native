import { Hit } from '@algolia/client-search'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { AlgoliaParametersFields, DisplayParametersFields } from 'features/home/contentful'
import { AlgoliaHit } from 'libs/algolia'
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

export const OffersModule = (props: OffersModuleProps) => {
  const { hits, nbHits, display, algolia: parameters, position, index } = props

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

  const renderHeaderCover = () =>
    props.cover ? (
      <Row>
        <Spacer.Row numberOfSpaces={6} />
        <Cover layout={display.layout} uri={props.cover} />
        <Spacer.Row numberOfSpaces={6} />
      </Row>
    ) : (
      <Spacer.Row numberOfSpaces={6} />
    )

  return (
    <Container>
      <Spacer.Column numberOfSpaces={6} />
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
        ListHeaderComponent={renderHeaderCover}
        ItemSeparatorComponent={() => <Spacer.Row numberOfSpaces={4} />}
        ListFooterComponent={
          showSeeMore ? <SeeMore layout={display.layout} /> : <Spacer.Row numberOfSpaces={6} />
        }
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
const Row = styled.View({ flexDirection: 'row' })
