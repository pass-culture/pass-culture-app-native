import React, { useRef } from 'react'
import { connectInfiniteHits } from 'react-instantsearch-native'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { FadeScrollingView } from 'features/search/atoms'
import { Hit, NumberOfResults } from 'features/search/atoms'
import { Filter } from 'features/search/atoms/Buttons'
import { AlgoliaHit } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { NoSearchResult } from '../atoms/NoSearchResult'

interface Props {
  hits: AlgoliaHit[]
  hasMore: boolean
  refineNext: () => void
  handleIsScrolling: (value: boolean) => () => void
  isScrolling: boolean
}

export const InfiniteHitsComponent: React.FC<Props> = ({
  hits,
  hasMore,
  refineNext,
  handleIsScrolling,
  isScrolling,
}) => {
  const currentPage = useRef<number>(0)

  const onEndReached = () => {
    if (hasMore) {
      currentPage.current += 1
      refineNext()
      analytics.logSearchScrollToPage(currentPage.current)
    }
  }

  return (
    <React.Fragment>
      <Container>
        <FlatList
          testID="infiniteHitsFlatlist"
          data={hits}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => item.objectID}
          ListHeaderComponent={NumberOfResults}
          ListFooterComponent={Footer}
          ItemSeparatorComponent={Separator}
          renderItem={({ item: hit }) => <Hit hit={hit} />}
          onEndReached={onEndReached}
          onScrollEndDrag={handleIsScrolling(false)}
          onScrollBeginDrag={handleIsScrolling(true)}
          scrollEnabled={hits.length > 0}
          ListEmptyComponent={NoSearchResult}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Container>
      {hits.length > 0 && (
        <FilterContainer>
          <FadeScrollingView isScrolling={isScrolling}>
            <Filter />
          </FadeScrollingView>
          <Spacer.BottomScreen />
        </FilterContainer>
      )}
    </React.Fragment>
  )
}

const Container = styled.View({ height: '100%' })
const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT + getSpacing(52) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
})

const FilterContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})

export const InfiniteHits = connectInfiniteHits(InfiniteHitsComponent)
