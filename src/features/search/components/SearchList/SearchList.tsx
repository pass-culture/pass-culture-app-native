import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { useTheme } from 'styled-components/native'

import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { LIST_ITEM_HEIGHT } from 'features/search/constants'
import { GridListLayout, SearchListProps } from 'features/search/types'
import { Offer } from 'shared/offer/types'
import { LineSeparator } from 'ui/components/LineSeparator'
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
      artistSection,
      numColumns,
      setGridListLayout,
      isGridLayout,
      shouldDisplayGridList,
    },
    ref
  ) => {
    const { tabBar } = useTheme()
    return (
      <FlashList
        estimatedItemSize={LIST_ITEM_HEIGHT}
        ref={ref}
        key={isGridLayout ? 'grid_search_results' : 'list_search_results'}
        testID="searchResultsFlashlist"
        data={hits.offers}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <SearchListHeader
            nbHits={nbHits}
            userData={userData}
            venues={hits.venues}
            artistSection={artistSection}
            venuesUserData={venuesUserData}
            setGridListLayout={setGridListLayout}
            selectedGridListLayout={isGridLayout ? GridListLayout.GRID : GridListLayout.LIST}
            shouldDisplayGridList={shouldDisplayGridList}
          />
        }
        ItemSeparatorComponent={isGridLayout ? undefined : LineSeparator}
        renderItem={renderItem}
        numColumns={isGridLayout ? numColumns : undefined}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={autoScrollEnabled ? onEndReached : undefined}
        scrollEnabled={nbHits > 0}
        onScroll={onScroll}
        contentContainerStyle={{ paddingBottom: tabBar.height + getSpacing(10) }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    )
  }
)
SearchList.displayName = 'SearchList'
