import React, { forwardRef } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { SearchListProps } from 'features/search/types'
import { Offer } from 'shared/offer/types'
import { getSpacing } from 'ui/theme'

const keyExtractor = (item: Offer) => item.objectID

const contentContainerStyle = {
  flex: 1,
}

export const SearchList: React.FC<SearchListProps> = forwardRef<FlatList<Offer>, SearchListProps>(
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
      venuesUserData,
    },
    ref
  ) => {
    return (
      <FlatList
        listAs="ul"
        itemAs="li"
        ref={ref}
        testID="searchResultsFlatlist"
        data={hits.offers}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <SearchListHeader
            nbHits={nbHits}
            userData={userData}
            venues={hits.venues}
            venuesUserData={venuesUserData}
          />
        }
        ItemSeparatorComponent={Separator}
        ListFooterComponent={
          <SearchListFooter
            isFetchingNextPage={isFetchingNextPage}
            nbLoadedHits={hits.offers?.length}
            nbHits={nbHits}
            autoScrollEnabled={autoScrollEnabled}
            onPress={onPress}
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
