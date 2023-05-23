import React, { useCallback } from 'react'
import { FlatList, View, ViewProps } from 'react-native'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

import { Coordinates } from 'api/gen'
import { VenueSelectionListItem } from 'features/offer/components/VenueSelectionListItem/VenueSelectionListItem'
import { VenueDetail } from 'features/offer/types'
import { Geoloc } from 'libs/algolia'
import { Position, useGeolocation } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'
import { getSpacing } from 'ui/theme'

export type VenueListItem = VenueDetail & {
  offerId: number
  price?: number
  coordinates?: Geoloc
  venueId?: number
}

export type VenueSelectionListProps = ViewProps & {
  selectedItem?: number
  onItemSelect: (itemOfferId: number) => void
  items: VenueListItem[]
  onEndReached?: VoidFunction
  refreshing?: boolean
  onRefresh?: (() => void) | null | undefined
  offerVenueLocation?: Coordinates
  onScroll?: VoidFunction
}

const keyExtractor = (item: VenueListItem) => String(item.offerId)

type GetVenueItemDistanceType = {
  item: VenueListItem
  userPosition: Position | null
  offerVenueLocation?: Coordinates
}
export function getVenueItemDistance({
  item,
  userPosition,
  offerVenueLocation,
}: GetVenueItemDistanceType) {
  return item.coordinates
    ? formatDistance(item.coordinates, userPosition ?? (offerVenueLocation as Position))
    : item.distance
}

export function VenueSelectionList({
  items,
  selectedItem,
  onItemSelect,
  onEndReached,
  refreshing,
  onRefresh,
  onScroll,
  offerVenueLocation,
  ...props
}: VenueSelectionListProps) {
  const { modal } = useTheme()
  const { userPosition: position } = useGeolocation()

  const renderItem = useCallback(
    ({ item }: { item: VenueListItem }) => {
      return (
        <ItemWrapper>
          <VenueSelectionListItem
            {...item}
            distance={getVenueItemDistance({ item, userPosition: position, offerVenueLocation })}
            onSelect={() => onItemSelect(item.offerId)}
            isSelected={selectedItem === item.offerId}
          />
        </ItemWrapper>
      )
    },
    [offerVenueLocation, onItemSelect, position, selectedItem]
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
