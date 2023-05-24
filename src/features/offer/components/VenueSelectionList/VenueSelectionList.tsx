import React, { useCallback } from 'react'
import { FlatList, FlatListProps, View, ViewProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueSelectionListItem } from 'features/offer/components/VenueSelectionListItem/VenueSelectionListItem'
import { VenueDetail } from 'features/offer/types'
import { getSpacing } from 'ui/theme'

export type VenueListItem = VenueDetail & {
  offerId: number
}

export type VenueSelectionListProps = ViewProps &
  Pick<FlatListProps<VenueListItem>, 'onRefresh' | 'refreshing' | 'onEndReached' | 'onScroll'> & {
    selectedItem?: number
    onItemSelect: (itemOfferId: number) => void
    items: VenueListItem[]
  }

const keyExtractor = (item: VenueListItem) => String(item.offerId)

export function VenueSelectionList({
  items,
  selectedItem,
  onItemSelect,
  onEndReached,
  refreshing,
  onRefresh,
  onScroll,
  ...props
}: VenueSelectionListProps) {
  const { modal } = useTheme()

  const handleOnSelect = useCallback(
    (itemOfferId: number) => onItemSelect(itemOfferId),
    [onItemSelect]
  )

  const renderItem = useCallback(
    ({ item }: { item: VenueListItem }) => {
      return (
        <ItemWrapper>
          <VenueSelectionListItem
            {...item}
            onSelect={() => handleOnSelect(item.offerId)}
            isSelected={selectedItem === item.offerId}
          />
        </ItemWrapper>
      )
    },
    [handleOnSelect, selectedItem]
  )

  return (
    <FlatList
      listAs="ul"
      itemAs="li"
      testID="offerVenuesList"
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      scrollEnabled={items.length > 0}
      onScroll={onScroll}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ paddingHorizontal: modal.spacing.MD }}
      {...props}
    />
  )
}

/**
 * I really don't like to do these styles but since my items are
 * in a `FlatList`, if I don't apply some padding the negative
 * outline won't be visible :(
 *
 * So I have to add a padding so it's visible again.
 */
const ItemWrapper = styled(View)({
  paddingHorizontal: getSpacing(1),
  paddingVertical: getSpacing(2),
})
