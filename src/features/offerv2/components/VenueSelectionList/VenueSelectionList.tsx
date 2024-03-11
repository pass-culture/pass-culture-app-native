import React, { forwardRef, useCallback } from 'react'
import { FlatList, FlatListProps, View, ViewProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueSelectionListHeader } from 'features/offerv2/components/VenueSelectionListHeader/VenueSelectionListHeader'
import { VenueSelectionListItem } from 'features/offerv2/components/VenueSelectionListItem/VenueSelectionListItem'
import { VenueDetail } from 'features/offerv2/types'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole.web'
import { getSpacing } from 'ui/theme'

export type VenueListItem = VenueDetail & {
  offerId: number
}

export type VenueSelectionListProps = ViewProps &
  Pick<FlatListProps<VenueListItem>, 'onRefresh' | 'refreshing' | 'onScroll'> & {
    selectedItem?: number
    onItemSelect: (itemOfferId: number) => void
    items: VenueListItem[]
    nbLoadedHits: number
    nbHits: number
    autoScrollEnabled: boolean
    isFetchingNextPage: boolean
    onPress?: () => void
    isSharingLocation: boolean
    venueName?: string
    subTitle: string
    headerMessage: string
    onEndReached: () => void
  }

const keyExtractor = (item: VenueListItem) => String(item.offerId)

export const VenueSelectionList = forwardRef<FlatList<VenueListItem>, VenueSelectionListProps>(
  (
    {
      items,
      nbLoadedHits,
      nbHits,
      selectedItem,
      onItemSelect,
      onEndReached,
      refreshing,
      onRefresh,
      isFetchingNextPage,
      onScroll,
      onPress,
      autoScrollEnabled,
      isSharingLocation,
      subTitle,
      headerMessage,
      ...props
    },
    ref
  ) => {
    const { modal } = useTheme()

    const renderItem = useCallback(
      ({ item }: { item: VenueListItem }) => {
        return (
          <ItemWrapper key={item.offerId}>
            <VenueSelectionListItem
              {...item}
              distance={isSharingLocation ? item.distance : ''}
              onSelect={() => onItemSelect(item.offerId)}
              isSelected={selectedItem === item.offerId}
            />
          </ItemWrapper>
        )
      },
      [onItemSelect, selectedItem, isSharingLocation]
    )

    return (
      <FlatList
        accessibilityRole={AccessibilityRole.LIST}
        listAs="ul"
        itemAs="li"
        ref={ref}
        testID="offerVenuesList"
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={autoScrollEnabled ? onEndReached : undefined}
        scrollEnabled={items.length > 0}
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: modal.spacing.MD }}
        ListHeaderComponent={
          <VenueSelectionListHeader
            headerMessage={headerMessage}
            isSharingLocation={isSharingLocation}
            subTitle={subTitle}
          />
        }
        ListFooterComponent={
          <SearchListFooter
            isFetchingNextPage={isFetchingNextPage}
            nbLoadedHits={nbLoadedHits}
            nbHits={nbHits}
            autoScrollEnabled={autoScrollEnabled}
            onPress={onPress}
          />
        }
        {...props}
      />
    )
  }
)
VenueSelectionList.displayName = 'VenueSelectionList'

/**
 * I really don't like to do these styles but since my items are
 * in a `FlatList`, if I don't apply some padding the negative
 * outline won't be visible :(
 *
 * So I have to add a padding so it's visible again.
 */
const ItemWrapper = styled(View)({
  paddingHorizontal: getSpacing(1),
  paddingTop: getSpacing(2),
})
