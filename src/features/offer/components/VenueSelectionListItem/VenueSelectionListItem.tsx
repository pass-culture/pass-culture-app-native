import React from 'react'

import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'

import { VenueDetails, VenueDetailsProps } from '../VenueDetails/VenueDetails'

type VenueSelectionListItemProps = VenueDetailsProps & {
  isSelected?: boolean
  onSelect: VoidFunction
}

export function VenueSelectionListItem({
  onSelect,
  isSelected = false,
  ...props
}: VenueSelectionListItemProps) {
  return (
    <SelectableListItem
      onSelect={onSelect}
      isSelected={isSelected}
      testID="venue-selection-list-item"
      render={({ isHover }) => <VenueDetails {...props} isHover={isHover} />}
      hasDistanceTag={!!props.distance}
    />
  )
}
