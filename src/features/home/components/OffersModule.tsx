import React, { useState } from 'react'
import { PixelRatio, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle } from 'features/home/atoms'
import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit } from 'libs/algolia'
import { algoliaHits } from 'libs/algolia/algoliaHits'

type OfferWithOptionalCover = Partial<OffersWithCover> & Pick<Offers, 'algolia' | 'display'>

export const OffersModule = (props: OfferWithOptionalCover) => {
  const { algolia, display } = props
  const { minOffers, title } = display
  // TODO(agarcia): actually get hits and nbHits from querying algolia
  const [hits] = useState<AlgoliaHit[]>(algoliaHits)
  const [nbHits] = useState(20)

  const atLeastOneHit = hits.length > 0
  const minOffersHasBeenReached = nbHits >= minOffers
  const shouldModuleBeDisplayed = atLeastOneHit && minOffersHasBeenReached
  const showSeeMore =
    hits.length < nbHits &&
    !('tags' in algolia || 'beginningDatetime' in algolia || 'endingDatetime' in algolia)

  if (!shouldModuleBeDisplayed) return <></>

  return (
    <Container>
      <Margin />
      <ModuleTitle title={title} />
      <Gutter />
      <FlatList
        horizontal
        data={hits}
        renderItem={({ item }) => <OfferTile tile={item} />}
        keyExtractor={(item) => item.objectID}
        ListHeaderComponent={() => <Margin />}
        ItemSeparatorComponent={() => <Gutter />}
        ListFooterComponent={showSeeMore ? <></> : <></>} // TODO: 'See more' design
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

// TODO(agarcia): place these constants in a file for style
const MARGIN_DP = 24
const GUTTER_DP = 16

const Container = styled.View({
  flex: 1,
})

const Margin = styled.View({
  width: PixelRatio.roundToNearestPixel(MARGIN_DP),
  height: PixelRatio.roundToNearestPixel(MARGIN_DP),
})

const Gutter = styled.View({
  width: PixelRatio.roundToNearestPixel(GUTTER_DP),
  height: PixelRatio.roundToNearestPixel(GUTTER_DP),
})
