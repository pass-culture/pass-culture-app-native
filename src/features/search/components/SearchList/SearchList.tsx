import { FlashList } from '@shopify/flash-list'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { LIST_ITEM_HEIGHT } from 'features/search/constants'
import { SearchListProps } from 'features/search/types'
import { Offer } from 'shared/offer/types'
import { getSpacing } from 'ui/theme'

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
      venuesUserData,
    },
    ref
  ) => {
    const theme = useTheme()

    return (
      <FlashList
        estimatedItemSize={LIST_ITEM_HEIGHT}
        ref={ref}
        testID="searchResultsFlashlist"
        data={hits}
        keyExtractor={keyExtractor}
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
