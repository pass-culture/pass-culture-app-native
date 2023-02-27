import { FlashList } from '@shopify/flash-list'
import React from 'react'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { ListHeaderComponent } from 'features/search/components/SearchResults/ListHeaderComponent'
import { SearchListProps } from 'features/search/components/SearchResults/type'
import { SearchHit } from 'libs/algolia'
import { getSpacing } from 'ui/theme'

const HIT_SIZE = 130

const keyExtractor = (item: SearchHit) => item.objectID

export const SearchList: React.FC<SearchListProps> = React.forwardRef<
  FlashList<SearchHit>,
  SearchListProps
>(
  (
    { nbHits, hits, renderItem, autoScrollEnabled, refreshing, onRefresh, onEndReached, onScroll },
    ref
  ) => {
    return (
      <React.Fragment>
        <FlashList
          estimatedItemSize={HIT_SIZE}
          ref={ref}
          testID="searchResultsFlatlist"
          data={hits}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<ListHeaderComponent nbHits={nbHits} />}
          ItemSeparatorComponent={Separator}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={autoScrollEnabled ? onEndReached : undefined}
          scrollEnabled={nbHits > 0}
          ListEmptyComponent={<NoSearchResult />}
          onScroll={onScroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </React.Fragment>
    )
  }
)
SearchList.displayName = 'SearchList'

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))
