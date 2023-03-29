import React, { forwardRef } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { SearchListProps } from 'features/search/types'
import { SearchHit } from 'libs/algolia'
import { getSpacing } from 'ui/theme'

const keyExtractor = (item: SearchHit) => item.objectID

const contentContainerStyle = {
  flex: 1,
}

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
      userData,
    },
    ref
  ) => {
    return (
      <FlatList
        listAs="ul"
        itemAs="li"
        ref={ref}
        testID="searchResultsFlatlist"
        data={hits}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<SearchListHeader nbHits={nbHits} userData={userData} />}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={
          <SearchListFooter
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
        contentContainerStyle={contentContainerStyle}
      />
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
