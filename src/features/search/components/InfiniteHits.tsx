import React from 'react'
import { connectInfiniteHits } from 'react-instantsearch-native'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { Hit, NumberOfResults } from 'features/search/atoms'
import { AlgoliaHit } from 'libs/algolia'
import { ColorsEnum, getSpacing } from 'ui/theme'

interface Props {
  hits: AlgoliaHit[]
}

export const InfiniteHitsComponent: React.FC<Props> = ({ hits }) => (
  <Container>
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      ListHeaderComponent={() => <NumberOfResults nbHits={hits.length} />}
      ListFooterComponent={Footer}
      ItemSeparatorComponent={Separator}
      renderItem={({ item: hit }) => <Hit hit={hit} />}
    />
  </Container>
)

const Container = styled.View({ height: '100%' })
const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT + getSpacing(52) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
})

export const InfiniteHits = connectInfiniteHits(InfiniteHitsComponent)
