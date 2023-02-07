import React, { forwardRef } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { ListFooterComponent } from 'features/search/components/SearchResults/ListFooterComponent'
import { ListHeaderComponent } from 'features/search/components/SearchResults/ListHeaderComponent'
import { SearchListProps } from 'features/search/components/SearchResults/type'
import { SearchHit } from 'libs/search'
import { getSpacing } from 'ui/theme'

const keyExtractor = (item: SearchHit) => item.objectID

export const SearchList: React.FC<SearchListProps> = forwardRef<
  FlatList<SearchHit>,
  SearchListProps
>(
  (
    {
      nbHits,
      hits,
      renderItem,
      autoScrollEnabled,
      refreshing,
      onRefresh,
      isFetchingNextPage,
      onEndReached,
      onScroll,
      onPress,
    },
    ref
  ) => {
    return (
      <React.Fragment>
        <FlatList
          listAs="ul"
          itemAs="li"
          ref={ref}
          testID="searchResultsFlatlist"
          data={hits}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<ListHeaderComponent nbHits={nbHits} />}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={
            <ListFooterComponent
              isFetchingNextPage={isFetchingNextPage}
              hits={hits}
              nbHits={nbHits}
              autoScrollEnabled={autoScrollEnabled}
              onPress={onPress}
              ref={ref}
            />
          }
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
