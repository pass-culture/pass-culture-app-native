import { Hit } from '@algolia/client-search'
import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle, SeeMore } from 'features/home/atoms'
import { AlgoliaParametersFields, DisplayParametersFields, Layout } from 'features/home/contentful'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { AlgoliaHit } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, formatDistance, parseCategory, getDisplayPrice } from 'libs/parsers'
import { ColorsEnum, Spacer } from 'ui/theme'

import { Cover } from '../atoms/Cover'

type OffersModuleProps = {
  algolia: AlgoliaParametersFields
  display: DisplayParametersFields
  isBeneficiary?: boolean
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

const renderSeeMore = (showSeeMore: boolean, layout: Layout, moduleName: string) =>
  showSeeMore ? (
    <Row>
      {/* Gutter: 16px */}
      <Spacer.Row numberOfSpaces={4} />
      <SeeMore layout={layout} onPress={() => analytics.logClickSeeMore(moduleName)} />
      {/* Margin: 24px */}
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  ) : (
    <Spacer.Row numberOfSpaces={6} />
  )

export const OffersModule = (props: OffersModuleProps) => {
  const { hits, nbHits, display, algolia: parameters, position, index, isBeneficiary } = props
  const [hasSeenAllTiles, setHasSeenAllTiles] = useState<boolean>(false)
  const moduleName = display.title || parameters.title
  const renderItem = useCallback(
    ({ item }: { item: Hit<AlgoliaHit> }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      const offerId = dehumanizeId(item.offer.id)
      if (!offerId) return <React.Fragment />
      return (
        <OfferTile
          key={item.objectID}
          category={parseCategory(item.offer.category)}
          offerId={offerId}
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
    [display.layout, position, isBeneficiary]
  )

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment></React.Fragment>

  const showSeeMore =
    hits.length < nbHits &&
    !(parameters.tags || parameters.beginningDatetime || parameters.endingDatetime)

  const logAllTilesSeenOnEndReached = () => {
    if (!hasSeenAllTiles) {
      setHasSeenAllTiles(true)
      analytics.logAllTilesSeen(moduleName, hits.length)
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
        testID="offersModuleList"
        horizontal
        data={hits}
        renderItem={renderItem}
        keyExtractor={(item) => item.objectID}
        ListHeaderComponent={renderHeaderCover(props.cover, display.layout)}
        ItemSeparatorComponent={() => <Spacer.Row numberOfSpaces={4} />}
        ListFooterComponent={renderSeeMore(showSeeMore, display.layout, moduleName)}
        showsHorizontalScrollIndicator={false}
        onEndReached={logAllTilesSeenOnEndReached}
        onEndReachedThreshold={showSeeMore ? 0.6 : 0.1} // We remove the margin
      />
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row' })
