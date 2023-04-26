import React, { useCallback } from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { VenueSelectionListItem } from 'features/offer/components/VenueSelectionListItem/VenueSelectionListItem'
import { VenueDetail } from 'features/offer/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

export type VenueListItem = VenueDetail & {
  offerId: number
}

export type VenueSelectionListProps = ViewProps & {
  selectedItem?: number
  onItemSelect: (itemOfferId: number) => void
  items: VenueListItem[]
}

function keyExtractor(item: VenueListItem) {
  return String(item.offerId)
}

export function VenueSelectionList({
  items,
  selectedItem,
  onItemSelect,
  ...props
}: VenueSelectionListProps) {
  const renderItem = useCallback(
    (item: VenueListItem) => {
      return (
        <ItemWrapper>
          <VenueSelectionListItem
            {...item}
            onSelect={() => onItemSelect(item.offerId)}
            isSelected={selectedItem === item.offerId}
          />
        </ItemWrapper>
      )
    },
    [onItemSelect, selectedItem]
  )

  return (
    <View {...props}>
      {items.length > 0 && (
        <VerticalUl>
          {items.map((item) => (
            <Li key={keyExtractor(item)}>{renderItem(item)}</Li>
          ))}
        </VerticalUl>
      )}
    </View>
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
