import React from 'react'
import { FlatList, View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { VenueSelectionListItem } from 'features/offer/components/VenueSelectionListItem/VenueSelectionListItem'
import { VenueDetail } from 'features/offer/types'
import { getSpacing } from 'ui/theme'

export type VenueListItem = VenueDetail & {
  offerId: string
}

export type VenueSelectionListProps = ViewProps & {
  selectedItem?: string
  onItemSelect: (itemOfferId: string) => void
  items: VenueListItem[]
}

function keyExtractor(item: VenueListItem) {
  return item.offerId
}

export function VenueSelectionList({
  items,
  selectedItem,
  onItemSelect,
  ...props
}: VenueSelectionListProps) {
  return (
    <View {...props}>
      <FlatList
        keyExtractor={keyExtractor}
        data={items}
        renderItem={({ item }) => (
          <ItemWrapper>
            <VenueSelectionListItem
              {...item}
              onSelect={() => onItemSelect(item.offerId)}
              isSelected={selectedItem === item.offerId}
            />
          </ItemWrapper>
        )}
      />
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
