import React, { CSSProperties } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'
import { VenueDetails } from 'features/offer/components/VenueDetails/VenueDetails'
import {
  VenueListItem,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { VenueSelectionListHeader } from 'features/offer/components/VenueSelectionListHeader/VenueSelectionListHeader'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { getSpacing } from 'ui/theme'

export type RowData = {
  items: VenueListItem[]
  nbHits: VenueSelectionListProps['nbHits']
  isFetchingNextPage: VenueSelectionListProps['isFetchingNextPage']
  autoScrollEnabled: VenueSelectionListProps['autoScrollEnabled']
  onPress: VenueSelectionListProps['onPress']
  isSharingLocation: boolean
  subTitle: string
  headerMessage: string
  selectedItem?: number
  onItemSelect: (itemOfferId: number) => void
}

interface RowProps {
  index: number
  style: CSSProperties
  data: RowData
}

export function VenueSelectionListItem({ index, style, data }: Readonly<RowProps>) {
  const isHeader = index === 0
  const isFooter = index === data.items.length - 1
  const hasHits = data.nbHits > 0
  const shouldDisplayHeader = isHeader && hasHits
  const item = data.items[index]

  if (shouldDisplayHeader) {
    return (
      <li style={style}>
        <Wrapper>
          <VenueSelectionListHeader
            subTitle={data.subTitle}
            isSharingLocation={data.isSharingLocation}
            headerMessage={data.headerMessage}
          />
        </Wrapper>
      </li>
    )
  }

  if (isFooter) {
    return (
      <li style={style}>
        <SearchListFooter
          isFetchingNextPage={data.isFetchingNextPage}
          nbLoadedHits={data.items.length}
          nbHits={data.nbHits}
          autoScrollEnabled={data.autoScrollEnabled}
          onPress={data.onPress}
        />
      </li>
    )
  }

  if (!item) {
    return null
  }

  return (
    <li style={style}>
      <Wrapper>
        <ItemWrapper>
          <SelectableListItem
            onSelect={() => data.onItemSelect(item.offerId)}
            isSelected={data.selectedItem === item?.offerId}
            testID="venue-selection-list-item"
            render={({ isHover }) => (
              <VenueDetails
                title={item.title}
                address={item.address}
                distance={data.isSharingLocation ? item.distance : ''}
                isHover={isHover}
              />
            )}
          />
        </ItemWrapper>
      </Wrapper>
    </li>
  )
}

const ItemWrapper = styled(View)({
  paddingTop: getSpacing(2),
})

const Wrapper = styled(View)(({ theme }) => ({
  paddingLeft: theme.modal.spacing.MD,
  paddingRight: theme.modal.spacing.MD,
}))
