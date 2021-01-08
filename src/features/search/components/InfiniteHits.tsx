import React from 'react'
import { FlatList } from 'react-native'
import { connectInfiniteHits } from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { AlgoliaHit } from 'libs/algolia'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  hits: AlgoliaHit[]
  hasMore: boolean
  refine: Function
}

const placeholderUrl =
  'https://axiomoptics.com/wp-content/uploads/2019/08/placeholder-images-image_large.png'

const renderItem = ({ item }: { item: AlgoliaHit }) => (
  <Row>
    <Image resizeMode="cover" source={{ uri: item.offer.thumbUrl || placeholderUrl }} />
    <ItemName numberOfLines={2}>{item.offer.name}</ItemName>
  </Row>
)

export const InfiniteHitsComponent: React.FC<Props> = ({ hits, hasMore, refine }) => (
  <Container>
    <FlatList
      data={hits}
      onEndReached={() => hasMore && refine()}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={Separator}
      renderItem={renderItem}
    />
  </Container>
)

const Container = styled.View({ flex: 1 })
const Row = styled.View({ flexDirection: 'row', paddingVertical: getSpacing(5) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  width: '100%',
})
const ItemName = styled(Typo.Body)({ padding: getSpacing(2) })

const imageWidth = getSpacing(20)
const imageHeight = getSpacing(30)
const Image = styled.Image({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  height: imageHeight,
  width: imageWidth,
})

export const InfiniteHits = connectInfiniteHits(InfiniteHitsComponent)
