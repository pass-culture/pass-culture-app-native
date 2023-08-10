import { FlashList } from '@shopify/flash-list'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { SearchListProps } from 'features/search/types'
import { Offer } from 'shared/offer/types'
import { getSpacing } from 'ui/theme'

const HIT_SIZE = 130

const keyExtractor = (item: Offer) => item.objectID

export const SearchList: React.FC<SearchListProps> = React.forwardRef<
  FlashList<Offer>,
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
      onEndReached,
      onScroll,
      userData,
    },
    ref
  ) => {
    const theme = useTheme()

    return nbHits > 0 ? (
      <FlashList
        estimatedItemSize={HIT_SIZE}
        ref={ref}
        testID="searchResultsFlashlist"
        data={hits}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<SearchListHeader nbHits={nbHits} userData={userData} />}
        ItemSeparatorComponent={Separator}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={autoScrollEnabled ? onEndReached : undefined}
        scrollEnabled={nbHits > 0}
        onScroll={onScroll}
        contentContainerStyle={{ paddingBottom: theme.tabBar.height + getSpacing(10) }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    ) : (
      <NoSearchResultsWrapper>
        <NoSearchResult />
      </NoSearchResultsWrapper>
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

const NoSearchResultsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
})
