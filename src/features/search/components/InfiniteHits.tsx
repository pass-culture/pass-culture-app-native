import React from 'react'
import { Dimensions, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { AlgoliaHit } from 'libs/algolia'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { ColorsEnum, getSpacing } from 'ui/theme'

import { Hit } from '../atoms/Hit'

interface Props {
  hits?: AlgoliaHit[]
}

// TODO: do not use mockedAlgoliaResponse, but get real hits from Algolia
export const InfiniteHits: React.FC<Props> = ({ hits = mockedAlgoliaResponse.hits }) => (
  <Container>
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={Separator}
      renderItem={({ item: hit }) => <Hit hit={hit} />}
    />
  </Container>
)

const { width } = Dimensions.get('window')
const Container = styled.View({ flex: 1, width: width - getSpacing(2 * 6) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
