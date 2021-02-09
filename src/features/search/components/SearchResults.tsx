import flatten from 'lodash.flatten'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { FadeScrollingView, useDebouncedScrolling } from 'features/search/atoms'
import { Hit, NoSearchResult, NumberOfResults } from 'features/search/atoms'
import { Filter } from 'features/search/atoms/Buttons'
import { SearchAlgoliaHit } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { useSearchResults } from '../pages/useSearchResults'

const keyExtractor = (item: SearchAlgoliaHit) => item.objectID
const renderItem = ({ item: hit }: { item: SearchAlgoliaHit }) => <Hit hit={hit} />

export const SearchResults: React.FC = () => {
  const { isScrolling, handleIsScrolling } = useDebouncedScrolling()
  const { hasNextPage, fetchNextPage, data } = useSearchResults()

  if (!data) return <React.Fragment></React.Fragment>

  const hits: SearchAlgoliaHit[] = flatten(data.pages.map((page) => page.hits))
  const { nbHits } = data.pages[0]

  const onEndReached = () => {
    if (hasNextPage) {
      const [lastPage] = data.pages.slice(-1)
      if (lastPage.page > 0) analytics.logSearchScrollToPage(lastPage.page)
      fetchNextPage()
    }
  }

  return (
    <React.Fragment>
      <Container>
        <FlatList
          testID="searchResultsFlatlist"
          data={hits}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={contentContainerStyle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<NumberOfResults nbHits={nbHits} />}
          ListFooterComponent={Footer}
          ItemSeparatorComponent={Separator}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onScrollEndDrag={handleIsScrolling(false)}
          onScrollBeginDrag={handleIsScrolling(true)}
          scrollEnabled={nbHits > 0}
          ListEmptyComponent={NoSearchResult}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Container>
      {nbHits > 0 && (
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

const contentContainerStyle = { flexGrow: 1 }
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
