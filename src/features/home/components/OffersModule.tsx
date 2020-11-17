import { Hit } from '@algolia/client-search'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit, useFetchAlgolia } from 'libs/algolia'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { Spacer } from 'ui/theme'

type OfferWithOptionalCover = Partial<OffersWithCover> &
  Pick<Offers, 'algolia' | 'display' | 'moduleId'> & { position: ReturnType<typeof useGeolocation> }

export const OffersModule = (props: OfferWithOptionalCover) => {
  const { algolia: parameters, display, moduleId } = props

  const { hits, nbHits } = useFetchAlgolia({
    algoliaParameters: parameters,
    cacheKey: `module-${moduleId}`,
  })

  const renderItem = useCallback(
    ({ item }: { item: Hit<AlgoliaHit> }) => (
      <OfferTile
        key={item.objectID}
        category={parseCategory(item.offer.category, item.offer.label)}
        offerId={item.offer.id}
        distance={formatDistance(item._geoloc, props.position)}
        name={item.offer.name}
        date={formatDates(item.offer.dates)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayPrice(item.offer.prices)}
        layout={display.layout}
      />
    ),
    [display.layout, props.position]
  )

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment></React.Fragment>

  const showSeeMore =
    hits.length < nbHits &&
    !(parameters.tags || parameters.beginningDatetime || parameters.endingDatetime)

  return (
    <Container>
      <Spacer.Column numberOfSpaces={6} />
      <ModuleTitle title={display.title} />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        horizontal
        data={hits}
        renderItem={renderItem}
        keyExtractor={(item) => item.objectID}
        ListHeaderComponent={() => <Spacer.Row numberOfSpaces={6} />}
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
